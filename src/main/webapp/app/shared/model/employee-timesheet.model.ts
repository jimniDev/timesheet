import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { IWorkingDayTimesheet } from 'app/shared/model/working-day-timesheet.model';

export interface IEmployeeTimesheet {
  id?: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  workingEntries?: IWorkingEntryTimesheet[];
  workingDays?: IWorkingDayTimesheet[];
}

export class EmployeeTimesheet implements IEmployeeTimesheet {
  constructor(
    public id?: number,
    public firstname?: string,
    public lastname?: string,
    public email?: string,
    public phone?: string,
    public workingEntries?: IWorkingEntryTimesheet[],
    public workingDays?: IWorkingDayTimesheet[]
  ) {}
}
