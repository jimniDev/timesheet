import { Component, OnInit, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { IWorkingEntryTimesheet, WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet';
import { Moment } from 'moment';
import { MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'jhi-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {
  monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

  workingEntriesUnfiltered: IWorkingEntryTimesheet[];
  workingEntries: IWorkingEntryTimesheet[];
  DSworkingEntries = new MatTableDataSource<IWorkingEntryTimesheet>(this.workingEntries);

  displayedColumns: string[] = ['Date', 'Total Worktime', 'Break Time', 'start', 'end', 'Sum', 'Activity'];

  targetTime: string = '00:00';
  actualTime: string = '00:00';
  diffTime: string = '00:00';
  todayTime: string = '00:00';

  @Output() initialized = new EventEmitter<boolean>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private workingEntryService: WorkingEntryTimesheetService,
    private employeeService: EmployeeTimesheetService,
    private cdr: ChangeDetectorRef
  ) {}

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
    if (date) {
      this.workingEntries = this.workingEntriesUnfiltered.filter(
        we => we.workDay.date.year() === date.year() && we.workDay.date.month() === date.month()
      );
    } else {
      this.workingEntries = this.workingEntriesUnfiltered;
    }
    this.DSworkingEntries = new MatTableDataSource(this.workingEntries);
    this.DSworkingEntries.paginator = this.paginator;
    this.DSworkingEntries.sort = this.sort;

    if (this.DSworkingEntries.paginator) {
      this.DSworkingEntries.paginator.firstPage(); //go to the first page if filter changed
    }
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
          this.workingEntriesUnfiltered = this.workingEntries;
          this.DSworkingEntries = new MatTableDataSource(this.workingEntries);

          this.cdr.detectChanges(); //necessary fot pagination & sort -wait until initialization
          this.DSworkingEntries.paginator = this.paginator;
          this.DSworkingEntries.sort = this.sort;
          this.initialized.emit(true);
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  onError(message: string) {
    throw new Error(message);
  }

  sortData(workingEntries: IWorkingEntryTimesheet[]): IWorkingEntryTimesheet[] {
    let sortarray = workingEntries.sort((a, b) => b.start.valueOf() - a.start.valueOf());
    return sortarray;
  }

  addNewandSort(workingEntry: WorkingEntryTimesheet) {
    this.workingEntries.push(workingEntry);
    this.workingEntries = this.sortData(this.workingEntries);
    this.workingEntriesUnfiltered = this.workingEntries;
    this.DSworkingEntries = new MatTableDataSource(this.workingEntries);
    this.cdr.detectChanges(); //necessary fot pagination & sort -wait until initialization
    this.DSworkingEntries.paginator = this.paginator;
    this.DSworkingEntries.sort = this.sort;

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

  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }

  secondsToHHMM(seconds: number): string {
    const hour = Math.round(seconds / 3600);
    const min = Math.round((seconds % 3600) / 60);
    return this.pad(hour, 2) + 'h ' + this.pad(min, 2) + 'm';
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
