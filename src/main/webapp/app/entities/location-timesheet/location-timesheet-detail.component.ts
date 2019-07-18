import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILocationTimesheet } from 'app/shared/model/location-timesheet.model';

@Component({
  selector: 'jhi-location-timesheet-detail',
  templateUrl: './location-timesheet-detail.component.html'
})
export class LocationTimesheetDetailComponent implements OnInit {
  location: ILocationTimesheet;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ location }) => {
      this.location = location;
    });
  }

  previousState() {
    window.history.back();
  }
}
