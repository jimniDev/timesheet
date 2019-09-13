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

  roles: RoleTimesheet[];

  mappingForm = new FormGroup({
    role: new FormControl(''),
    activities: new FormControl('')
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

  onsubmit(): void {
    const rolesub = <IRoleTimesheet>this.mappingForm.value.role;
    const activities = <IActivityTimesheet[]>this.mappingForm.value.activities;
    activities.forEach(element => {
      rolesub.activities.push(element);
    });
    this.roleService.update(rolesub).subscribe(res => {
      if (res.ok) {
        // TODO add res.body to the table
      }
    });
    console.log(this.mappingForm.value);
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
