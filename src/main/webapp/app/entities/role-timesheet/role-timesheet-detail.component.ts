import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';

@Component({
  selector: 'jhi-role-timesheet-detail',
  templateUrl: './role-timesheet-detail.component.html'
})
export class RoleTimesheetDetailComponent implements OnInit {
  role: IRoleTimesheet;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ role }) => {
      this.role = role;
    });
  }

  previousState() {
    window.history.back();
  }
}
