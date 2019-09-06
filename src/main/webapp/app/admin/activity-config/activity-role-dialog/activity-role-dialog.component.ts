import { Component, Inject } from '@angular/core';
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
export class ActivityRoleDialogComponent {
  activities: ActivityTimesheet[];

  roles: RoleTimesheet[];

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

  onsubmit(): void {
    let roleEntry: RoleTimesheet;
    roleEntry = new RoleTimesheet();
    roleEntry.name = this.rolemappingForm.value.name;
    roleEntry.description = this.rolemappingForm.value.description;
    console.log(this.rolemappingForm.value);
    this.dialogRef.close();
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
