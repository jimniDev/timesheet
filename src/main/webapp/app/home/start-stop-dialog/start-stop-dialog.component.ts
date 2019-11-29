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

@Component({
  selector: 'start-stop-dialog',
  templateUrl: 'start-stop-dialog.component.html'
})
export class StartStopDialogComponent implements OnInit {
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
    public dialogRef: MatDialogRef<StartStopDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IWorkingEntryTimesheet,
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
    this.data.workDay.additionalBreakMinutes = Number.parseInt(this.modalForm.value.addBreakControl, 10) || 0;
    this.data.activity = this.modalForm.value.activityControl;
    this.workingEntryService.update(<IWorkingEntryTimesheet>this.data).subscribe(res => {
      if (res.ok) {
        this.dialogRef.close(res.body || this.data); // Server doesn't respond with body???
      }
    });
  }

  continue(): void {
    this.dialogRef.close();
  }

  onKeyDown(event) {
    const e = <KeyboardEvent>event;
    if (
      // modification : blocked the period (.)
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
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
