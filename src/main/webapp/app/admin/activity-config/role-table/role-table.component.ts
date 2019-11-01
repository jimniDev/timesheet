import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { HttpResponse } from '@angular/common/http';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { MatTableDataSource, MatTable, MatPaginator } from '@angular/material';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleEditDialogComponent } from '../role-edit-dialog/role-edit-dialog.component';

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
        this.refresh();
      }
    });
  }

  refresh() {
    this.datasource.connect().next(this.roles);
    this.pageAndSort();
  }

  pageAndSort() {
    this.cdr.detectChanges();
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
    this.refresh();
  }

  editRoleDialog(role: IRoleTimesheet): void {
    const dialogRef = this.dialog.open(RoleEditDialogComponent, {
      data: { name: role.name, description: role.description, activities: role.activities, role }
    });

    dialogRef.afterClosed().subscribe((result: IRoleTimesheet) => {
      const idx = this.roles.findIndex(we => we.id === result.id);
      this.roles[idx] = result;
      this.refresh();
    });
  }

  public addRole(role: IRoleTimesheet) {
    const idx = this.roles.findIndex(r => r.name === role.name);
    if (idx === -1) {
      this.roles.push(role);
    }
    this.refresh();
  }

  public updateRole(role: IRoleTimesheet) {
    const idx = this.roles.findIndex(r => r.id === role.id);
    this.roles[idx] = role;
    this.table.renderRows();
    this.refresh();
  }

  public deleteRole(role: IRoleTimesheet) {
    this.roleService.delete(role.id).subscribe(res => {
      if (res.ok) {
        this.roles.splice(this.roles.indexOf(role), 1);
        this.table.renderRows();
        this.refresh();
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
