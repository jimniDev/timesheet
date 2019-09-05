import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';

import { LoginService, AccountService, Account } from 'app/core';
import { IWorkingEntryTimesheet, WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { TimetableComponent } from './timetable/timetable.component';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { DateFormComponent } from './date-form/date-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  role: string;
  activity: string;
  totalbreakMinutes: number;
}

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

  role: string;
  activity: string;
  totalBreakMinutes: number;

  @Input() btnColors = 'primary';
  @ViewChild(TimetableComponent, { static: false })
  timetableComponent: TimetableComponent;

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private workingEntryService: WorkingEntryTimesheetService,
    private modalService: NgbModal,
    public dialog: MatDialog
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
    this.timetableComponent.addNewandSort(workingEntry);
  }

  startStop(content) {
    if (this.started) {
      this.workingEntryService.end().subscribe(res => {
        if (res.ok) {
          let workingEntry = <IWorkingEntryTimesheet>res.body;
          let indexToUpdate = this.timetableComponent.DSworkingEntries.data.findIndex(we => we.id == workingEntry.id);
          this.timetableComponent.DSworkingEntries.data[indexToUpdate] = workingEntry;
          this.timetableComponent.DSworkingEntries._updateChangeSubscription();
          this.totalBreakMinutes = workingEntry.workDay.totalBreakMinutes;
          this.openDialog();
          this.startBtnName = 'Start';
          this.started = false;
          this.btnColors = 'primary';
        }
      });
    } else {
      this.workingEntryService.start().subscribe(res => {
        if (res.ok) {
          let workingEntry = <IWorkingEntryTimesheet>res.body;
          //this.timetableComponent.workingEntries.unshift(workingEntry);
          //this.timetableComponent.DSworkingEntries.data.unshift(workingEntry);
          //this.timetableComponent.DSworkingEntries._updateChangeSubscription();
          this.timetableComponent.addNewandSort(workingEntry);
          this.startBtnName = 'Stop';
          this.started = true;
          this.btnColors = 'warn';
        }
      });
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(HomeDialog, {
      width: '250px',
      data: { role: this.role, animal: this.activity }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }
}

@Component({
  selector: 'home-dialog',
  templateUrl: 'home-dialog.html'
})
export class HomeDialog {
  constructor(public dialogRef: MatDialogRef<HomeDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
