import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { HttpResponse } from '@angular/common/http';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { MatTableDataSource, MatTable } from '@angular/material';
import { ActivityRoleEditDialogComponent } from 'app/admin/activity-config/activity-role-edit-dialog/activity-role-edit-dialog.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-role-table',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.scss']
})
export class RoleTableComponent implements OnInit {
  [x: string]: any;
  roles: IRoleTimesheet[];
  datasource: MatTableDataSource<IRoleTimesheet>; // = new MatTableDataSource<IRoleTimesheet>();
  displayedColumns: string[] = ['id', 'name', 'description', 'activities', 'action_edit', 'actions'];

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  constructor(private roleService: RoleTimesheetService, public dialog: MatDialog) {}

  ngOnInit() {
    this.roleService.query().subscribe((res: HttpResponse<IRoleTimesheet[]>) => {
      if (res.ok) {
        this.roles = res.body;
        this.datasource = new MatTableDataSource(this.roles);
        // this.changeDetectorRefs.detectChanges();
      }
    });
  }
  editRoleDialog(role: IRoleTimesheet): void {
    const dialogRef = this.dialog.open(ActivityRoleEditDialogComponent, {
      width: '25%',
      data: { name: role.name, description: role.description, activities: role.activities, role: role }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //   this.roleTable.update(<IRoleTimesheet>result);
      }
    });
  }

  public addRole(role: IRoleTimesheet) {
    this.roles.push(role);
    this.table.renderRows();
  }

  // editRoleDialog(): void {
  //   const dialogRef = this.dialog.open(ActivityRoleEditDialogComponent, {
  //     //width: '25%'
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.roleTable.addRole(<IRoleTimesheet>result);
  //     }
  //   });
  // }

  public deleteRole(role: IRoleTimesheet) {
    this.roleService.delete(role.id).subscribe(res => {
      if (res.ok) {
        this.roles.splice(this.roles.indexOf(role), 1);
        this.table.renderRows();
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
