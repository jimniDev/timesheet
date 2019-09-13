import { Component, OnInit, Inject } from '@angular/core';
import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { IActivityTimesheet, ActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet/activity-timesheet.service';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { WorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';

@Component({
  selector: 'jhi-timetable-edit-dialog',
  templateUrl: './timetable-edit-dialog.component.html',
  styleUrls: ['./timetable-edit-dialog.component.scss']
})
export class TimetableEditDialogComponent implements OnInit {
  activities: IActivityTimesheet[];

  workingEntry: IWorkingEntryTimesheet;

  workingeditForm = new FormGroup({
    date: new FormControl(this.data.workDay.date.format('YYYY-MM-DD'), Validators.required),
    starttime: new FormControl(this.data.start.format('HH:mm')),
    endtime: new FormControl(this.data.end.format('HH:mm')),
    activity: new FormControl(this.data.activity, Validators.required)
  });

  selectableActivities: IActivityTimesheet[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IWorkingEntryTimesheet,
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
  }

  today() {
    return new Date();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateEntry(): void {
    let startTimeString: string;
    let endTimeString: string;
    const workDay: WorkDayTimesheet = new WorkDayTimesheet();
    // const activity: ActivityTimesheet = new ActivityTimesheet();
    const formDate = moment(this.workingeditForm.value.date);
    workDay.date = formDate;
    const start_time = this.workingeditForm.value.starttime;
    const end_time = this.workingeditForm.value.endtime;
    startTimeString = formDate.format('YYYY-MM-DD') + ' ' + start_time;
    endTimeString = formDate.format('YYYY-MM-DD') + ' ' + end_time;
    const startMoment = moment(startTimeString);
    const endMoment = moment(endTimeString);

    this.data.start = startMoment;
    this.data.end = endMoment;
    this.data.workDay = workDay;
    this.data.deleted = false;
    this.data.activity = this.workingeditForm.value.activity;
    this.workingService.update(this.data).subscribe(res => {
      if (res.ok) {
        this.dialogRef.close(res.body);
      }
    });
  }
}
