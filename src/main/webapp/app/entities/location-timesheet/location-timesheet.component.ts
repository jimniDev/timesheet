import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ILocationTimesheet } from 'app/shared/model/location-timesheet.model';
import { AccountService } from 'app/core';
import { LocationTimesheetService } from './location-timesheet.service';

@Component({
  selector: 'jhi-location-timesheet',
  templateUrl: './location-timesheet.component.html'
})
export class LocationTimesheetComponent implements OnInit, OnDestroy {
  locations: ILocationTimesheet[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected locationService: LocationTimesheetService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.locationService
      .query()
      .pipe(
        filter((res: HttpResponse<ILocationTimesheet[]>) => res.ok),
        map((res: HttpResponse<ILocationTimesheet[]>) => res.body)
      )
      .subscribe(
        (res: ILocationTimesheet[]) => {
          this.locations = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInLocations();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ILocationTimesheet) {
    return item.id;
  }

  registerChangeInLocations() {
    this.eventSubscriber = this.eventManager.subscribe('locationListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
