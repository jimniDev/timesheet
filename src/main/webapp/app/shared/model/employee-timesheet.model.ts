import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { ITargetWorkingDayTimesheet } from 'app/shared/model/target-working-day-timesheet.model';
import { IWeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';
import { IWorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';
import { IUser } from 'app/core';

export interface IEmployeeTimesheet {
  id?: number;
  isEmployed?: boolean;
  user?: IUser;
  workingEntries?: IWorkingEntryTimesheet[];
  targetWorkingDays?: ITargetWorkingDayTimesheet[];
  weeklyWorkingHours?: IWeeklyWorkingHoursTimesheet[];
  workDays?: IWorkDayTimesheet[];
  activeWeeklyWorkingHours?: IWeeklyWorkingHoursTimesheet;
  balance?: number;
}

export class EmployeeTimesheet implements IEmployeeTimesheet {
  constructor(
    public id?: number,
    public isEmployed?: boolean,
    public user?: IUser,
    public workingEntries?: IWorkingEntryTimesheet[],
    public targetWorkingDays?: ITargetWorkingDayTimesheet[],
    public weeklyWorkingHours?: IWeeklyWorkingHoursTimesheet[],
    public workDays?: IWorkDayTimesheet[],
    public activeWeeklyWorkingHours?: IWeeklyWorkingHoursTimesheet,
    public balance?: number
  ) {
    this.isEmployed = this.isEmployed || false;
  }
}
