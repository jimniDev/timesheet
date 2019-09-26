import { Component, OnInit, Inject } from '@angular/core';
import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { IActivityTimesheet, ActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet/activity-timesheet.service';
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { MatSnackBar, MAT_DATE_FORMATS } from '@angular/material';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';

export const MY_FORMAT = {
  parse: {
    dateInput: 'DD.MM.YYYY'
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MM.YYYY',
    dateA11yLabel: 'DD.MM.YYYY',
    monthYearA11yLabel: 'MM.YYYY'
  }
};

@Component({
  selector: 'jhi-timetable-edit-dialog',
  templateUrl: './timetable-edit-dialog.component.html',
  styleUrls: ['./timetable-edit-dialog.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMAT }]
})
export class TimetableEditDialogComponent implements OnInit {
  activities: IActivityTimesheet[];
  roles: IRoleTimesheet[];
  selectableActivities: IActivityTimesheet[];
  workingEntry: IWorkingEntryTimesheet;
  workingeditForm = new FormGroup({
    date: new FormControl('', Validators.required),
    starttime: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^([01][0-9]|2[0-3]):([0-5][0-9])$')])),
    endtime: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^([01][0-9]|2[0-3]):([0-5][0-9])$')])),
    roleControl: new FormControl(''),
    activity: new FormControl(this.workingEntryData.activity, Validators.required)
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public workingEntryData: IWorkingEntryTimesheet,
    public dialogRef: MatDialogRef<TimetableEditDialogComponent>,
    private workingService: WorkingEntryTimesheetService,
    private activityService: ActivityTimesheetService,
    private roleService: RoleTimesheetService,
    private _snackBar: MatSnackBar
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
        this.selectableActivities = this.activities;
      }
    });
    this.workingeditForm.patchValue({
      date: this.workingEntryData.workDay.date,
      starttime: this.workingEntryData.start ? this.workingEntryData.start.format('HH:mm') : '',
      endtime: this.workingEntryData.end ? this.workingEntryData.end.format('HH:mm') : '',
      activity: this.workingEntryData.activity
    });
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

    if (this.workingEntryData.start >= this.workingEntryData.end) {
      this._snackBar.open('Please check End Time again', 'Close', {
        duration: 5000
      });
    } else {
      this.workingEntryData.workDay.date = moment(this.workingeditForm.value.date);
      this.workingEntryData.deleted = false;
      this.workingEntryData.activity = this.workingeditForm.value.activity;
      this.workingService.update(this.workingEntryData).subscribe(res => {
        if (res.ok) {
          this.dialogRef.close(res.body);
        }
      });
    }
  }

  compareObjects(o1: IActivityTimesheet, o2: IActivityTimesheet): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  onChangeRole(role: IRoleTimesheet) {
    if (role) {
      this.selectableActivities = role.activities;
    }
  }
}
