import { Component, OnInit, Inject } from '@angular/core';
import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { IActivityTimesheet, ActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet/activity-timesheet.service';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'jhi-timetable-edit-dialog',
  templateUrl: './timetable-edit-dialog.component.html',
  styleUrls: ['./timetable-edit-dialog.component.scss']
})
export class TimetableEditDialogComponent implements OnInit {
  activities: IActivityTimesheet[];

  workingEntry: IWorkingEntryTimesheet;

  workingeditForm = new FormGroup({
    date: new FormControl(this.workingEntryData.workDay.date.format('YYYY-MM-DD'), Validators.required),
    starttime: new FormControl(this.workingEntryData.start.format('HH:mm')),
    endtime: new FormControl(this.workingEntryData.end.format('HH:mm')),
    activity: new FormControl(this.workingEntryData.activity)
  });

  selectableActivities: IActivityTimesheet[];
  selectedActivity: IActivityTimesheet;

  constructor(
    @Inject(MAT_DIALOG_DATA) public workingEntryData: IWorkingEntryTimesheet,
    public dialogRef: MatDialogRef<TimetableEditDialogComponent>,
    private workingService: WorkingEntryTimesheetService,
    private activityService: ActivityTimesheetService
  ) {}

  ngOnInit() {
    this.activityService.query().subscribe((res: HttpResponse<IActivityTimesheet[]>) => {
      if (res.ok) {
        this.activities = res.body;
        this.selectableActivities = this.activities;
      }
    });
    this.selectedActivity = this.workingEntryData.activity;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateEntry(): void {
    this.workingEntryData.start = moment(
      moment(this.workingeditForm.value.date).format('YYYY-MM-DD') + ' ' + this.workingeditForm.value.starttime
    );
    this.workingEntryData.end = moment(
      moment(this.workingeditForm.value.date).format('YYYY-MM-DD') + ' ' + this.workingeditForm.value.endtime
    );
    this.workingEntryData.workDay.date = moment(this.workingeditForm.value.date);
    this.workingEntryData.deleted = false;
    this.workingEntryData.activity = this.workingeditForm.value.activity;
    this.workingService.update(this.workingEntryData).subscribe(res => {
      if (res.ok) {
        this.dialogRef.close(res.body);
      }
    });
  }
  compareObjects(o1: IActivityTimesheet, o2: IActivityTimesheet): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }
}
