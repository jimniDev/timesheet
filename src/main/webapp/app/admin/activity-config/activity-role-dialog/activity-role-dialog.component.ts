import { Component, Inject, OnInit } from '@angular/core';
import { ActivityTimesheet, IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { RoleTimesheet, IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'dialog-rolecreation',
  templateUrl: 'activity-role-dialog.component.html'
})
export class ActivityRoleDialogComponent implements OnInit {
  activities: ActivityTimesheet[];

  roles: RoleTimesheet[];
  idx: number;

  rolemappingForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    activitiesform: new FormControl('')
  });

  constructor(
    private roleService: RoleTimesheetService,
    private activityService: ActivityTimesheetService,
    public dialogRef: MatDialogRef<ActivityRoleDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: IRoleTimesheet
  ) {}

  ngOnInit() {
    this.activityService.query().subscribe((res: HttpResponse<IActivityTimesheet[]>) => {
      if (res.ok) {
        this.activities = res.body;
      }
    });
  }

  onSubmit(): void {
    let roleEntry: RoleTimesheet;
    roleEntry = new RoleTimesheet();
    roleEntry.name = this.rolemappingForm.value.name;
    roleEntry.description = this.rolemappingForm.value.description;

    this.roleService.query().subscribe((res: HttpResponse<RoleTimesheet[]>) => {
      if (res.ok) {
        this.roles = res.body;
        this.idx = this.roles.findIndex(r => r.name === roleEntry.name);
        if (this.idx !== -1) {
          this.dialogRef.close();
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
