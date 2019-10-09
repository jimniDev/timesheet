import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet/activity-timesheet.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'jhi-activity-edit-dialog',
  templateUrl: './activity-edit-dialog.component.html',
  styleUrls: ['./activity-edit-dialog.component.scss']
})
export class ActivityEditDialogComponent implements OnInit {
  activityEditForm = new FormGroup({
    name: new FormControl(this.data.name),
    description: new FormControl(this.data.description),
    absence: new FormControl(this.data.absence),
    fillday: new FormControl(this.data.fillday),
    reduce: new FormControl(this.data.reduce)
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ActivityEditDialogComponent>,
    private activityService: ActivityTimesheetService
  ) {}

  ngOnInit() {}

  updateActivity(): void {
    this.data.activity.name = this.activityEditForm.value.name;
    this.data.activity.description = this.activityEditForm.value.description;
    this.data.activity.absence = this.activityEditForm.value.absence;
    this.data.activity.fillDay = this.activityEditForm.value.fillday;
    this.data.activity.reduce = this.activityEditForm.value.reduce;

    this.activityService.update(this.data.activity).subscribe(res => {
      if (res.ok) {
        // TODO add res.body to the table
      }
      this.dialogRef.close();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
