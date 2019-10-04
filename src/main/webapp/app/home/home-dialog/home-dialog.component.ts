import { Component, Inject, OnInit } from '@angular/core';
import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { HttpResponse } from '@angular/common/http';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';

export interface DialogData {
  newWorkingEntry: IWorkingEntryTimesheet;
}

@Component({
  selector: 'home-dialog',
  templateUrl: 'home-dialog.component.html'
})
export class HomeDialogComponent implements OnInit {
  modalForm = new FormGroup({
    roleControl: new FormControl('', Validators.required),
    activityControl: new FormControl('', Validators.required),
    addBreakControl: new FormControl('', Validators.pattern('^[0-9]*$'))
  });

  openform = false;
  activities: IActivityTimesheet[];
  roles: IRoleTimesheet[];
  selectableActivities: IActivityTimesheet[];
  breaktime: number;

  constructor(
    public dialogRef: MatDialogRef<HomeDialogComponent>,
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
    this.modalForm.get('roleControl').valueChanges.subscribe(value => {
      if (value) {
        this.selectableActivities = value.activities;
      }
    });
  }

  save() {
    this.data.newWorkingEntry.workDay.additionalBreakMinutes = Number.parseInt(this.modalForm.value.addBreakControl, 10) || 0;
    this.data.newWorkingEntry.activity = this.modalForm.value.activityControl;
    this.workingEntryService.update(this.data.newWorkingEntry).subscribe(res => {
      if (res.ok) {
        this.dialogRef.close(res.body);
      }
    });
  }

  continue(): void {
    this.dialogRef.close();
  }

  onKeyDown(event) {
    const e = <KeyboardEvent>event;
    if (
      [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }
}
