import { ILocationTimesheet } from 'app/shared/model/location-timesheet.model';

export interface ICountryTimesheet {
  id?: number;
  countryName?: string;
  locations?: ILocationTimesheet[];
}

export class CountryTimesheet implements ICountryTimesheet {
  constructor(public id?: number, public countryName?: string, public locations?: ILocationTimesheet[]) {}
}
