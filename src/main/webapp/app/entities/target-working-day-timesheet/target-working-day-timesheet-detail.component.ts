import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITargetWorkingDayTimesheet } from 'app/shared/model/target-working-day-timesheet.model';

@Component({
  selector: 'jhi-target-working-day-timesheet-detail',
  templateUrl: './target-working-day-timesheet-detail.component.html'
})
export class TargetWorkingDayTimesheetDetailComponent implements OnInit {
  targetWorkingDay: ITargetWorkingDayTimesheet;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ targetWorkingDay }) => {
      this.targetWorkingDay = targetWorkingDay;
    });
  }

  previousState() {
    window.history.back();
  }
}
