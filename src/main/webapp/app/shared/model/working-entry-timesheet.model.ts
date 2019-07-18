import { Moment } from 'moment';
import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { ILocationTimesheet } from 'app/shared/model/location-timesheet.model';

export interface IWorkingEntryTimesheet {
  id?: number;
  start?: Moment;
  end?: Moment;
  deleteFlag?: boolean;
  employee?: IEmployeeTimesheet;
  activity?: IActivityTimesheet;
  location?: ILocationTimesheet;
}

export class WorkingEntryTimesheet implements IWorkingEntryTimesheet {
  constructor(
    public id?: number,
    public start?: Moment,
    public end?: Moment,
    public deleteFlag?: boolean,
    public employee?: IEmployeeTimesheet,
    public activity?: IActivityTimesheet,
    public location?: ILocationTimesheet
  ) {
    this.deleteFlag = this.deleteFlag || false;
  }
}
