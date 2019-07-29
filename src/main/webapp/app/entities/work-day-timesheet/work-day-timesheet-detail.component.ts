import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';

@Component({
  selector: 'jhi-work-day-timesheet-detail',
  templateUrl: './work-day-timesheet-detail.component.html'
})
export class WorkDayTimesheetDetailComponent implements OnInit {
  workDay: IWorkDayTimesheet;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ workDay }) => {
      this.workDay = workDay;
    });
  }

  previousState() {
    window.history.back();
  }
}
