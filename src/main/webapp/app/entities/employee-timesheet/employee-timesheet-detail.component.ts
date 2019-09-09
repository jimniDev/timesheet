import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmployeeTimesheet, EmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeTimeSheetWeeklyDialogComponent } from './employee-time-sheet-weekly-dialog-component';
import { IWeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'jhi-employee-timesheet-detail',
  templateUrl: './employee-timesheet-detail.component.html',
  styleUrls: ['./employee-timesheet-detail.component.scss']
})
export class EmployeeTimesheetDetailComponent implements OnInit {
  employee: EmployeeTimesheet;

  employeeWeekly = new MatTableDataSource<IWeeklyWorkingHoursTimesheet>([]);

  constructor(protected activatedRoute: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ employee }) => {
      this.employee = employee;
      this.employeeWeekly.data = this.employee.weeklyWorkingHours;
    });
  }

  refresh() {
    this.employeeWeekly.connect().next(this.employee.weeklyWorkingHours);
  }

  previousState() {
    window.history.back();
  }

  openDialog(): void {
    const employeeDialogRef = this.dialog.open(EmployeeTimeSheetWeeklyDialogComponent, {
      width: '300px',
      height: '350px',
      data: { employee: this.employee },
      disableClose: true
    });

    employeeDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeWeekly.data.push(result);
        this.refresh();
      }
    });
  }

  deleteRow(row?: IWeeklyWorkingHoursTimesheet): void {
    if (row) {
      let index = this.employeeWeekly.data.indexOf(row);
      this.employeeWeekly.data.splice(index, 1);
      this.refresh();
    }
  }
}
