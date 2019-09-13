import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { HttpResponse } from '@angular/common/http';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { MatTableDataSource, MatTable, MatPaginator } from '@angular/material';
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
  datasource = new MatTableDataSource<IRoleTimesheet>();
  displayedColumns: string[] = ['id', 'name', 'description', 'activities', 'actions'];

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private roleService: RoleTimesheetService, public dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.roleService.query().subscribe((res: HttpResponse<IRoleTimesheet[]>) => {
      if (res.ok) {
        this.roles = res.body;
        this.datasource = new MatTableDataSource(this.roles);
        this.datasource.sort = this.sort;
        this.datasource.paginator = this.paginator;
        // this.changeDetectorRefs.detectChanges();
      }
    });
  }

  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }
  editRoleDialog(role: IRoleTimesheet): void {
    const dialogRef = this.dialog.open(ActivityRoleEditDialogComponent, {
      data: { name: role.name, description: role.description, activities: role.activities, role }
    });

    dialogRef.afterClosed().subscribe((result: IRoleTimesheet) => {
      const idx = this.roles.findIndex(we => we.id === result.id);
      this.roles[idx] = result;
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
