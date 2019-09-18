import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { AccountService } from 'app/core';
import { EmployeeTimesheetService } from './employee-timesheet.service';

@Component({
  selector: 'jhi-employee-timesheet',
  templateUrl: './employee-timesheet.component.html',
  styleUrls: ['./employee-timesheet.component.scss']
})
export class EmployeeTimesheetComponent implements OnInit, OnDestroy {
  employees: IEmployeeTimesheet[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected employeeService: EmployeeTimesheetService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.employeeService
      .query()
      .pipe(
        filter((res: HttpResponse<IEmployeeTimesheet[]>) => res.ok),
        map((res: HttpResponse<IEmployeeTimesheet[]>) => res.body)
      )
      .subscribe(
        (res: IEmployeeTimesheet[]) => {
          this.employees = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInEmployees();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IEmployeeTimesheet) {
    return item.id;
  }

  registerChangeInEmployees() {
    this.eventSubscriber = this.eventManager.subscribe('employeeListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
