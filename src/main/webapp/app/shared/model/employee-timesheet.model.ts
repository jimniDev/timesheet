import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { IWeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';
import { IWorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';
import { IUser } from 'app/core';

export interface IEmployeeTimesheet {
  id?: number;
  editPermitted?: boolean;
  office?: string;
  user?: IUser;
  workingEntries?: IWorkingEntryTimesheet[];
  weeklyWorkingHours?: IWeeklyWorkingHoursTimesheet[];
  workDays?: IWorkDayTimesheet[];
  activeWeeklyWorkingHours?: IWeeklyWorkingHoursTimesheet;
  balance?: number;
}

export class EmployeeTimesheet implements IEmployeeTimesheet {
  constructor(
    public id?: number,
    public editPermitted?: boolean,
    public office?: string,
    public user?: IUser,
    public workingEntries?: IWorkingEntryTimesheet[],
    public weeklyWorkingHours?: IWeeklyWorkingHoursTimesheet[],
    public workDays?: IWorkDayTimesheet[],
    public activeWeeklyWorkingHours?: IWeeklyWorkingHoursTimesheet,
    public balance?: number
  ) {
    this.editPermitted = this.editPermitted || false;
  }
}
