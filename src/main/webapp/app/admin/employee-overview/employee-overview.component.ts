import { Component, OnInit } from '@angular/core';
import { EmployeeTimesheet, IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet';
import { HttpResponse } from '@angular/common/http';
import { WeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';

@Component({
  selector: 'jhi-employee-overview',
  templateUrl: './employee-overview.component.html',
  styleUrls: ['./employee-overview.component.scss']
})
export class EmployeeOverviewComponent implements OnInit {
  employees: EmployeeTimesheet[];

  constructor(private employeeService: EmployeeTimesheetService) {}

  ngOnInit() {
    this.employeeService.query().subscribe((res: HttpResponse<IEmployeeTimesheet[]>) => {
      if (res.ok) {
        this.employees = res.body;
      }
    });
  }

  getActualWeeklyWorkingHours(employee: IEmployeeTimesheet): number {
    let workingHours: WeeklyWorkingHoursTimesheet = null;
    for (let wwH of employee.weeklyWorkingHours) {
      if (workingHours === null) {
        workingHours = wwH;
      } else if (wwH.endDate.isAfter(workingHours.endDate)) {
        workingHours = wwH;
      }
    }
    if (workingHours.hours) {
      return workingHours.hours;
    } else {
      return 0;
    }
  }
}
