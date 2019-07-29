import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IWeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';
import { AccountService } from 'app/core';
import { WeeklyWorkingHoursTimesheetService } from './weekly-working-hours-timesheet.service';

@Component({
  selector: 'jhi-weekly-working-hours-timesheet',
  templateUrl: './weekly-working-hours-timesheet.component.html'
})
export class WeeklyWorkingHoursTimesheetComponent implements OnInit, OnDestroy {
  weeklyWorkingHours: IWeeklyWorkingHoursTimesheet[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected weeklyWorkingHoursService: WeeklyWorkingHoursTimesheetService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.weeklyWorkingHoursService
      .query()
      .pipe(
        filter((res: HttpResponse<IWeeklyWorkingHoursTimesheet[]>) => res.ok),
        map((res: HttpResponse<IWeeklyWorkingHoursTimesheet[]>) => res.body)
      )
      .subscribe(
        (res: IWeeklyWorkingHoursTimesheet[]) => {
          this.weeklyWorkingHours = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInWeeklyWorkingHours();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IWeeklyWorkingHoursTimesheet) {
    return item.id;
  }

  registerChangeInWeeklyWorkingHours() {
    this.eventSubscriber = this.eventManager.subscribe('weeklyWorkingHoursListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
