import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { Inject, Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { IEmployeeTimesheet, EmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { WeeklyWorkingHoursTimesheet, IWeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';
import * as moment from 'moment';
import { WeeklyWorkingHoursTimesheetService } from '../weekly-working-hours-timesheet';
import { FormGroup, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { Platform } from '@angular/cdk/platform';
import { Subject } from 'rxjs';

@Component({
  selector: 'employee-time-sheet-weekly-dialog-component',
  templateUrl: './employee-time-sheet-weekly-dialog-component.html'
})
export class EmployeeTimeSheetWeeklyDialogComponent {
  public employee: IEmployeeTimesheet;

  employeeWeeklyForm = new FormGroup({
    weeklyHour: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^([0-9]*)$')])),
    startingDate: new FormControl(''),
    endingDate: new FormControl('')
  });

  constructor(
    public employeeDialogRef: MatDialogRef<EmployeeTimeSheetWeeklyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private weeklyWorkingHoursService: WeeklyWorkingHoursTimesheetService,
    private platform: Platform
  ) {
    this.employee = data.employee;
  }

  onKeyDown(event) {
    const e = <KeyboardEvent>event;
    if (
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      [189, 190, 110, 109].indexOf(e.keyCode) === -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39) ||
      (e.keyCode >= 65 && e.keyCode <= 90)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }

  onSubmit(): void {
    const weeklyEntry: WeeklyWorkingHoursTimesheet = new WeeklyWorkingHoursTimesheet();
    weeklyEntry.hours = this.employeeWeeklyForm.value.weeklyHour;
    weeklyEntry.startDate = moment(this.employeeWeeklyForm.value.startingDate).add(2, 'hours');
    weeklyEntry.endDate = moment(this.employeeWeeklyForm.value.endingDate).add(2, 'hours');
    weeklyEntry.employee = this.employee;

    this.weeklyWorkingHoursService.create(weeklyEntry).subscribe(res => {
      if (res.ok) {
        this.employeeDialogRef.close(res.body);
      }
    });
  }

  close(): void {
    this.employeeDialogRef.close();
  }
}
