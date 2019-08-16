import { Component, OnInit, ViewChild } from '@angular/core';

import { LoginService, AccountService, Account } from 'app/core';
import { IWorkingEntryTimesheet, WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { TimetableComponent } from './timetable/timetable/timetable.component';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { DateFormComponent } from './date-form/date-form.component';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
  account: Account;
  startBtnName: string;
  started: boolean;
  disableButton: boolean = true;

  @ViewChild(TimetableComponent, { static: false })
  timetableComponent: TimetableComponent;

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

  enableButton(enabled: boolean) {
    this.disableButton = !enabled;
  }

  addnewEntry(workingEntry: WorkingEntryTimesheet) {
    this.timetableComponent.loadNewandSort(workingEntry);
  }

  startStop() {
    if (this.started) {
      this.workingEntryService.end().subscribe(res => {
        if (res.ok) {
          let workingEntry = <IWorkingEntryTimesheet>res.body;
          let indexToUpdate = this.timetableComponent.workingEntries.findIndex(we => we.id == workingEntry.id);
          this.timetableComponent.workingEntries[indexToUpdate] = workingEntry;
          this.startBtnName = 'Start';
          this.started = false;
        }
      });
    } else {
      this.workingEntryService.start().subscribe(res => {
        if (res.ok) {
          let workingEntry = <IWorkingEntryTimesheet>res.body;
          this.timetableComponent.workingEntries.unshift(workingEntry);
          this.startBtnName = 'Stop';
          this.started = true;
        }
      });
    }
  }
}
