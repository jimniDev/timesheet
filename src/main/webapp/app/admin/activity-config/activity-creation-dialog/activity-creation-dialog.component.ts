import { Component, Inject } from '@angular/core';
import { ActivityTimesheet, IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dialog-activitycreation',
  templateUrl: 'activity-creation-dialog.component.html',
  styleUrls: ['activity-creation-dialog.component.scss']
})
export class ActivityCreationDialogComponent {
  activities: ActivityTimesheet[];

  checked = false;

  checkedfillday = false;

  activityForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    absence: new FormControl(''),
    fillday: new FormControl(''),
    reduce: new FormControl('')
  });

  constructor(
    private activityService: ActivityTimesheetService,
    public dialogRef: MatDialogRef<ActivityCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IActivityTimesheet
  ) {
    this.activityForm.patchValue({ absence: false, fillday: false });
  }

  onsubmit(): void {
    const activityEntry: ActivityTimesheet = new ActivityTimesheet();
    activityEntry.name = this.activityForm.value.name;
    activityEntry.description = this.activityForm.value.description;
    activityEntry.absence = this.activityForm.value.absence;
    activityEntry.fillDay = this.activityForm.value.fillday;
    this.activityService.create(activityEntry).subscribe(res => {
      if (res.ok) {
        this.dialogRef.close(<IActivityTimesheet>res.body);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
