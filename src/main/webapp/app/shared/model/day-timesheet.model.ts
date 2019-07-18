import { IWorkingDayTimesheet } from 'app/shared/model/working-day-timesheet.model';

export interface IDayTimesheet {
  id?: number;
  name?: string;
  workingDays?: IWorkingDayTimesheet[];
}

export class DayTimesheet implements IDayTimesheet {
  constructor(public id?: number, public name?: string, public workingDays?: IWorkingDayTimesheet[]) {}
}
