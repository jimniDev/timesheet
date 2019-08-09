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

  loadAll() {}

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
