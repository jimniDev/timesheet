import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { IWorkingEntryTimesheet, WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet';
import { Moment } from 'moment';

@Component({
  selector: 'jhi-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
  monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

  workingEntriesUnfiltered: IWorkingEntryTimesheet[];
  workingEntries: IWorkingEntryTimesheet[];

  targetTime: string = '00:00';
  actualTime: string = '00:00';
  diffTime: string = '00:00';
  todayTime: string = '00:00';

  @Output() initialized = new EventEmitter<boolean>();

  constructor(private workingEntryService: WorkingEntryTimesheetService, private employeeService: EmployeeTimesheetService) {}

  ngOnInit() {
    this.loadAllandSort();
    this.loadWorktimeInformation();
  }

  loadWorktimeInformation() {
    const date = new Date();
    this.employeeService.currentWorktimeInformation(date.getFullYear()).subscribe(res => {
      if (res.ok) {
        for (let month of res.body.years[0].months) {
          if (month.name === this.monthNames[date.getMonth()]) {
            this.targetTime = this.secondsToHHMM(month.targetWorkingMinutes * 60);
            this.actualTime = this.secondsToHHMM(month.actualWorkingMinutes * 60);
            this.diffTime = this.secondsToHHMM(month.actualWorkingMinutes * 60 - month.targetWorkingMinutes * 60);
            return;
          } else {
            this.targetTime = '00:00';
            this.actualTime = '00:00';
          }
        }
      }
    });
  }

  filterTimeTable(date: Moment) {
    this.workingEntries = this.workingEntriesUnfiltered.filter(
      we => we.workDay.date.year() === date.year() && we.workDay.date.month() === date.month()
    );
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
          this.workingEntriesUnfiltered = this.workingEntries;
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

  addNewandSort(workingEntry: WorkingEntryTimesheet) {
    this.workingEntries.push(workingEntry);
    this.workingEntries = this.sortData(this.workingEntries);
    this.loadWorktimeInformation();
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
    const month: number = new Date().getMonth() + 1;
    const today = new Date().getFullYear() + '-' + month + '-' + new Date().getDate();
    const todayMoment = moment(today);
    const toadyEntries = this.workingEntries.filter(filterEntry => {
      const a = filterEntry.workDay.date;
      if (a === todayMoment) {
        return filterEntry;
      }
    });
    let sum = 0;
    for (let i = 0; i < toadyEntries.length; i++) {
      sum += this.sumToday(toadyEntries[i].start, toadyEntries[i].end);
    }
    this.todayTime = this.secondsToHHMM(sum);
  }

  secondsToHHMM(seconds: number): string {
    const hour = Math.round(seconds / 3600);
    const min = Math.round((seconds % 3600) / 60);
    return this.pad(hour, 2) + ':' + this.pad(min, 2);
  }

  isDifferentWorkingEntryDateBefore(index: number): boolean {
    if (index > 0) {
      if (!this.workingEntries[index].workDay.date.isSame(this.workingEntries[index - 1].workDay.date)) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  getDatesFromWorkingEntries(): Moment[] {
    if (this.workingEntriesUnfiltered) {
      return this.workingEntriesUnfiltered.map(we => we.workDay.date);
    }
    return null;
  }
}
