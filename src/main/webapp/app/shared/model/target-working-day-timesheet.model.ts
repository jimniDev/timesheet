import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { IDayOfWeekTimesheet } from 'app/shared/model/day-of-week-timesheet.model';

export interface ITargetWorkingDayTimesheet {
  id?: number;
  hours?: number;
  employee?: IEmployeeTimesheet;
  dayOfWeek?: IDayOfWeekTimesheet;
}

export class TargetWorkingDayTimesheet implements ITargetWorkingDayTimesheet {
  constructor(public id?: number, public hours?: number, public employee?: IEmployeeTimesheet, public dayOfWeek?: IDayOfWeekTimesheet) {}
}
