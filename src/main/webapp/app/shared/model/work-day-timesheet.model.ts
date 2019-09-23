import { Moment } from 'moment';
import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';

export interface IWorkDayTimesheet {
  id?: number;
  date?: Moment;
  workingEntries?: IWorkingEntryTimesheet[];
  employee?: IEmployeeTimesheet;
  calculatedBreakMinutes?: number;
  additionalBreakMinutes?: number;
  totalBreakMinutes?: number;
  totalWorkingMinutes?: number;
  targetWorkingMinutes?: number;
}

export class WorkDayTimesheet implements IWorkDayTimesheet {
  constructor(
    public id?: number,
    public date?: Moment,
    public workingEntries?: IWorkingEntryTimesheet[],
    public employee?: IEmployeeTimesheet,
    public calculatedBreakMinutes?: number,
    public additionalBreakMinutes?: number,
    public totalBreakMinutes?: number,
    public totalWorkingMinutes?: number,
    public targetWorkingMinutes?: number
  ) {}
}
