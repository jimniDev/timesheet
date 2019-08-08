import { Component, OnInit } from '@angular/core';

import { LoginService, AccountService, Account } from 'app/core';
import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
  account: Account;
  workingEntries: IWorkingEntryTimesheet[];
  math = Math;
  startBtnName: string;
  started: boolean;

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private workingEntryService: WorkingEntryTimesheetService
  ) {}

  ngOnInit() {
    this.accountService.identity().then((account: Account) => {
      this.account = account;
    });
    this.loadAll();
    this.workingEntryService.active().subscribe(res => {
      //check the response from server
      //check header
      if (res.status == 200) {
        this.startBtnName = 'Stop';
        this.started = true;
      } else {
        this.startBtnName = 'Start';
        this.started = false;
      }
    });
  }

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

  onError(message: string) {
    throw new Error('Method not implemented.');
  }

  sumDate(date1: any, date2: any): String {
    let sum = Math.abs(date1 - date2) / 36e5;
    return sum.toFixed(2);
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  login() {
    this.loginService.login();
  }

  startStop() {
    if (this.started) {
      this.workingEntryService.end().subscribe(res => {
        if (res.ok) {
          this.startBtnName = 'Start';
          this.started = false;
        }
      });
    } else {
      this.workingEntryService.start().subscribe(res => {
        if (res.ok) {
          this.startBtnName = 'Stop';
          this.started = true;
        }
      });
    }
  }
}
