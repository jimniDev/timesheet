import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDayTimesheet } from 'app/shared/model/day-timesheet.model';

@Component({
  selector: 'jhi-day-timesheet-detail',
  templateUrl: './day-timesheet-detail.component.html'
})
export class DayTimesheetDetailComponent implements OnInit {
  day: IDayTimesheet;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ day }) => {
      this.day = day;
    });
  }

  previousState() {
    window.history.back();
  }
}
