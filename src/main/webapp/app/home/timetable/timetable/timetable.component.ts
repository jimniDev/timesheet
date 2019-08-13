import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'jhi-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
  workingEntries: IWorkingEntryTimesheet[];
  sWorkingEntries: IWorkingEntryTimesheet[]; //sorted

  @Output() initialized = new EventEmitter<boolean>();

  constructor(private workingEntryService: WorkingEntryTimesheetService) {}

  ngOnInit() {
    this.loadAllandSort();
  }

  loadAllandSort() {
    this.workingEntryService
      .timetable()
      .pipe(
        filter((res: HttpResponse<IWorkingEntryTimesheet[]>) => res.ok),
        map((res: HttpResponse<IWorkingEntryTimesheet[]>) => res.body)
      )
      .subscribe(
        (res: IWorkingEntryTimesheet[]) => {
          this.workingEntries = res;
          this.workingEntries = this.sortData(this.workingEntries);
          this.initialized.emit(true);
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  onError(message: string) {
    throw new Error('Method not implemented.');
  }

  sortData(workingEntries: IWorkingEntryTimesheet[]): IWorkingEntryTimesheet[] {
    let sortarray = workingEntries.sort((a, b) => b.start.valueOf() - a.start.valueOf());
    return sortarray;
  }

  sumDate(date1: any, date2: any): String {
    const sum = Math.abs((date1 - date2) / 1000);
    const hour = Math.round(sum / 3600);
    const min = Math.round((sum % 3600) / 60);
    return this.pad(hour, 2) + ' : ' + this.pad(min, 2);
  }

  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }
}
