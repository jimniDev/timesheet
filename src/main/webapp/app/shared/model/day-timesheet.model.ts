import { IWorkDayTimesheet } from './work-day-timesheet.model';

export interface IDayTimesheet {
  id?: number;
  name?: string;
  workDays?: IWorkDayTimesheet[];
}

export class DayTimesheet implements IDayTimesheet {
  constructor(public id?: number, public name?: string, public workDays?: IWorkDayTimesheet[]) {}
}
