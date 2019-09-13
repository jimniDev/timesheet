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
    addBreakControl: new FormControl('')
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
  }

  save() {
    this.data.newWorkingEntry.workDay.additionalBreakMinutes = this.modalForm.value.addBreakControl;
    this.data.newWorkingEntry.activity = this.modalForm.value.activityControl;
    this.workingEntryService.update(this.data.newWorkingEntry).subscribe(res => {
      console.log(res);
      if (res.ok) {
        this.dialogRef.close(res.body);
      }
    });
  }

  onChangeRole(role: IRoleTimesheet) {
    if (role) {
      this.selectableActivities = role.activities;
    }
  }
}
