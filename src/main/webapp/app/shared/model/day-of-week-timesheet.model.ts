import { ITargetWorkingDayTimesheet } from 'app/shared/model/target-working-day-timesheet.model';

export interface IDayOfWeekTimesheet {
  id?: number;
  name?: string;
  targetWorkingDays?: ITargetWorkingDayTimesheet[];
}

export class DayOfWeekTimesheet implements IDayOfWeekTimesheet {
  constructor(public id?: number, public name?: string, public targetWorkingDays?: ITargetWorkingDayTimesheet[]) {}
}
