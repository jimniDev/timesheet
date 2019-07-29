import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';

export interface IActivityTimesheet {
  id?: number;
  name?: string;
  description?: string;
  workingEntries?: IWorkingEntryTimesheet[];
  role?: IRoleTimesheet;
}

export class ActivityTimesheet implements IActivityTimesheet {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public workingEntries?: IWorkingEntryTimesheet[],
    public role?: IRoleTimesheet
  ) {}
}
