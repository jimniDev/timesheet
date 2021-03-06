import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ActivityCreationDialogComponent } from './activity-creation-dialog/activity-creation-dialog.component';
import { ActivityRoleMappingDialogComponent } from './activity-role-mapping-dialog/activity-role-mapping-dialog.component';
import { RoleTableComponent } from './role-table/role-table.component';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { ActivityTableComponent } from './activity-table/activity-table.component';
import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { RoleCreationDialogComponent } from './role-creation-dialog/role-creation-dialog.component';

@Component({
  selector: 'jhi-activity-config',
  templateUrl: './activity-config.component.html',
  styleUrls: ['./activity-config.component.scss']
})
export class ActivityConfigComponent implements OnInit {
  @ViewChild(RoleTableComponent, { static: false }) roleTable: RoleTableComponent;

  @ViewChild(ActivityTableComponent, { static: false }) activityTable: ActivityTableComponent;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openRoleDialog(): void {
    const dialogRef = this.dialog.open(RoleCreationDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleTable.addRole(<IRoleTimesheet>result);
      }
    });
  }

  openActivityDialog(): void {
    const dialogRef = this.dialog.open(ActivityCreationDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.activityTable.addActivity(<IActivityTimesheet>result);
      }
    });
  }

  openMappingDialog(): void {
    const dialogRef = this.dialog.open(ActivityRoleMappingDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleTable.updateRole(<IRoleTimesheet>result);
      }
    });
  }
}
