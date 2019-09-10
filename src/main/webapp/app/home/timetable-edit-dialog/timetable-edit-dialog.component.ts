import { Component, OnInit, Inject } from '@angular/core';
import { IWorkingEntryTimesheet, WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { TimetableComponent } from 'app/home/timetable/timetable.component';
import { NgbDateStruct, NgbCalendar, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet/activity-timesheet.service';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'jhi-timetable-edit-dialog',
  templateUrl: './timetable-edit-dialog.component.html',
  styleUrls: ['./timetable-edit-dialog.component.scss']
})
export class TimetableEditDialogComponent implements OnInit {
  datepic: NgbDateStruct;
  activities: IActivityTimesheet[];
  workingEntry: IWorkingEntryTimesheet;
  workingeditForm = new FormGroup({
    date: new FormControl(this.data.entry.date),
    starttime: new FormControl(this.data.entry.start),
    endtime: new FormControl(this.data.entry.end),
    activity: new FormControl(this.data.entry.activity)
  });
  selectableActivities: IActivityTimesheet[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
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
  get today() {
    return new Date();
  }
  updateEntry(): void {
    // this.data.workingent.name = this.workingeditForm.value.name;
    // this.data.role.description = this.workingeditForm.value.description;
    // // this.roleService.update(this.data.role);
    this.workingEntry = this.data.entry;
    this.workingService.update(this.workingEntry).subscribe(res => {
      if (res.ok) {
        // TODO add res.body to the table
        this.dialogRef.close();
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
