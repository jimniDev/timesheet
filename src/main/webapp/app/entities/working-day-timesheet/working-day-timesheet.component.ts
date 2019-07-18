import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IWorkingDayTimesheet } from 'app/shared/model/working-day-timesheet.model';
import { AccountService } from 'app/core';
import { WorkingDayTimesheetService } from './working-day-timesheet.service';

@Component({
  selector: 'jhi-working-day-timesheet',
  templateUrl: './working-day-timesheet.component.html'
})
export class WorkingDayTimesheetComponent implements OnInit, OnDestroy {
  workingDays: IWorkingDayTimesheet[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected workingDayService: WorkingDayTimesheetService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.workingDayService
      .query()
      .pipe(
        filter((res: HttpResponse<IWorkingDayTimesheet[]>) => res.ok),
        map((res: HttpResponse<IWorkingDayTimesheet[]>) => res.body)
      )
      .subscribe(
        (res: IWorkingDayTimesheet[]) => {
          this.workingDays = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInWorkingDays();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IWorkingDayTimesheet) {
    return item.id;
  }

  registerChangeInWorkingDays() {
    this.eventSubscriber = this.eventManager.subscribe('workingDayListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
