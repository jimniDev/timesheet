import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeTimesheet, IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet';
import { HttpResponse } from '@angular/common/http';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'jhi-employee-overview',
  templateUrl: './employee-overview.component.html',
  styleUrls: ['./employee-overview.component.scss']
})
export class EmployeeOverviewComponent implements OnInit {
  public employees: EmployeeTimesheet[];
  datasource = new MatTableDataSource<EmployeeTimesheet>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private employeeService: EmployeeTimesheetService) {}

  ngOnInit() {
    this.employeeService.query().subscribe((res: HttpResponse<IEmployeeTimesheet[]>) => {
      if (res.ok) {
        this.employees = res.body;
        this.datasource = new MatTableDataSource(this.employees);
        this.datasource.paginator = this.paginator;
      }
    });
  }

  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
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

  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }
}
