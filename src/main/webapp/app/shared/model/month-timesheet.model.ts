export interface IMonthTimesheet {
  targetWorkingMinutes?: number;
  actualWorkingMinutes?: number;
  name?: string;
}

export class MonthTimesheet implements IMonthTimesheet {
  constructor(public targetWorkingMinutes?: number, public actualWorkingMinutes?: number, public name?: string) {}
}
