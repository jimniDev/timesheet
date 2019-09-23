import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeTimesheet, IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { EmployeeTimesheetService, EmployeeTimesheetDetailComponent } from 'app/entities/employee-timesheet';
import { HttpResponse } from '@angular/common/http';
import { WeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';

@Component({
  selector: 'jhi-employee-overview',
  templateUrl: './employee-overview.component.html',
  styleUrls: ['./employee-overview.component.scss']
})
export class EmployeeOverviewComponent implements OnInit {
  public employees: EmployeeTimesheet[];
  public totalWorkingHours: number;
  datasource = new MatTableDataSource<EmployeeTimesheet>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private employeeService: EmployeeTimesheetService) {
    this.totalWorkingHours = 0;
  }

  ngOnInit() {
    this.employeeService.query().subscribe((res: HttpResponse<IEmployeeTimesheet[]>) => {
      if (res.ok) {
        this.employees = res.body;
        this.getActualWeeklyWorkingHours(this.employees);
        this.datasource = new MatTableDataSource(this.employees);
        this.datasource.paginator = this.paginator;
      }
    });
  }
  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }
  getActualWeeklyWorkingHours(employee: EmployeeTimesheet[]): void {
    if (employee) {
      for (let indexEmployee = 0; indexEmployee < employee.length; indexEmployee++) {
        for (let indexEmployeeHour = 0; indexEmployeeHour < employee[indexEmployee].weeklyWorkingHours.length; indexEmployeeHour++) {
          this.totalWorkingHours += employee[indexEmployee].weeklyWorkingHours[indexEmployeeHour].hours;
        }
      }
    }
  }
}
