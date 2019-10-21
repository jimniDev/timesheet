import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AsRowSpanService } from 'app/as-layouts/as-table/as-row-span.service';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { IWorkingEntryTimesheet, WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import * as moment from 'moment';
import { Moment } from 'moment';
import { filter, map } from 'rxjs/operators';
import { TimetableEditDialogComponent } from '../timetable-edit-dialog/timetable-edit-dialog.component';
import { TimetableDeleteDialogComponent } from '../timetable-delete-dialog/timetable-delete-dialog.component';
import { YearWeek } from '../year-week-select/year-week-select.component';
import { YearMonth } from '../year-month-select/year-month-select.component';

@Component({
  selector: 'jhi-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss'],
  providers: [AsRowSpanService]
})
export class TimetableComponent implements OnInit, AfterViewInit {
  @Output() initialized = new EventEmitter<boolean>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  buttonDisable = false;
  workingEntriesUnfiltered: IWorkingEntryTimesheet[];
  workingEntries: IWorkingEntryTimesheet[];
  DSworkingEntries = new MatTableDataSource<IWorkingEntryTimesheet>(this.workingEntries);

  displayedColumns: string[] = ['workDay.date', 'Total Worktime', 'Break Time', 'start', 'end', 'Sum', 'Activity', 'Actions'];

  targetTime = '00h 00m';
  actualTime = '00h 00m';
  diffTime = '00h 00m';
  todayTime = '00h 00m';

  weeklyTargetTime = '00h 00m';
  weeklyActualTime = '00h 00m';
  weeklyDiffTime = '00h 00m';

  targetMinutes: number;
  actualMinutes: number;
  weeklyTargetMinutes: number;
  weeklyActualMinutes: number;

  filterDate: Moment = moment();
  doesEntryExistNow = false;

  constructor(
    private workingEntryService: WorkingEntryTimesheetService,
    private employeeService: EmployeeTimesheetService,
    public dialog: MatDialog,
    public asRowSpan: AsRowSpanService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const date = new Date();
    this.loadWorkingEntries(date.getFullYear(), date.getMonth() + 1);
    this.loadTargetWorkTime(date.getFullYear(), date.getMonth() + 1);
    this.loadActualWorkTime(date.getFullYear(), date.getMonth() + 1);
    this.DSworkingEntries.sortingDataAccessor = this.sortingDataAccessor;
    this.DSworkingEntries.paginator = this.paginator;
    this.DSworkingEntries.sort = this.sort;
    this.sort.sortChange.subscribe(() => this.paginator.firstPage());
    this.DSworkingEntries.connect().subscribe(d => this.asRowSpan.updateCache(d));
  }

  sortingDataAccessor(item, property) {
    if (property.includes('.')) {
      return property.split('.').reduce((object, key) => object[key], item);
    }
    return item[property];
  }

  loadTargetWorkTime(year: number, month: number) {
    this.employeeService.targetWorkTime(year, month).subscribe(res => {
      if (res.ok) {
        this.targetMinutes = res.body;
        this.targetTime = this.secondsToHHMM(res.body * 60);
        this.calcDiffTargetActual();
      }
    });
  }

  loadTargetWorkTimeWeekly(year: number, week: number) {
    this.employeeService.weeklyTargetWorkTime(year, week).subscribe(res => {
      if (res.ok) {
        this.weeklyTargetMinutes = res.body;
        this.weeklyTargetTime = this.secondsToHHMM(res.body * 60);
        this.calcWeeklyDiffTargetActual();
      }
    });
  }

  loadActualWorkTime(year: number, month: number) {
    this.employeeService.actualWorkTime(year, month).subscribe(res => {
      if (res.ok) {
        this.actualMinutes = res.body;
        this.actualTime = this.secondsToHHMM(res.body * 60);
        this.calcDiffTargetActual();
      }
    });
  }

  loadActualWorkTimeWeekly(year: number, week: number) {
    this.employeeService.weeklyActualWorkTime(year, week).subscribe(res => {
      if (res.ok) {
        this.weeklyActualMinutes = res.body;
        this.weeklyActualTime = this.secondsToHHMM(res.body * 60);
        this.calcWeeklyDiffTargetActual();
      }
    });
  }

  calcDiffTargetActual() {
    if (this.actualMinutes && this.targetMinutes) {
      this.diffTime = this.secondsToHHMM(this.targetMinutes * 60 - this.actualMinutes * 60);
    }
  }

  calcWeeklyDiffTargetActual() {
    if (this.weeklyTargetMinutes) {
      this.weeklyDiffTime = this.secondsToHHMM(this.weeklyTargetMinutes * 60 - this.weeklyActualMinutes * 60);
    }
  }

  filterTimeTable(date: YearMonth) {
    if (date) {
      this.loadTargetWorkTime(parseInt(date.year, 10), parseInt(date.month, 10));
      this.loadActualWorkTime(parseInt(date.year, 10), parseInt(date.month, 10));
      this.loadWorkingEntries(parseInt(date.year, 10), parseInt(date.month, 10));
      // this.workingEntries = this.workingEntriesUnfiltered.filter(
      //   we => we.workDay.date.year() === date.year() && we.workDay.date.month() === date.month()
      // );
    }
    this.DSworkingEntries.data = this.workingEntries;

    if (this.DSworkingEntries.paginator) {
      this.DSworkingEntries.paginator.firstPage(); // go to the first page if filter changed
    }
  }

