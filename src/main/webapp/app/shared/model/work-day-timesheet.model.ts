import { Moment } from 'moment';
import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { IWorkBreakTimesheet } from 'app/shared/model/work-break-timesheet.model';
import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';

export interface IWorkDayTimesheet {
  id?: number;
  date?: Moment;
  workingEntries?: IWorkingEntryTimesheet[];
  workBreaks?: IWorkBreakTimesheet[];
  employee?: IEmployeeTimesheet;
  totalBreakMinutes?: number;
}

export class WorkDayTimesheet implements IWorkDayTimesheet {
  constructor(
    public id?: number,
    public date?: Moment,
    public workingEntries?: IWorkingEntryTimesheet[],
    public workBreaks?: IWorkBreakTimesheet[],
    public employee?: IEmployeeTimesheet,
    public totalBreakMinutes?: number
  ) {}
}
