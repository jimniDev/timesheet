import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ITargetWorkingDayTimesheet } from 'app/shared/model/target-working-day-timesheet.model';
import { AccountService } from 'app/core';
import { TargetWorkingDayTimesheetService } from './target-working-day-timesheet.service';

@Component({
  selector: 'jhi-target-working-day-timesheet',
  templateUrl: './target-working-day-timesheet.component.html'
})
export class TargetWorkingDayTimesheetComponent implements OnInit, OnDestroy {
  targetWorkingDays: ITargetWorkingDayTimesheet[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected targetWorkingDayService: TargetWorkingDayTimesheetService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.targetWorkingDayService
      .query()
      .pipe(
        filter((res: HttpResponse<ITargetWorkingDayTimesheet[]>) => res.ok),
        map((res: HttpResponse<ITargetWorkingDayTimesheet[]>) => res.body)
      )
      .subscribe(
        (res: ITargetWorkingDayTimesheet[]) => {
          this.targetWorkingDays = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInTargetWorkingDays();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ITargetWorkingDayTimesheet) {
    return item.id;
  }

  registerChangeInTargetWorkingDays() {
    this.eventSubscriber = this.eventManager.subscribe('targetWorkingDayListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
