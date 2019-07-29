import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IWorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';
import { AccountService } from 'app/core';
import { WorkDayTimesheetService } from './work-day-timesheet.service';

@Component({
  selector: 'jhi-work-day-timesheet',
  templateUrl: './work-day-timesheet.component.html'
})
export class WorkDayTimesheetComponent implements OnInit, OnDestroy {
  workDays: IWorkDayTimesheet[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected workDayService: WorkDayTimesheetService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.workDayService
      .query()
      .pipe(
        filter((res: HttpResponse<IWorkDayTimesheet[]>) => res.ok),
        map((res: HttpResponse<IWorkDayTimesheet[]>) => res.body)
      )
      .subscribe(
        (res: IWorkDayTimesheet[]) => {
          this.workDays = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInWorkDays();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IWorkDayTimesheet) {
    return item.id;
  }

  registerChangeInWorkDays() {
    this.eventSubscriber = this.eventManager.subscribe('workDayListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
