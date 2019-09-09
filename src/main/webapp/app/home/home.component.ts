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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IActivityTimesheet, ActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';

export interface DialogData {
  totalBreakMinutes: number;
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
  disableButton: boolean = true;

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

  startStop() {
    if (this.started) {
      this.openDialog();
      this.workingEntryService.end().subscribe(res => {
        if (res.ok) {
          let workingEntry = <IWorkingEntryTimesheet>res.body;
          this.totalBreakMinutes = workingEntry.workDay.totalBreakMinutes;
          let indexToUpdate = this.timetableComponent.DSworkingEntries.data.findIndex(we => we.id == workingEntry.id);
          this.timetableComponent.DSworkingEntries.data[indexToUpdate] = workingEntry;
          this.timetableComponent.DSworkingEntries._updateChangeSubscription();

          this.startBtnName = 'Start';
          this.started = false;
          this.btnColors = 'primary';
        }
      });
    } else {
      this.workingEntryService.start().subscribe(res => {
        if (res.ok) {
          let workingEntry = <IWorkingEntryTimesheet>res.body;
          this.timetableComponent.addNewandSort(workingEntry);
          this.newWorkingEntry = workingEntry;
          this.startBtnName = 'Stop';
          this.started = true;
          this.btnColors = 'warn';
        }
      });
    }
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig(); //configure the dialog with a set of default behaviors

    dialogConfig.disableClose = true; //user will not be able to close the dialog just by clicking outside of it
    dialogConfig.autoFocus = true; //ocus will be set automatically on the first form field of the dialog
    dialogConfig.data = {
      newWorkingEntry: this.newWorkingEntry,
      totalBreakMinutes: this.totalBreakMinutes
    };

    //this.dialog.open(HomeDialog, dialogConfig);
    const dialogRef = this.dialog.open(HomeDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }
}

@Component({
  selector: 'home-dialog',
  templateUrl: 'home-dialog.html'
})
export class HomeDialog {
  modalForm = new FormGroup({
    roleControl: new FormControl('', Validators.required),
    activityControl: new FormControl('', Validators.required),
    addBreakControl: new FormControl('')
  });

  openform: boolean = false;
  activities: IActivityTimesheet[];
  roles: IRoleTimesheet[];
  selectableActivities: IActivityTimesheet[];

  constructor(
    public dialogRef: MatDialogRef<HomeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private activityService: ActivityTimesheetService,
    private roleService: RoleTimesheetService,
    private workingEntryService: WorkingEntryTimesheetService
  ) {}

  ngOnInit() {
    this.roleService.query().subscribe((res: HttpResponse<IRoleTimesheet[]>) => {
      if (res.ok) {
        this.roles = res.body;
      }
    });
    this.activityService.query().subscribe((res: HttpResponse<IActivityTimesheet[]>) => {
      if (res.ok) {
        this.activities = res.body;
        this.selectableActivities = this.activities;
      }
    });
  }

  save() {
    this.workingEntryService.active().subscribe(res => {
      if (res.ok) {
        let finishEntry = <IWorkingEntryTimesheet>res.body;
        finishEntry.workDay.totalBreakMinutes += this.modalForm.value.addBreakControl;
        let activity: ActivityTimesheet = new ActivityTimesheet();
        this.activities.forEach(a => {
          if (a.id == this.modalForm.value.activityControl.id) {
            activity = a;
          }
        });
        finishEntry.activity = activity;
        this.workingEntryService.update(finishEntry).subscribe(res => {
          if (res.ok) {
            this.dialogRef.close();
          }
        });
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClickAddBreak() {
    this.openform = true;
  }

  onChangeRole(role: IRoleTimesheet) {
    if (role) {
      this.selectableActivities = role.activities;
    }
  }
}
