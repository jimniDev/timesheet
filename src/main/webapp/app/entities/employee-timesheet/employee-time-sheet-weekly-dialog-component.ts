import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';
import { Inject, Component } from '@angular/core';
import { IEmployeeTimesheet, EmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { WeeklyWorkingHoursTimesheet, IWeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';
import * as moment from 'moment';
import { WeeklyWorkingHoursTimesheetService } from '../weekly-working-hours-timesheet';

@Component({
  selector: 'employee-time-sheet-weekly-dialog-component',
  templateUrl: './employee-time-sheet-weekly-dialog-component.html'
})
export class EmployeeTimeSheetWeeklyDialogComponent {
  public myStartDate: Date;
  public myEndDate: Date;
  public myHour: number;

  public employee: IEmployeeTimesheet;

  hourValueChange(hrValue: number) {
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
    this.myHour = 0;
    this.myEndDate = null;
  }

  onSubmit() {
    let weeklyHours: WeeklyWorkingHoursTimesheet;
    weeklyHours = new WeeklyWorkingHoursTimesheet();

    weeklyHours.startDate = moment(this.myStartDate).add(2, 'hours');
    weeklyHours.endDate = moment(this.myEndDate).add(2, 'hours');
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
