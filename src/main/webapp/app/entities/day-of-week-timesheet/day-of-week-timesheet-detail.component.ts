import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDayOfWeekTimesheet } from 'app/shared/model/day-of-week-timesheet.model';

@Component({
  selector: 'jhi-day-of-week-timesheet-detail',
  templateUrl: './day-of-week-timesheet-detail.component.html'
})
export class DayOfWeekTimesheetDetailComponent implements OnInit {
  dayOfWeek: IDayOfWeekTimesheet;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ dayOfWeek }) => {
      this.dayOfWeek = dayOfWeek;
    });
  }

  previousState() {
    window.history.back();
  }
}
