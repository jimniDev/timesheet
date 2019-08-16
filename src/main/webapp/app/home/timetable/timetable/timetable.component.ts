import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { IWorkingEntryTimesheet, WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'jhi-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
  workingEntries: IWorkingEntryTimesheet[];
  sWorkingEntries: IWorkingEntryTimesheet[]; //sorted

  targetTime: string = '13:00';
  actualTime: string = '13:00';
  diffTime: string = '13:00';
  todayTime: string;

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
          this.workTodaySum();
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

  loadNewandSort(workingEntry: WorkingEntryTimesheet) {
    this.workingEntryService.create(workingEntry).subscribe(res => {
      if (res.ok) {
        this.workingEntries.push(res.body);
        this.workingEntries = this.sortData(this.workingEntries);
        //this.initialized.emit(true);
      }
    });
  }

  sumDate(date1: any, date2: any): String {
    if (date2 != null) {
      const sum = Math.abs((date1 - date2) / 1000);
      const hour = Math.round(sum / 3600);
      const min = Math.round((sum % 3600) / 60);
      return this.pad(hour, 2) + ' : ' + this.pad(min, 2);
    } else {
      return null;
    }
  }

  sumToday(date1: any, date2: any): number {
    if (date2 != null) {
      const sum = Math.abs((date1 - date2) / 1000);
      return sum;
    } else {
      return 0;
    }
  }

  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }

  workTodaySum() {
    let month: number = new Date().getMonth() + 1;
    let today = new Date().getFullYear() + '-' + month + '-' + new Date().getDate();
    let todayMoment = moment(today);
    var toadyEntries = this.workingEntries.filter(function(filterEntry) {
      let a = filterEntry.workDay.date;
      if (a == todayMoment) {
        return filterEntry;
      }
    });
    let sum = 0;
    for (var i = 0; i < toadyEntries.length; i++) {
      sum += this.sumToday(toadyEntries[i].start, toadyEntries[i].end);
    }
    const hour = Math.round(sum / 3600);
    const min = Math.round((sum % 3600) / 60);
    this.todayTime = this.pad(hour, 2) + ' : ' + this.pad(min, 2);
  }
}
