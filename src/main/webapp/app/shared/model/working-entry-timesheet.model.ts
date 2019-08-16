import { Moment } from 'moment';
import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { IWorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';
import { ILocationTimesheet } from 'app/shared/model/location-timesheet.model';

export interface IWorkingEntryTimesheet {
  id?: number;
  start?: Moment;
  end?: Moment;
  deleted?: boolean;
  locked?: boolean;
  createdAt?: Moment;
  employee?: IEmployeeTimesheet;
  activity?: IActivityTimesheet;
  workDay?: IWorkDayTimesheet;
  location?: ILocationTimesheet;
}

export class WorkingEntryTimesheet implements IWorkingEntryTimesheet {
  constructor(
    public id?: number,
    public start?: Moment,
    public end?: Moment,
    public deleted?: boolean,
    public locked?: boolean,
    public createdAt?: Moment,
    public employee?: IEmployeeTimesheet,
    public activity?: IActivityTimesheet,
    public workDay?: IWorkDayTimesheet,
    public location?: ILocationTimesheet
  ) {
    this.deleted = this.deleted || false;
    this.locked = this.locked || false;
  }
}
