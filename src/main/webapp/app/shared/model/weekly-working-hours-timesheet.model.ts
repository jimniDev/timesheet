import { Moment } from 'moment';
import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';

export interface IWeeklyWorkingHoursTimesheet {
  id?: number;
  hours?: number;
  startDate?: Moment;
  endDate?: Moment;
  employee?: IEmployeeTimesheet;
}

export class WeeklyWorkingHoursTimesheet implements IWeeklyWorkingHoursTimesheet {
  constructor(
    public id?: number,
    public hours?: number,
    public startDate?: Moment,
    public endDate?: Moment,
    public employee?: IEmployeeTimesheet
  ) {}
}
