import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IWorkBreakTimesheet } from 'app/shared/model/work-break-timesheet.model';
import { AccountService } from 'app/core';
import { WorkBreakTimesheetService } from './work-break-timesheet.service';

@Component({
  selector: 'jhi-work-break-timesheet',
  templateUrl: './work-break-timesheet.component.html'
})
export class WorkBreakTimesheetComponent implements OnInit, OnDestroy {
  workBreaks: IWorkBreakTimesheet[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected workBreakService: WorkBreakTimesheetService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.workBreakService
      .query()
      .pipe(
        filter((res: HttpResponse<IWorkBreakTimesheet[]>) => res.ok),
        map((res: HttpResponse<IWorkBreakTimesheet[]>) => res.body)
      )
      .subscribe(
        (res: IWorkBreakTimesheet[]) => {
          this.workBreaks = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInWorkBreaks();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IWorkBreakTimesheet) {
    return item.id;
  }

  registerChangeInWorkBreaks() {
    this.eventSubscriber = this.eventManager.subscribe('workBreakListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
