import { IMonthTimesheet } from './month-timesheet.model';

export interface IYearTimesheet {
  months?: IMonthTimesheet[];
  year?: number;
}

export class YearTimesheet implements IYearTimesheet {
  constructor(public months?: IMonthTimesheet[], public year?: number) {}
}
