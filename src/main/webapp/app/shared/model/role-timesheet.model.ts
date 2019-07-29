import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';

export interface IRoleTimesheet {
  id?: number;
  name?: string;
  description?: string;
  activities?: IActivityTimesheet[];
}

export class RoleTimesheet implements IRoleTimesheet {
  constructor(public id?: number, public name?: string, public description?: string, public activities?: IActivityTimesheet[]) {}
}
