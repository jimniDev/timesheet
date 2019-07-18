import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';

export interface IActivityTimesheet {
  id?: number;
  name?: string;
  description?: string;
  workingEntries?: IWorkingEntryTimesheet[];
}

export class ActivityTimesheet implements IActivityTimesheet {
  constructor(public id?: number, public name?: string, public description?: string, public workingEntries?: IWorkingEntryTimesheet[]) {}
}
