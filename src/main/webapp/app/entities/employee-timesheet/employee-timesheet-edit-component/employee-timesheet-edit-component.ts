import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IWeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';

import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WeeklyWorkingHoursTimesheetService } from 'app/entities/weekly-working-hours-timesheet/weekly-working-hours-timesheet.service';
import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';

@Component({
  selector: 'employee-timesheet-edit-component',
  templateUrl: './employee-timesheet-edit-component.html',
  styleUrls: ['./employee-timesheet-edit-component.scss']
})
export class EmployeeTimesheetEditComponent implements OnInit {
  public employee: IEmployeeTimesheet;

  public role: IWeeklyWorkingHoursTimesheet;

  employeeWeeklyForm = new FormGroup({
    weeklyHour: new FormControl(this.data.hours, Validators.compose([Validators.required, Validators.pattern('^([0-9]*)$')])),
    startingDate: new FormControl(this.data.startDate),
    endingDate: new FormControl(this.data.endDate)
  });

  constructor(
    public employeeDialogRef: MatDialogRef<EmployeeTimesheetEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private weeklyWorkingHoursService: WeeklyWorkingHoursTimesheetService
  ) {
    this.employee = data.employee;

    this.role = data.role;
  }

  ngOnInit() {}

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
    this.data.weeklyWorkingHour.hours = this.employeeWeeklyForm.value.weeklyHour;
    this.data.weeklyWorkingHour.startDate = moment(this.employeeWeeklyForm.value.startingDate).add(2, 'hours');
    if (this.employeeWeeklyForm.value.endingDate) {
      this.data.weeklyWorkingHour.endDate = moment(this.employeeWeeklyForm.value.endingDate).add(2, 'hours');
    }
    this.data.weeklyWorkingHour.employee = this.employee;

    this.weeklyWorkingHoursService.update(this.data.weeklyWorkingHour).subscribe(res => {
      if (res.ok) {
        this.employeeDialogRef.close(res.body);
      }
    });
  }

  close(): void {
    this.employeeDialogRef.close();
  }
}
