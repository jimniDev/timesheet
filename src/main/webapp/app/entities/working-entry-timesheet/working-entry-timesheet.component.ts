import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { AccountService } from 'app/core';
import { WorkingEntryTimesheetService } from './working-entry-timesheet.service';

@Component({
  selector: 'jhi-working-entry-timesheet',
  templateUrl: './working-entry-timesheet.component.html'
})
export class WorkingEntryTimesheetComponent implements OnInit, OnDestroy {
  workingEntries: IWorkingEntryTimesheet[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected workingEntryService: WorkingEntryTimesheetService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.workingEntryService
      .query()
      .pipe(
        filter((res: HttpResponse<IWorkingEntryTimesheet[]>) => res.ok),
        map((res: HttpResponse<IWorkingEntryTimesheet[]>) => res.body)
      )
      .subscribe(
        (res: IWorkingEntryTimesheet[]) => {
          this.workingEntries = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInWorkingEntries();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IWorkingEntryTimesheet) {
    return item.id;
  }

  registerChangeInWorkingEntries() {
    this.eventSubscriber = this.eventManager.subscribe('workingEntryListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
