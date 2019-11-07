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
import { PdfService } from 'app/shared/pdf/pdf.service';
import { TimetableDeleteDialogComponent } from '../timetable-delete-dialog/timetable-delete-dialog.component';
import { YearWeek } from '../year-week-select/year-week-select.component';
import { YearMonth } from '../year-month-select/year-month-select.component';
import { WorkDayTimesheetService } from 'app/entities/work-day-timesheet';

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

  monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  buttonDisable = false;
  workingEntriesUnfiltered: IWorkingEntryTimesheet[];
  workingEntries: IWorkingEntryTimesheet[];
  DSworkingEntries = new MatTableDataSource<IWorkingEntryTimesheet>(this.workingEntries);
  pdfExportButtonDisabled = true;
  displayedColumns: string[] = ['workDay.date', 'Total Worktime', 'Break Time', 'start', 'end', 'Sum', 'Activity', 'Actions'];

  targetTime = '00h 00m';
  actualTime = '00h 00m';
  diffTime = '00h 00m';
  todayTime = '00h 00m';
  balanceTime = '00h 00m';

  weeklyTargetTime = '00h 00m';
  weeklyActualTime = '00h 00m';
  weeklyDiffTime = '00h 00m';

  targetMinutes: number;
  actualMinutes: number;
  balanceMinutes: number;
  weeklyTargetMinutes: number;
  weeklyActualMinutes: number;

  filterDate: Moment = moment();
  doesEntryExistNow = false;
  tableMonth = this.monthNames[this.filterDate.month()];

  constructor(
    private workingEntryService: WorkingEntryTimesheetService,
    private employeeService: EmployeeTimesheetService,
    public dialog: MatDialog,
    public asRowSpan: AsRowSpanService,
    public pdfService: PdfService,
    private workDayService: WorkDayTimesheetService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const date = moment();
    this.loadWorkingEntries(date.year(), date.month() + 1);
    this.loadTargetWorkTime(date.year(), date.month() + 1);
    this.loadActualWorkTime(date.year(), date.month() + 1);
    this.loadActualWorkTimeWeekly(date.year(), date.isoWeek());
    this.loadTargetWorkTimeWeekly(date.year(), date.isoWeek());
    this.loadCurrentWorktimeBalance();
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
        this.pdfExportButtonDisabled = false;
        this.targetMinutes = res.body;
        this.targetTime = this.secondsToHHMM(res.body * 60);
        this.calcDiffTargetActual();
      }
    });
  }

  createPDF(): void {
    this.workingEntries.sort((a, b) => a.workDay.date.valueOf() - b.workDay.date.valueOf());
    this.pdfService.buttonPDF(this.workingEntries, this.targetMinutes, this.actualMinutes);
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

  loadCurrentWorktimeBalance() {
    this.employeeService.currentWorkTimeBalance().subscribe(res => {
      if (res.ok) {
        this.balanceMinutes = res.body;
        this.balanceTime = this.secondsToHHMM(res.body * 60);
      }
    });
  }

  calcDiffTargetActual() {
    if (this.actualMinutes && this.targetMinutes) {
      this.diffTime = this.secondsToHHMM(this.targetMinutes * 60 - this.actualMinutes * 60);
    }
  }

  calcWeeklyDiffTargetActual() {
    this.weeklyDiffTime = this.secondsToHHMM(this.weeklyActualMinutes * 60 - this.weeklyTargetMinutes * 60);
  }

  filterTimeTable(date: YearMonth) {
    if (date) {
      this.loadTargetWorkTime(parseInt(date.year, 10), parseInt(date.month, 10));
      this.loadActualWorkTime(parseInt(date.year, 10), parseInt(date.month, 10));
      this.loadWorkingEntries(parseInt(date.year, 10), parseInt(date.month, 10));
      this.tableMonth = this.monthNames[parseInt(date.month, 10) - 1];
    }
    this.DSworkingEntries.data = this.workingEntries;
    if (this.DSworkingEntries.paginator) {
      this.DSworkingEntries.paginator.firstPage(); // go to the first page if filter changed
    }
  }

  loadWeeklyInformation(date: YearWeek) {
    if (date) {
      this.loadTargetWorkTimeWeekly(parseInt(date.year, 10), parseInt(date.week, 10));
      this.loadActualWorkTimeWeekly(parseInt(date.year, 10), parseInt(date.week, 10));
    } else {
      this.loadTargetWorkTimeWeekly(parseInt(date.year, 10), parseInt(date.week, 10));
      this.loadActualWorkTimeWeekly(parseInt(date.year, 10), parseInt(date.week, 10));
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
    this.workingEntries.push(workingEntry);
    this.workingEntries.forEach(entry => {
      if (entry.workDay.id === workingEntry.workDay.id) {
        entry.workDay = workingEntry.workDay;
      }
    });
    this.workingEntriesUnfiltered = this.workingEntries;
    this.DSworkingEntries.data = this.workingEntries;
    const now = moment();
    this.doesEntryExistNow = this.workingEntries.some(entry => entry.start <= now && entry.end >= now);
    this.loadTargetWorkTime(this.filterDate.year(), this.filterDate.month() + 1);
    this.loadActualWorkTime(this.filterDate.year(), this.filterDate.month() + 1);
    this.loadActualWorkTimeWeekly(this.filterDate.year(), this.filterDate.isoWeek());
    this.loadTargetWorkTimeWeekly(this.filterDate.year(), this.filterDate.isoWeek());
    this.loadCurrentWorktimeBalance();
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
    if (seconds >= 0) {
      const hour = Math.floor(seconds / 3600);
      const min = Math.floor((seconds % 3600) / 60);
      return this.pad(hour, 2) + 'h ' + this.pad(min, 2) + 'm';
    } else {
      const hour = Math.ceil(seconds / 3600);
      const min = Math.ceil((seconds % 3600) / 60);
      return '-' + this.pad(Math.abs(hour), 2) + 'h ' + this.pad(Math.abs(min), 2) + 'm';
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
        this.workingEntries.forEach(entry => {
          if (entry.workDay.id === result.workDay.id) {
            entry.workDay = result.workDay;
          }
        });
        this.DSworkingEntries.data = this.workingEntries;
        const now = moment();
        this.doesEntryExistNow = this.workingEntries.some(entry => entry.start <= now && entry.end >= now);

        this.loadTargetWorkTime(this.filterDate.year(), this.filterDate.month() + 1);
        this.loadActualWorkTime(this.filterDate.year(), this.filterDate.month() + 1);
        this.loadActualWorkTimeWeekly(this.filterDate.year(), this.filterDate.isoWeek());
        this.loadTargetWorkTimeWeekly(this.filterDate.year(), this.filterDate.isoWeek());
        this.loadCurrentWorktimeBalance();
      }
    });
  }

  public deleteEntry(workingEntry: IWorkingEntryTimesheet) {
    const dialogRef = this.dialog.open(TimetableDeleteDialogComponent, {
      data: workingEntry
    });
    dialogRef.afterClosed().subscribe((result: IWorkingEntryTimesheet) => {
      if (result) {
        this.workingEntryService.delete(workingEntry.id).subscribe(del => {
          if (del.ok) {
            const workDayOfdeletedEntry = workingEntry.workDay;
            this.workDayService
              .getTotalWorkingMinutesbyDate(
                workDayOfdeletedEntry.date.year(),
                workDayOfdeletedEntry.date.month() + 1,
                workDayOfdeletedEntry.date.date()
              )
              .subscribe(res => {
                if (res.ok) {
                  workDayOfdeletedEntry.totalWorkingMinutes = <number>res.body;
                }
              });
            this.workDayService
              .getTotalBreakMinutesbyDate(
                workDayOfdeletedEntry.date.year(),
                workDayOfdeletedEntry.date.month() + 1,
                workDayOfdeletedEntry.date.date()
              )
              .subscribe(res => {
                if (res.ok) {
                  workDayOfdeletedEntry.totalBreakMinutes = <number>res.body;
                }
              });
            this.workingEntries.forEach(entry => {
              if (entry.workDay.id === workDayOfdeletedEntry.id) {
                entry.workDay = workDayOfdeletedEntry;
              }
            });
            const idx = this.workingEntries.findIndex(we => we.id === workingEntry.id);
            this.workingEntries.splice(idx, 1);
            this.DSworkingEntries.data = this.workingEntries;
          }
        });

        const now = moment();
        this.doesEntryExistNow = this.workingEntries.some(entry => entry.start <= now && entry.end >= now);
        this.loadTargetWorkTime(this.filterDate.year(), this.filterDate.month() + 1);
        this.loadActualWorkTime(this.filterDate.year(), this.filterDate.month() + 1);
        this.loadActualWorkTimeWeekly(this.filterDate.year(), this.filterDate.isoWeek());
        this.loadTargetWorkTimeWeekly(this.filterDate.year(), this.filterDate.isoWeek());
        this.loadCurrentWorktimeBalance();
      }
    });
  }

  checkDate(workingentry: IWorkingEntryTimesheet): boolean {
    if (
      !workingentry.employee.editPermitted &&
      (moment().diff(workingentry.workDay.date, 'days') >= 30 ||
        (workingentry.workDay.date.isSame(moment(), 'date') && workingentry.end === null))
    ) {
      return true;
    }
    return false;
  }

  applyDateFilter(searchDate: number) {
    if (searchDate) {
      const dateFilteredWorkingEntries = this.workingEntries.filter(we => we.workDay.date.date() == searchDate);
      this.DSworkingEntries.data = dateFilteredWorkingEntries;
    } else {
      this.DSworkingEntries.data = this.workingEntries;
    }
  }

  onKeyDown(event) {
    const e = <KeyboardEvent>event;
    if (
      // modification : blocked the period (.)
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }
}
