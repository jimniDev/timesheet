import { Component, Inject, OnInit } from '@angular/core';
import { ActivityTimesheet, IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { RoleTimesheet, IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'dialog-rolecreation',
  templateUrl: 'role-creation-dialog.component.html'
})
export class RoleCreationDialogComponent implements OnInit {
  private activities: ActivityTimesheet[];
  private durationInSeconds: number;
  private roles: RoleTimesheet[];
  private idx: number;

  roleCreationForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl('')
  });

  constructor(
    private roleService: RoleTimesheetService,
    private activityService: ActivityTimesheetService,
    public dialogRef: MatDialogRef<RoleCreationDialogComponent>,
    private fb: FormBuilder,
    private alertBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: IRoleTimesheet
  ) {
    this.durationInSeconds = 5;
  }

  ngOnInit() {
    this.activityService.query().subscribe((res: HttpResponse<IActivityTimesheet[]>) => {
      if (res.ok) {
        this.activities = res.body;
      }
    });
  }

  openAlertBar() {
    this.alertBar.open('A role with the same name already exists.', 'Cancel', {
      duration: this.durationInSeconds * 1000
    });
  }

  onSubmit(): void {
    let roleEntry: RoleTimesheet;
    roleEntry = new RoleTimesheet();
    roleEntry.name = this.roleCreationForm.value.name;
    roleEntry.description = this.roleCreationForm.value.description;

    this.roleService.query().subscribe((res: HttpResponse<RoleTimesheet[]>) => {
      if (res.ok) {
        this.roles = res.body;
        this.idx = this.roles.findIndex(r => r.name === roleEntry.name);
        if (this.idx !== -1) {
          this.dialogRef.close();
          this.openAlertBar();
        } else {
          this.createEntry(roleEntry);
        }
      }
    });
  }

  createEntry(roleEntry: IRoleTimesheet): void {
    this.roleService.create(roleEntry).subscribe(res => {
      if (res.ok) {
        this.dialogRef.close(<IRoleTimesheet>res.body);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
