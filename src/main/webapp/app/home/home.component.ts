import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LoginService, AccountService, Account } from 'app/core';
import { IWorkingEntryTimesheet, WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { TimetableComponent } from './timetable/timetable.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';
import { HomeDialogComponent } from './home-dialog/home-dialog.component';

export interface DialogData {
  newWorkingEntry: IWorkingEntryTimesheet;
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
  disableButton = true;

  role: string;
  activity: string;
  totalBreakMinutes: number;
  activities: IActivityTimesheet[];
  newWorkingEntry: IWorkingEntryTimesheet;

  @Input() btnColors = 'primary';
  @ViewChild(TimetableComponent, { static: false })
  timetableComponent: TimetableComponent;

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private workingEntryService: WorkingEntryTimesheetService,
    private activityService: ActivityTimesheetService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.accountService.identity().then((account: Account) => {
      this.account = account;
    });
    this.workingEntryService.active().subscribe(res => {
      // check the response from server
      // check header
      if (res.status === 200) {
        this.startBtnName = 'Stop';
        this.started = true;
        this.btnColors = 'warn';
      } else {
        this.startBtnName = 'Start';
        this.started = false;
        this.btnColors = 'primary';
      }
    });
  }

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

  startStop() {
    if (this.started) {
      this.workingEntryService.active().subscribe(res => {
        if (res.ok) {
          this.openDialog(res.body);
        }
      });
    } else {
      this.workingEntryService.start().subscribe(res => {
        if (res.ok) {
          const workingEntry = <IWorkingEntryTimesheet>res.body;
          this.timetableComponent.addNewandSort(workingEntry);
          this.startBtnName = 'Stop';
          this.started = true;
          this.btnColors = 'warn';
          this.disableButton = true;
          setTimeout(() => (this.disableButton = false), 10000);
        }
      });
    }
  }

  openDialog(newWorkingEntry: IWorkingEntryTimesheet): void {
    const dialogConfig = new MatDialogConfig(); // configure the dialog with a set of default behaviors

    dialogConfig.disableClose = true; // user will not be able to close the dialog just by clicking outside of it
    dialogConfig.autoFocus = true; // ocus will be set automatically on the first form field of the dialog
    dialogConfig.data = { newWorkingEntry };

    const dialogRef = this.dialog.open(HomeDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((workingEntry: IWorkingEntryTimesheet) => {
      if (workingEntry) {
        // const indexToUpdate = this.timetableComponent.DSworkingEntries.data.findIndex(we => we.id === workingEntry.id);
        // this.timetableComponent.workingEntries[indexToUpdate] = workingEntry;
        // this.timetableComponent.DSworkingEntries.data = this.timetableComponent.workingEntries;
        // this.timetableComponent.addNewandSort(workingEntry);
        // this.timetableComponent.DSworkingEntries._updateChangeSubscription();
        this.workingEntryService.end().subscribe(res => {
          if (res.ok) {
            const indexToUpdate = this.timetableComponent.DSworkingEntries.data.findIndex(we => we.id === res.body.id);
            this.timetableComponent.workingEntries[indexToUpdate] = res.body;
            this.timetableComponent.DSworkingEntries.data = this.timetableComponent.workingEntries;
            this.startBtnName = 'Start';
            this.started = false;
            this.btnColors = 'primary';
          }
        });
      }
    });
  }
}
