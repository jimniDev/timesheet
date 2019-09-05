import { Component, OnInit, Inject } from '@angular/core';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { RoleTimesheet, IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  constructor(private activityService: ActivityTimesheetService, public dialog: MatDialog, private roleService: RoleTimesheetService) {}
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
  openroleDialog(): void {
    const dialogRef = this.dialog.open(activityroledialog, {
      width: '50%'
    });
  }
  openactivityDialog(): void {
    const dialogRef = this.dialog.open(activityCreationdialog, {
      width: '50%'
    });
  }
  openmappingDialog(): void {
    const dialogRef = this.dialog.open(roleactivitymappingDialog, {
      width: '50%'
    });
  }
}
@Component({
  selector: 'dialog-mapping',
  templateUrl: 'activity-role-mapping-dialog.html'
})
export class roleactivitymappingDialog {
  activities: ActivityTimesheet[];
  roles: RoleTimesheet[];
  mappingForm = new FormGroup({
    role: new FormControl(''),
    activities: new FormControl('')
  });
  constructor(
    private roleService: RoleTimesheetService,
    private activityService: ActivityTimesheetService,
    public dialogRef: MatDialogRef<activityCreationdialog>,
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
    let rolesub = <IRoleTimesheet>this.mappingForm.value.role;
    let activities = <IActivityTimesheet[]>this.mappingForm.value.activities;
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
@Component({
  selector: 'dialog-activitycreation',
  templateUrl: 'activity-creation-dialog.html'
})
export class activityCreationdialog {
  activities: ActivityTimesheet[];
  activityForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl('')
  });
  constructor(
    private activityService: ActivityTimesheetService,
    public dialogRef: MatDialogRef<activityCreationdialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: IActivityTimesheet
  ) {}
  ngOnInit() {}
  onsubmit(): void {
    let activityEntry: ActivityTimesheet;
    activityEntry = new ActivityTimesheet();
    activityEntry.name = this.activityForm.value.name;
    activityEntry.description = this.activityForm.value.description;
    //  roleEntry.activities = this.rolemappingForm.value.activitiesform;
    console.log(this.activityForm.value);
    this.dialogRef.close();
    this.activityService.create(activityEntry).subscribe(res => {
      if (res.ok) {
        // TODO add res.body to the table
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'dialog-rolecreation',
  templateUrl: 'activity-role-dialog.html'
})
export class activityroledialog {
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
    public dialogRef: MatDialogRef<activityroledialog>,
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
    //  roleEntry.activities = this.rolemappingForm.value.activitiesform;
    console.log(this.rolemappingForm.value);
    this.dialogRef.close();
    this.roleService.create(roleEntry).subscribe(res => {
      if (res.ok) {
        // TODO add res.body to the table
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
