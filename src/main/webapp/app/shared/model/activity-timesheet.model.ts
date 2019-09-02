import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';

export interface IActivityTimesheet {
  id?: number;
  name?: string;
  description?: string;
  absence?: boolean;
  fillDay?: boolean;
  workingEntries?: IWorkingEntryTimesheet[];
  roles?: IRoleTimesheet[];
}

export class ActivityTimesheet implements IActivityTimesheet {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public absence?: boolean,
    public fillDay?: boolean,
    public workingEntries?: IWorkingEntryTimesheet[],
    public roles?: IRoleTimesheet[]
  ) {
    this.absence = this.absence || false;
    this.fillDay = this.fillDay || false;
  }
}
