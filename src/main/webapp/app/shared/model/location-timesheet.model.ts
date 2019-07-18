import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { ICountryTimesheet } from 'app/shared/model/country-timesheet.model';

export interface ILocationTimesheet {
  id?: number;
  street?: string;
  streetNumber?: string;
  postalCode?: string;
  city?: string;
  workingEntries?: IWorkingEntryTimesheet[];
  country?: ICountryTimesheet;
}

export class LocationTimesheet implements ILocationTimesheet {
  constructor(
    public id?: number,
    public street?: string,
    public streetNumber?: string,
    public postalCode?: string,
    public city?: string,
    public workingEntries?: IWorkingEntryTimesheet[],
    public country?: ICountryTimesheet
  ) {}
}
