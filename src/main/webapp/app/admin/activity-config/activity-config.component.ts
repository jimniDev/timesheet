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

  activities: ActivityTimesheet[];
  panelOpenState = false;
  datasource = this.roles;
  displayedColumns: string[] = ['id', 'name', 'description', 'activities'];

  constructor(private activityService: ActivityTimesheetService, public dialog: MatDialog, private roleService: RoleTimesheetService) {}

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
  openroleDialog(): void {
    const dialogRef = this.dialog.open(Dialogrolecreation, {
      width: '50%'
      //  height: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
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
@Component({
  selector: 'dialog-rolecreation-dialog',
  templateUrl: 'Dialogrolecreation.html'
})
export class Dialogrolecreation {
  constructor(
    private roleService: RoleTimesheetService,
    private activityService: ActivityTimesheetService,
    public dialogRef: MatDialogRef<Dialogrolecreation>,
    @Inject(MAT_DIALOG_DATA) public data: IRoleTimesheet
  ) {}
  activities: ActivityTimesheet[];
  rolemappingForm: FormGroup;
  roles: RoleTimesheet[];
  roleForm: FormGroup;

  ngOnInit() {
    this.rolemappingForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      activities: new FormControl['']()
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
    role.activities = this.rolemappingForm.value.activities;
    this.roleService.create(role).subscribe(res => {
      if (res.ok) {
        // TODO add res.body to the table
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
