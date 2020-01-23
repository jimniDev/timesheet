import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeTimeSheetAddDialogComponent } from './employee-timesheet-add-dialog-component';
import { IWeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';
import { MatTableDataSource, MatTable } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { WeeklyWorkingHoursTimesheetService } from '../weekly-working-hours-timesheet';
import { EmployeeTimesheetEditComponent } from './employee-timesheet-edit-component/employee-timesheet-edit-component';
import { EmployeeTimesheetService, IBalanceHash } from './employee-timesheet.service';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'jhi-employee-timesheet-detail',
  templateUrl: './employee-timesheet-detail.component.html',
  styleUrls: ['./employee-timesheet-detail.component.scss']
})
export class EmployeeTimesheetDetailComponent implements OnInit {
  public selectedYear: number = moment().year();
  public employee: EmployeeTimesheet;
  public employeeWeekly = new MatTableDataSource<IWeeklyWorkingHoursTimesheet>();
  public employeeOverviewWeek: IWeeklyWorkingHoursTimesheet[];
  public editPermit: boolean;
  public editPermitString: string;
  public office: string;
  public monthlyBalanceSource = new MatTableDataSource<IBalanceHash>();
  public yearlyBalance = 0;
  public years = Array.from(Array(20), (e, i) => i + 2019);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  yearForm = new FormGroup({
    yearSelect: new FormControl(this.selectedYear)
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private wwhService: WeeklyWorkingHoursTimesheetService,
    private employeeService: EmployeeTimesheetService
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe((routeData: any) => {
      this.employee = routeData.employee;
      this.employeeOverviewWeek = this.employee.weeklyWorkingHours;
      this.employeeWeekly.data = this.employeeOverviewWeek;
      this.editPermit = this.employee.editPermitted;
      this.office = this.employee.office;
      if (this.editPermit) {
        this.editPermitString = 'permitted';
      } else {
        this.editPermitString = 'blocked';
      }
    });
    this.loadBalanceTable(this.selectedYear);
    this.yearForm.get('yearSelect').valueChanges.subscribe(value => {
      this.onChangeYear(value);
    });
  }

  onChangeYear(year) {
    if (year) {
      this.selectedYear = year;
      this.loadBalanceTable(this.selectedYear);
    }
  }

  loadBalanceTable(year) {
    this.yearlyBalance = 0;
    this.employeeService.balanceByYear(year).subscribe(res => {
      if (res) {
        const balanceArr = Object.keys(res.body).map(key => ({ month: key, balance: res.body[key] }));
        console.log(balanceArr);
        this.monthlyBalanceSource.data = balanceArr;
        balanceArr.forEach(data => (this.yearlyBalance += data.balance));
      }
    });
  }

  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }

  minutesToHHMM(mins: number): string {
    if (mins >= 0) {
      const hour = Math.floor(mins / 60);
      const min = Math.floor(mins % 60);
      return this.pad(hour, 2) + 'h ' + this.pad(min, 2) + 'm';
    } else {
      const hour = Math.ceil(mins / 60);
      const min = Math.ceil(mins % 60);
      return '-' + this.pad(Math.abs(hour), 2) + 'h ' + this.pad(Math.abs(min), 2) + 'm';
    }
  }

  officeChange() {
    if (this.office === 'FFM') {
      this.employee.office = 'FFM';
      this.employeeService.update(this.employee).subscribe();
    } else if (this.office === 'EBM') {
      this.employee.office = 'EBM';
      this.employeeService.update(this.employee).subscribe();
    }
  }

  editPermitAuth() {
    if (this.editPermit) {
      this.employee.editPermitted = false;
      this.employeeService.update(this.employee).subscribe(res => {
        if (res) {
          this.editPermit = false;
          this.editPermitString = 'blocked';
        }
      });
    } else {
      this.employee.editPermitted = true;
      this.employeeService.update(this.employee).subscribe(res => {
        if (res) {
          this.editPermit = true;
          this.editPermitString = 'permitted';
        }
      });
    }
  }

  refresh() {
    this.employeeWeekly.connect().next(this.employeeOverviewWeek);
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

  openWeeklyDialog(): void {
    const employeeDialogRef = this.dialog.open(EmployeeTimeSheetAddDialogComponent, {
      data: { employee: this.employee },
      disableClose: true
    });

    employeeDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addWeeklyData(<IWeeklyWorkingHoursTimesheet>result);
      }
    });
  }

  public addWeeklyData(weeklyWorkingHour: IWeeklyWorkingHoursTimesheet) {
    const idx = this.employeeOverviewWeek.findIndex(r => r.id === weeklyWorkingHour.id);
    if (idx === -1) {
      this.employeeOverviewWeek.push(weeklyWorkingHour);
    }
    this.refresh();
  }

  deleteRow(row?: IWeeklyWorkingHoursTimesheet): void {
    if (row) {
      this.wwhService.delete(row.id).subscribe(res => {
        if (res.ok) {
          this.employeeOverviewWeek.splice(this.employeeOverviewWeek.indexOf(row), 1);
          this.refresh();
        }
      });
    }
  }

  editWeeklyDialog(weeklyWorkingHour: IWeeklyWorkingHoursTimesheet): void {
    const diagRef = this.dialog.open(EmployeeTimesheetEditComponent, {
      data: {
        hours: weeklyWorkingHour.hours,
        startDate: weeklyWorkingHour.startDate,
        endDate: weeklyWorkingHour.endDate,
        employee: this.employee,
        weeklyWorkingHour
      },
      disableClose: true
    });

    diagRef.afterClosed().subscribe(result => {
      if (result) {
        const idx = this.employeeOverviewWeek.findIndex(we => we.id === result.id);
        this.employeeOverviewWeek[idx] = result;
        this.employeeWeekly.data = this.employeeOverviewWeek;
      }
    });
  }
}
