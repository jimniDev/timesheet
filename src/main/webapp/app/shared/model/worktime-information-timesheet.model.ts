import { IYearTimesheet } from './year-timesheet.model';

export interface IWorktimeInformationTimesheet {
  years?: IYearTimesheet[];
}

export class WorktimeInformationTimesheet {
  constructor(public years?: IYearTimesheet[]) {}
}
