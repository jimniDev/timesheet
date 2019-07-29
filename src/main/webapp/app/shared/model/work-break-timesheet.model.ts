import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { IWorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';

export interface IWorkBreakTimesheet {
  id?: number;
  minutes?: number;
  employee?: IEmployeeTimesheet;
  workDay?: IWorkDayTimesheet;
}

export class WorkBreakTimesheet implements IWorkBreakTimesheet {
  constructor(public id?: number, public minutes?: number, public employee?: IEmployeeTimesheet, public workDay?: IWorkDayTimesheet) {}
}
