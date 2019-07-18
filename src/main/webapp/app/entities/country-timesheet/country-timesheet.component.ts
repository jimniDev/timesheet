import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICountryTimesheet } from 'app/shared/model/country-timesheet.model';
import { AccountService } from 'app/core';
import { CountryTimesheetService } from './country-timesheet.service';

@Component({
  selector: 'jhi-country-timesheet',
  templateUrl: './country-timesheet.component.html'
})
export class CountryTimesheetComponent implements OnInit, OnDestroy {
  countries: ICountryTimesheet[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected countryService: CountryTimesheetService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.countryService
      .query()
      .pipe(
        filter((res: HttpResponse<ICountryTimesheet[]>) => res.ok),
        map((res: HttpResponse<ICountryTimesheet[]>) => res.body)
      )
      .subscribe(
        (res: ICountryTimesheet[]) => {
          this.countries = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInCountries();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ICountryTimesheet) {
    return item.id;
  }

  registerChangeInCountries() {
    this.eventSubscriber = this.eventManager.subscribe('countryListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
