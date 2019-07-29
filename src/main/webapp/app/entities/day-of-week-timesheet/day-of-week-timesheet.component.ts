import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IDayOfWeekTimesheet } from 'app/shared/model/day-of-week-timesheet.model';
import { AccountService } from 'app/core';
import { DayOfWeekTimesheetService } from './day-of-week-timesheet.service';

@Component({
  selector: 'jhi-day-of-week-timesheet',
  templateUrl: './day-of-week-timesheet.component.html'
})
export class DayOfWeekTimesheetComponent implements OnInit, OnDestroy {
  dayOfWeeks: IDayOfWeekTimesheet[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected dayOfWeekService: DayOfWeekTimesheetService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.dayOfWeekService
      .query()
      .pipe(
        filter((res: HttpResponse<IDayOfWeekTimesheet[]>) => res.ok),
        map((res: HttpResponse<IDayOfWeekTimesheet[]>) => res.body)
      )
      .subscribe(
        (res: IDayOfWeekTimesheet[]) => {
          this.dayOfWeeks = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInDayOfWeeks();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IDayOfWeekTimesheet) {
    return item.id;
  }

  registerChangeInDayOfWeeks() {
    this.eventSubscriber = this.eventManager.subscribe('dayOfWeekListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
