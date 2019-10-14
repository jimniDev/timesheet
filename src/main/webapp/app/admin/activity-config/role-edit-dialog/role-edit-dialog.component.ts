import { Component, OnInit, Inject } from '@angular/core';
import { IRoleTimesheet, RoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { FormGroup, FormControl } from '@angular/forms';
import { RoleTimesheetService } from 'app/entities/role-timesheet';

@Component({
  selector: 'jhi-role-edit-dialog',
  templateUrl: './role-edit-dialog.component.html',
  styleUrls: ['./role-edit-dialog.component.scss']
})
export class RoleEditDialogComponent implements OnInit {
  roleEditForm = new FormGroup({
    name: new FormControl(this.data.name),
    description: new FormControl(this.data.description)
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleTimesheetService,
    public dialogRef: MatDialogRef<RoleEditDialogComponent>
  ) {}

  ngOnInit() {}

  updateRole(): void {
    this.data.role.name = this.roleEditForm.value.name;
    this.data.role.description = this.roleEditForm.value.description;

    this.roleService.update(this.data.role).subscribe(res => {
      if (res.ok) {
        // TODO add res.body to the table
        this.dialogRef.close(res.body);
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
