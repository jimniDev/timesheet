import { Component, OnInit } from '@angular/core';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { RoleTimesheet, IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-activity-config',
  templateUrl: './activity-config.component.html',
  styleUrls: ['./activity-config.component.scss']
})
export class ActivityConfigComponent implements OnInit {
  roles: RoleTimesheet[];

  panelOpenState = false;
  datasource = this.roles;
  displayedColumns: string[] = ['id', 'name', 'description', 'activities'];
  constructor(private roleService: RoleTimesheetService) {}

  ngOnInit() {
    this.roleService.query().subscribe((res: HttpResponse<IRoleTimesheet[]>) => {
      if (res.ok) {
        this.roles = res.body;
      }
    });
  }
}