  filterTimeTableWeekly(date: YearWeek) {
    if (date) {
      this.loadTargetWorkTimeWeekly(parseInt(date.year, 10), parseInt(date.week, 10));
      this.loadActualWorkTimeWeekly(parseInt(date.year, 10), parseInt(date.week, 10));
    } else {
      this.workingEntries = this.workingEntriesUnfiltered;
      this.loadTargetWorkTimeWeekly(parseInt(date.year, 10), parseInt(date.week, 10));
      this.loadActualWorkTimeWeekly(parseInt(date.year, 10), parseInt(date.week, 10));
    }
    this.DSworkingEntries.data = this.workingEntries;

    if (this.DSworkingEntries.paginator) {
      this.DSworkingEntries.paginator.firstPage(); // go to the first page if filter changed
    }
  }

  loadWorkingEntries(year: number, month: number) {
    this.workingEntryService
      .timetable(year, month)
      .pipe(
        filter((res: HttpResponse<IWorkingEntryTimesheet[]>) => res.ok),
        map((res: HttpResponse<IWorkingEntryTimesheet[]>) => res.body)
      )
      .subscribe(
        (res: IWorkingEntryTimesheet[]) => {
          this.workingEntries = res;
          this.asRowSpan.setData(this.workingEntries);
          this.asRowSpan.cacheSpan('Date', d => d.workDay.date.format('YYYY-MM-DD'));
          this.workingEntriesUnfiltered = this.workingEntries;
          this.DSworkingEntries.data = this.workingEntries;
          this.initialized.emit(true);
          const now = moment();
          this.doesEntryExistNow = this.workingEntries.some(entry => entry.start <= now && entry.end >= now);
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  onError(message: string) {
    throw new Error(message);
  }

  addNewandSort(workingEntry: WorkingEntryTimesheet) {
    this.loadTargetWorkTime(this.filterDate.year(), this.filterDate.month() + 1);
    this.loadActualWorkTime(this.filterDate.year(), this.filterDate.month() + 1);
    this.workingEntries.push(workingEntry);
    this.workingEntries.forEach(entry => {
      if (entry.workDay.id === workingEntry.workDay.id) {
        entry.workDay.totalWorkingMinutes = workingEntry.workDay.totalWorkingMinutes;
        entry.workDay.totalBreakMinutes = workingEntry.workDay.totalBreakMinutes;
      }
    });
    this.workingEntriesUnfiltered = this.workingEntries;
    this.DSworkingEntries.data = this.workingEntries;
    const now = moment();
    this.doesEntryExistNow = this.workingEntries.some(entry => entry.start <= now && entry.end >= now);
    // const nowWorkingEntry = <IWorkingEntryTimesheet>this.workingEntries.find(entry => (entry.start <= now && entry.end >= now));
    // if (nowWorkingEntry) {
    //   setTimeout(() => (this.DoesEntryExistNow = true), nowWorkingEntry.end.millisecond() - now.millisecond());
    // } else {
    //   this.DoesEntryExistNow = false;
    // }
  }

  sumDate(date1: any, date2: any): String {
    if (date2 > date1) {
      const sum = Math.abs((date1 - date2) / 1000);
      const hour = Math.floor(sum / 3600);
      const min = Math.floor((sum % 3600) / 60);
      return this.pad(hour, 2) + 'h ' + this.pad(min, 2) + 'm';
    } else {
      return null;
    }
  }

  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }

  secondsToHHMM(seconds: number): string {
    const hour = Math.floor(seconds / 3600);
    const min = Math.floor((seconds % 3600) / 60);
    return this.pad(hour, 2) + 'h ' + this.pad(min, 2) + 'm';
  }

  edittimetableDialog(workingEntry: IWorkingEntryTimesheet): void {
    const dialogRef = this.dialog.open(TimetableEditDialogComponent, {
      data: workingEntry
    });

    dialogRef.afterClosed().subscribe((result: IWorkingEntryTimesheet) => {
      if (result) {
        const idx = this.workingEntries.findIndex(we => we.id === result.id);
        this.workingEntries[idx] = result;
        this.workingEntries.forEach(entry => {
          if (entry.workDay.id === result.workDay.id) {
            entry.workDay.totalWorkingMinutes = result.workDay.totalWorkingMinutes;
            entry.workDay.totalBreakMinutes = result.workDay.totalBreakMinutes;
          }
        });
        this.DSworkingEntries.data = this.workingEntries;
        const now = moment();
        this.doesEntryExistNow = this.workingEntries.some(entry => entry.start <= now && entry.end >= now);

        this.loadTargetWorkTime(this.filterDate.year(), this.filterDate.month() + 1);
        this.loadActualWorkTime(this.filterDate.year(), this.filterDate.month() + 1);
      }
    });
  }

  public deleteEntry(workingEntry: IWorkingEntryTimesheet) {
    const dialogRef = this.dialog.open(TimetableDeleteDialogComponent, {
      data: workingEntry
    });
    dialogRef.afterClosed().subscribe((result: IWorkingEntryTimesheet) => {
      if (result) {
        this.workingEntryService.delete(workingEntry.id).subscribe(res => {
          if (res.ok) {
            const idx = this.workingEntries.findIndex(we => we.id === workingEntry.id);
            this.workingEntries.splice(idx, 1);
            this.DSworkingEntries.data = this.workingEntries;
            const now = moment();
            this.doesEntryExistNow = this.workingEntries.some(entry => entry.start <= now && entry.end >= now);

            this.loadTargetWorkTime(this.filterDate.year(), this.filterDate.month() + 1);
            this.loadActualWorkTime(this.filterDate.year(), this.filterDate.month() + 1);
          }
        });
      }
    });
  }

  checkDate(workingentry: IWorkingEntryTimesheet): boolean {
    if (
      moment().diff(workingentry.workDay.date, 'days') >= 30 ||
      (workingentry.workDay.date.isSame(moment(), 'date') && workingentry.end === null)
    ) {
      return true;
    }
    return false;
  }
}
