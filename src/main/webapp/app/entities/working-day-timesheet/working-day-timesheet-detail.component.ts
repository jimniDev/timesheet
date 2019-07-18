import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWorkingDayTimesheet } from 'app/shared/model/working-day-timesheet.model';

@Component({
  selector: 'jhi-working-day-timesheet-detail',
  templateUrl: './working-day-timesheet-detail.component.html'
})
export class WorkingDayTimesheetDetailComponent implements OnInit {
  workingDay: IWorkingDayTimesheet;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ workingDay }) => {
      this.workingDay = workingDay;
    });
  }

  previousState() {
    window.history.back();
  }
}
