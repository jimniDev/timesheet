import { Component, Inject, OnInit } from '@angular/core';
import { ActivityTimesheet, IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { RoleTimesheet, IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'dialog-mapping',
  templateUrl: 'activity-role-mapping-dialog.component.html'
})
export class ActivityRoleMappingDialogComponent implements OnInit {
  activities: ActivityTimesheet[];
  defaultActivities: ActivityTimesheet[];

  roles: RoleTimesheet[];

  roleName: string;

  idx: number;

  mappingForm = new FormGroup({
    role: new FormControl(''),
    activities: new FormControl()
  });

  constructor(
    private roleService: RoleTimesheetService,
    private activityService: ActivityTimesheetService,
    public dialogRef: MatDialogRef<ActivityRoleMappingDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: IActivityTimesheet
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
      }
    });
  }

  onSubmit(): void {
    const role = <IRoleTimesheet>this.mappingForm.value.role;
    const activities = <IActivityTimesheet[]>this.mappingForm.value.activities;
    role.activities = activities;

    this.roleService.update(role).subscribe(res => {
      if (res.ok) {
        this.dialogRef.close(res.body);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateName(rolename: string): void {
    this.roleName = rolename;
    this.updateActivity();
  }

  updateActivity(): void {
    this.idx = this.roles.findIndex(r => r.name === this.roleName);
    if (this.idx !== -1) {
      this.defaultActivities = this.roles[this.idx].activities;

      for (const index of this.defaultActivities) {
        const id = this.activities.findIndex(a => a.name === index.name);

        if (id !== -1) {
          this.activities[id] = index;
          this.mappingForm.controls.activities.setValue(this.defaultActivities, { onlySelf: true });
        }
      }
    }
  }
}
