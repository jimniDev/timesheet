import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { Inject, Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EmployeeTimesheetService } from './employee-timesheet.service';
import { IEmployeeTimesheet, EmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { WeeklyWorkingHoursTimesheet, IWeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';
import moment = require('moment');
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { WeeklyWorkingHoursTimesheetService } from '../weekly-working-hours-timesheet';
import { runInThisContext } from 'vm';

@Component({
  selector: 'employee-time-sheet-weekly-dialog-component',
  templateUrl: './employee-time-sheet-weekly-dialog-component.html'
})
export class EmployeeTimeSheetWeeklyDialogComponent {
  public myStartDate: Date;
  public myEndDate: Date;
  public myHour: string;
  employee: IEmployeeTimesheet;

  hourValueChange(hrValue: string) {
    this.myHour = hrValue;
  }

  pickStartDate(event: MatDatepickerInputEvent<Date>): void {
    this.myStartDate = event.value;
  }

  pickEndDate(event: MatDatepickerInputEvent<Date>): void {
    this.myEndDate = event.value;
  }
  constructor(
    public employeeDialogRef: MatDialogRef<EmployeeTimeSheetWeeklyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private weeklyWorkingHoursService: WeeklyWorkingHoursTimesheetService
  ) {
    this.employee = data.employee;
    this.myHour = '0';
  }

  onSubmit() {
    let weeklyHours: WeeklyWorkingHoursTimesheet;
    weeklyHours = new WeeklyWorkingHoursTimesheet();

    weeklyHours.startDate = moment(this.myStartDate);
    weeklyHours.endDate = moment(this.myEndDate);
    weeklyHours.hours = this.myHour;
    weeklyHours.employee = this.employee;

    this.weeklyWorkingHoursService.create(weeklyHours).subscribe(res => {
      if (res.ok) {
        this.employeeDialogRef.close(res.body);
      }
    });
  }

  close(): void {
    this.employeeDialogRef.close();
  }
}
