import { Component, OnInit } from '@angular/core';
import { EmployeeTimesheet, IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { EmployeeTimesheetService, EmployeeTimesheetDetailComponent } from 'app/entities/employee-timesheet';
import { HttpResponse } from '@angular/common/http';
import { WeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';

@Component({
  selector: 'jhi-employee-overview',
  templateUrl: './employee-overview.component.html',
  styleUrls: ['./employee-overview.component.scss']
})
export class EmployeeOverviewComponent implements OnInit {
  public employees: EmployeeTimesheet[];
  public totalWorkingHours: number;

  constructor(private employeeService: EmployeeTimesheetService) {
    this.totalWorkingHours = 0;
  }

  ngOnInit() {
    this.employeeService.query().subscribe((res: HttpResponse<IEmployeeTimesheet[]>) => {
      if (res.ok) {
        this.employees = res.body;
        this.getActualWeeklyWorkingHours(this.employees);
      }
    });
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
