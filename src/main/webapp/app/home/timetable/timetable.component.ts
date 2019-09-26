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

  targetMinutes: number;
  actualMinutes: number;

  constructor(
    private workingEntryService: WorkingEntryTimesheetService,
    private employeeService: EmployeeTimesheetService,
    public dialog: MatDialog,
    public asRowSpan: AsRowSpanService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const date = new Date();
    this.loadAllandSort();
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

  loadActualWorkTime(year: number, month: number) {
    this.employeeService.actualWorkTime(year, month).subscribe(res => {
      if (res.ok) {
        this.actualMinutes = res.body;
        this.actualTime = this.secondsToHHMM(res.body * 60);
        this.calcDiffTargetActual();
      }
    });
  }

  filterTimeTable(date: Moment) {
    if (date) {
      this.loadTargetWorkTime(date.year(), date.month() + 1);
      this.loadActualWorkTime(date.year(), date.month() + 1);
      this.workingEntries = this.workingEntriesUnfiltered.filter(
        we => we.workDay.date.year() === date.year() && we.workDay.date.month() === date.month()
      );
    } else {
      date = moment();
      this.workingEntries = this.workingEntriesUnfiltered;
      this.loadTargetWorkTime(date.year(), date.month() + 1);
      this.loadActualWorkTime(date.year(), date.month() + 1);
    }
    this.DSworkingEntries.data = this.workingEntries;

    if (this.DSworkingEntries.paginator) {
      this.DSworkingEntries.paginator.firstPage(); // go to the first page if filter changed
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
          this.DSworkingEntries.data = this.workingEntries;
          this.asRowSpan.setData(this.workingEntries);
          this.asRowSpan.cacheSpan('Date', d => d.workDay.date.format('YYYY-MM-DD'));
          this.initialized.emit(true);
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  onError(message: string) {
    throw new Error(message);
  }

  sortData(workingEntries: IWorkingEntryTimesheet[]): IWorkingEntryTimesheet[] {
    const sortarray = workingEntries.sort((a, b) => b.start.valueOf() - a.start.valueOf());
    return sortarray;
  }

  addNewandSort(workingEntry: WorkingEntryTimesheet) {
    this.workingEntries.push(workingEntry);
    this.workingEntries = this.sortData(this.workingEntries);
    this.workingEntriesUnfiltered = this.workingEntries;
    this.DSworkingEntries.data = this.workingEntries;

    // this.loadWorktimeInformation();
    // update RowSpanned Columns
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

  getDatesFromWorkingEntries(): Moment[] {
    if (this.workingEntriesUnfiltered) {
      return this.workingEntriesUnfiltered.map(we => we.workDay.date);
    }
    return null;
  }

  calcDiffTargetActual() {
    if (this.actualMinutes && this.targetMinutes) {
      this.diffTime = this.secondsToHHMM(this.targetMinutes * 60 - this.actualMinutes * 60);
    }
  }

  edittimetableDialog(workingEntry: IWorkingEntryTimesheet): void {
    const dialogRef = this.dialog.open(TimetableEditDialogComponent, {
      data: workingEntry
    });

    dialogRef.afterClosed().subscribe((result: IWorkingEntryTimesheet) => {
      if (result) {
        const idx = this.workingEntries.findIndex(we => we.id === result.id);
        this.workingEntries[idx] = result;
        this.DSworkingEntries.data = this.workingEntries;
        // this.loadWorktimeInformation();
        // update RowSpanned Columns
      }
    });
  }

  public deleteEntry(workingentry: IWorkingEntryTimesheet) {
    this.workingEntryService.delete(workingentry.id).subscribe(res => {
      if (res.ok) {
        const idx = this.workingEntries.findIndex(we => we.id === workingentry.id);
        this.workingEntries.splice(idx, 1);
        this.DSworkingEntries.data = this.workingEntries;
        // this.loadWorktimeInformation();
        // update RowSpanned Columns
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
