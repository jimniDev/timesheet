import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AsRowSpanService } from 'app/as-layouts/as-table/as-row-span.service';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { ActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { IWorkingEntryTimesheet, WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import * as moment from 'moment';
import { Moment } from 'moment';
import { filter, map } from 'rxjs/operators';
import { TimetableEditDialogComponent } from '../timetable-edit-dialog/timetable-edit-dialog.component';
import { PdfService } from 'app/shared/pdf/pdf.service';

@Component({
  selector: 'jhi-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss'],
  providers: [AsRowSpanService]
})
export class TimetableComponent implements OnInit {
  @Output() initialized = new EventEmitter<boolean>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

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

  dateAccessor = d => d.WorkDay.date.format('YYYY-MM-DD');

  constructor(
    private workingEntryService: WorkingEntryTimesheetService,
    private employeeService: EmployeeTimesheetService,
    private cdr: ChangeDetectorRef,
    private pdfSerice: PdfService,
    public dialog: MatDialog,
    public asRowSpan: AsRowSpanService
  ) {}

  ngOnInit() {
    const date = new Date();
    this.loadAllandSort();
    this.loadTargetWorkTime(date.getFullYear(), date.getMonth() + 1);
    this.loadActualWorkTime(date.getFullYear(), date.getMonth() + 1);
  }

  sortingDataAccessor(item, property) {
    if (property.includes('.')) {
      return property.split('.').reduce((object, key) => object[key], item);
    }
    return item[property];
  }

  loadWorktimeInformation() {
    const date = new Date();
    this.employeeService.currentWorktimeInformation(date.getFullYear()).subscribe(res => {
      if (res.ok) {
        for (const month of res.body.years[0].months) {
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

  createPDF(): void {
    this.pdfSerice.createPDF(this.workingEntries);
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
    this.DSworkingEntries = new MatTableDataSource(this.workingEntries);
    this.DSworkingEntries.sortingDataAccessor = this.sortingDataAccessor;
    this.DSworkingEntries.paginator = this.paginator;
    this.DSworkingEntries.sort = this.sort;

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
          // let workDays = this.workingEntries.map(we => we.workDay);
          // this.targetTime = Array.from(new Set(workDays.map(a => a.id)))
          //   .map(id => workDays.find(a => a.id === id))
          //   .map(wd => wd.targetWorkingMinutes)
          //   .reduce((x, y) => x + y)
          //   .toString();
          this.DSworkingEntries = new MatTableDataSource(this.workingEntries);

          this.cdr.detectChanges(); // necessary fot pagination & sort -wait until initialization
          this.DSworkingEntries.sortingDataAccessor = this.sortingDataAccessor;
          this.DSworkingEntries.paginator = this.paginator;
          this.DSworkingEntries.sort = this.sort;
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
    this.asRowSpan.updateCache(this.workingEntries);
    this.workingEntries = this.sortData(this.workingEntries);
    this.workingEntriesUnfiltered = this.workingEntries;
    // this.DSworkingEntries = new MatTableDataSource(this.workingEntries);
    this.DSworkingEntries.connect().next(this.workingEntries);
    this.cdr.detectChanges(); // necessary fot pagination & sort -wait until initialization
    this.DSworkingEntries.sortingDataAccessor = this.sortingDataAccessor;
    this.DSworkingEntries.paginator = this.paginator;
    this.DSworkingEntries.sort = this.sort;

    this.loadWorktimeInformation();
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

  loadActivity(activity: ActivityTimesheet): string {
    if (activity) {
      return activity.name;
    } else {
      return null;
    }
  }

  calcDiffTargetActual() {
    if (this.actualMinutes && this.targetMinutes) {
      this.diffTime = this.secondsToHHMM(this.targetMinutes * 60 - this.actualMinutes * 60);
    }
  }

  edittimetableDialog(workingentry: IWorkingEntryTimesheet) {
    const dialogRef = this.dialog.open(TimetableEditDialogComponent, {
      data: workingentry
    });
    dialogRef.afterClosed().subscribe((result: IWorkingEntryTimesheet) => {
      if (result) {
        const idx = this.workingEntries.findIndex(we => we.id === result.id);
        this.workingEntries[idx] = result;
      }
    });
  }
  public deleteEntry(workingentry: IWorkingEntryTimesheet) {
    this.workingEntryService.delete(workingentry.id).subscribe(res => {
      if (res.ok) {
        this.ngOnInit();
      }
    });
  }

  checkDate(workingentry: IWorkingEntryTimesheet): boolean {
    if (moment().diff(workingentry.workDay.date, 'days') >= 30) {
      // this.buttonDisable = true;
      return true;
    }
    return false;
  }
}
