import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { AccountService } from 'app/core';
import { ActivityTimesheetService } from './activity-timesheet.service';

@Component({
  selector: 'jhi-activity-timesheet',
  templateUrl: './activity-timesheet.component.html'
})
export class ActivityTimesheetComponent implements OnInit, OnDestroy {
  activities: IActivityTimesheet[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected activityService: ActivityTimesheetService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.activityService
      .query()
      .pipe(
        filter((res: HttpResponse<IActivityTimesheet[]>) => res.ok),
        map((res: HttpResponse<IActivityTimesheet[]>) => res.body)
      )
      .subscribe(
        (res: IActivityTimesheet[]) => {
          this.activities = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInActivities();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IActivityTimesheet) {
    return item.id;
  }

  registerChangeInActivities() {
    this.eventSubscriber = this.eventManager.subscribe('activityListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
