import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeTimeSheetWeeklyDialogComponent } from './employee-time-sheet-weekly-dialog-component';
import { IWeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { WeeklyWorkingHoursTimesheetService } from '../weekly-working-hours-timesheet';

@Component({
  selector: 'jhi-employee-timesheet-detail',
  templateUrl: './employee-timesheet-detail.component.html',
  styleUrls: ['./employee-timesheet-detail.component.scss']
})
export class EmployeeTimesheetDetailComponent implements OnInit {
  public lengthEmployeeWeekly: number;
  public employee: EmployeeTimesheet;
  public employeeWeekly = new MatTableDataSource<IWeeklyWorkingHoursTimesheet>([]);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    protected activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private wwhService: WeeklyWorkingHoursTimesheetService
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ employee }) => {
      this.employee = employee;
      this.employeeWeekly.data = this.employee.weeklyWorkingHours;
      this.lengthEmployeeWeekly = this.employeeWeekly.data.length;
      this.pageAndSort();
    });
    this.employeeWeekly.data = this.employee.weeklyWorkingHours;
  }

  refresh() {
    this.employeeWeekly.connect().next(this.employee.weeklyWorkingHours);
    this.pageAndSort();
  }

  pageAndSort() {
    this.cdr.detectChanges();
    this.employeeWeekly.paginator = this.paginator;
    this.employeeWeekly.sort = this.sort;
  }

  previousState() {
    window.history.back();
  }

  openDialog(): void {
    const employeeDialogRef = this.dialog.open(EmployeeTimeSheetWeeklyDialogComponent, {
      data: { employee: this.employee },
      disableClose: true
    });

    employeeDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeWeekly.data.push(result);
        this.lengthEmployeeWeekly++;
        this.refresh();
      }
    });
  }

  deleteRow(row?: IWeeklyWorkingHoursTimesheet): void {
    if (row) {
      this.wwhService.delete(row.id).subscribe(res => {
        if (res.ok) {
          const index = this.employeeWeekly.data.indexOf(row);
          this.employeeWeekly.data.splice(index, 1);
          this.refresh();
        }
      });
    }
  }
}
