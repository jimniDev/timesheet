import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';

@Component({
  selector: 'jhi-employee-timesheet-detail',
  templateUrl: './employee-timesheet-detail.component.html'
})
export class EmployeeTimesheetDetailComponent implements OnInit {
  employee: IEmployeeTimesheet;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ employee }) => {
      this.employee = employee;
    });
  }

  previousState() {
    window.history.back();
  }
}
