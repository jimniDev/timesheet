import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { AccountService } from 'app/core';
import { RoleTimesheetService } from './role-timesheet.service';

@Component({
  selector: 'jhi-role-timesheet',
  templateUrl: './role-timesheet.component.html'
})
export class RoleTimesheetComponent implements OnInit, OnDestroy {
  roles: IRoleTimesheet[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected roleService: RoleTimesheetService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.roleService
      .query()
      .pipe(
        filter((res: HttpResponse<IRoleTimesheet[]>) => res.ok),
        map((res: HttpResponse<IRoleTimesheet[]>) => res.body)
      )
      .subscribe(
        (res: IRoleTimesheet[]) => {
          this.roles = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInRoles();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IRoleTimesheet) {
    return item.id;
  }

  registerChangeInRoles() {
    this.eventSubscriber = this.eventManager.subscribe('roleListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
