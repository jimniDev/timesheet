import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';

@Component({
  selector: 'jhi-activity-timesheet-detail',
  templateUrl: './activity-timesheet-detail.component.html'
})
export class ActivityTimesheetDetailComponent implements OnInit {
  activity: IActivityTimesheet;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ activity }) => {
      this.activity = activity;
    });
  }

  previousState() {
    window.history.back();
  }
}
