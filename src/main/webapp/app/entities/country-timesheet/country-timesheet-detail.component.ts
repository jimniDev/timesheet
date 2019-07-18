import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICountryTimesheet } from 'app/shared/model/country-timesheet.model';

@Component({
  selector: 'jhi-country-timesheet-detail',
  templateUrl: './country-timesheet-detail.component.html'
})
export class CountryTimesheetDetailComponent implements OnInit {
  country: ICountryTimesheet;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ country }) => {
      this.country = country;
    });
  }

  previousState() {
    window.history.back();
  }
}
