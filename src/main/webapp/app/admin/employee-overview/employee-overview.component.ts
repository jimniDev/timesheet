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

  // balances = new Array<Observable<number>>();

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

  // getBalance(employeeId: number): Observable<number> {
  //   return this.employeeService.balanceByEmployee(employeeId).pipe(map(res => res.ok ? res.body : 0));
  // }
}
