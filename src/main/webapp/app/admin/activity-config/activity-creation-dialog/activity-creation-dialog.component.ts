import { Component, Inject } from '@angular/core';
import { ActivityTimesheet, IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'dialog-activitycreation',
  templateUrl: 'activity-creation-dialog.component.html',
  styleUrls: ['activity-creation-dialog.component.scss']
})
export class ActivityCreationDialogComponent {
  private activities: ActivityTimesheet[];
  private idx: number;
  private durationInSeconds: number;

  activityCreationForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    absence: new FormControl(''),
    fillday: new FormControl(''),
    reduce: new FormControl('')
  });

  constructor(
    private activityService: ActivityTimesheetService,
    public dialogRef: MatDialogRef<ActivityCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IActivityTimesheet,
    private alertBar: MatSnackBar
  ) {
    this.activityCreationForm.patchValue({ absence: false, fillday: false, reduce: false });
    this.durationInSeconds = 5;
  }

  openAlertBar() {
    this.alertBar.open('An activity with the same name already exists.', 'Cancel', {
      duration: this.durationInSeconds * 1000
    });
  }
  onsubmit(): void {
    const activityEntry: ActivityTimesheet = new ActivityTimesheet();
    activityEntry.name = this.activityCreationForm.value.name;
    activityEntry.description = this.activityCreationForm.value.description;
    activityEntry.absence = this.activityCreationForm.value.absence;
    activityEntry.fillDay = this.activityCreationForm.value.fillday;
    activityEntry.reduce = this.activityCreationForm.value.reduce;

    this.activityService.query().subscribe((res: HttpResponse<ActivityTimesheet[]>) => {
      if (res.ok) {
        this.activities = res.body;
        this.idx = this.activities.findIndex(r => r.name === activityEntry.name);
        if (this.idx !== -1) {
          this.dialogRef.close();
          this.openAlertBar();
        } else {
          this.createEntry(activityEntry);
        }
      }
    });
  }

  createEntry(activityEntry: IActivityTimesheet): void {
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
