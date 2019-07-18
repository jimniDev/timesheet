import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { IDayTimesheet } from 'app/shared/model/day-timesheet.model';

export interface IWorkingDayTimesheet {
  id?: number;
  hours?: number;
  employee?: IEmployeeTimesheet;
  day?: IDayTimesheet;
}

export class WorkingDayTimesheet implements IWorkingDayTimesheet {
  constructor(public id?: number, public hours?: number, public employee?: IEmployeeTimesheet, public day?: IDayTimesheet) {}
}
