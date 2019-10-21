import { Injectable } from '@angular/core';
import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  public workingEntries: IWorkingEntryTimesheet[];

  constructor() {}
}
