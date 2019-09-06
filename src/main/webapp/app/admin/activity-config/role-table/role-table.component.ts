import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { HttpResponse } from '@angular/common/http';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { MatTableDataSource, MatTable } from '@angular/material';

@Component({
  selector: 'jhi-role-table',
  templateUrl: './role-table.component.html',
  styleUrls: ['./role-table.component.scss']
})
export class RoleTableComponent implements OnInit {
  roles: IRoleTimesheet[];
  datasource: MatTableDataSource<IRoleTimesheet>; // = new MatTableDataSource<IRoleTimesheet>();
  displayedColumns: string[] = ['id', 'name', 'description', 'activities', 'actions'];

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  constructor(private roleService: RoleTimesheetService) {}

  ngOnInit() {
    this.roleService.query().subscribe((res: HttpResponse<IRoleTimesheet[]>) => {
      if (res.ok) {
        this.roles = res.body;
        this.datasource = new MatTableDataSource(this.roles);
        // this.changeDetectorRefs.detectChanges();
      }
    });
  }

  public addRole(role: IRoleTimesheet) {
    this.roles.push(role);
    this.table.renderRows();
  }

  public deleteRole(role: IRoleTimesheet) {
    this.roleService.delete(role.id).subscribe(res => {
      if (res.ok) {
        this.roles.splice(this.roles.indexOf(role), 1);
        this.table.renderRows();
      }
    });
  }
}
