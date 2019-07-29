import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';

@Component({
  selector: 'jhi-weekly-working-hours-timesheet-detail',
  templateUrl: './weekly-working-hours-timesheet-detail.component.html'
})
export class WeeklyWorkingHoursTimesheetDetailComponent implements OnInit {
  weeklyWorkingHours: IWeeklyWorkingHoursTimesheet;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ weeklyWorkingHours }) => {
      this.weeklyWorkingHours = weeklyWorkingHours;
    });
  }

  previousState() {
    window.history.back();
  }
}
