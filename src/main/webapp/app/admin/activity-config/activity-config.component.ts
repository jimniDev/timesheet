import { Component, OnInit, Inject } from '@angular/core';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { RoleTimesheet, IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivityTimesheet, IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-activity-config',
  templateUrl: './activity-config.component.html',
  styleUrls: ['./activity-config.component.scss']
})
export class ActivityConfigComponent implements OnInit {
  roles: RoleTimesheet[];
  roleForm: FormGroup;
  rolemappingForm: FormGroup;
  activities: ActivityTimesheet[];
  panelOpenState = false;
  datasource = this.roles;
  displayedColumns: string[] = ['id', 'name', 'description', 'activities'];

  constructor(public dialog: MatDialog, private roleService: RoleTimesheetService, private activityService: ActivityTimesheetService) {}

  openroleDialog(): void {}

  ngOnInit() {
    this.roleForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      activities: new FormControl('')
    });
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
    let role: IRoleTimesheet = <IRoleTimesheet>this.roleForm.value;
    role.name = this.roleForm.value.name;
    role.description = this.roleForm.value.description;
    role.activities = null;
    this.roleService.create(role).subscribe(res => {
      if (res.ok) {
        // TODO add res.body to the table
      }
    });
  }
}

export class Dialogrolecreation {
  constructor(public dialogRef: MatDialogRef<Dialogrolecreation>, @Inject(MAT_DIALOG_DATA) public data: IRoleTimesheet) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
