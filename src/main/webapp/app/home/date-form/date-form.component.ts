import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { ActivityTimesheet, IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { WorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';
import * as moment from 'moment';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { HttpResponse } from '@angular/common/http';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'jhi-date-form',
  templateUrl: './date-form.component.html',
  styleUrls: ['./date-form.component.scss']
})
export class DateFormComponent implements OnInit {
  // roles: string[];

  @Output() newWorkingEntry = new EventEmitter<WorkingEntryTimesheet>();
  @Output() saved = new EventEmitter<boolean>();

  timeForm = new FormGroup({
    date: new FormControl('', Validators.required),
    startTime: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^([01][0-9]|2[0-3]):([0-5][0-9])$')])),
    endTime: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^([01][0-9]|2[0-3]):([0-5][0-9])$')])),
    roleControl: new FormControl('', Validators.required),
    activityControl: new FormControl('', Validators.required)
  });

  activities: IActivityTimesheet[];
  roles: IRoleTimesheet[];
  selectableActivities: IActivityTimesheet[];

  constructor(
    private workingEntryService: WorkingEntryTimesheetService,
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
  }

  get today() {
    return new Date();
  }

  onSubmit() {
    let startTimeString: string;
    let endTimeString: string;
    const workDay: WorkDayTimesheet = new WorkDayTimesheet();
    let activity: ActivityTimesheet = new ActivityTimesheet();

    // const formDate = moment.utc(this.timeForm.value.date);
    // const formDate = moment(moment.utc(this.timeForm.value.date).startOf('day').format('LL')).startOf('day').toDate();
    const formDate = moment(this.timeForm.value.date).add(2, 'hours');

    workDay.date = formDate;

    startTimeString = formDate.format('YYYY-MM-DD') + ' ' + this.timeForm.value.startTime;
    endTimeString = formDate.format('YYYY-MM-DD') + ' ' + this.timeForm.value.endTime;
    const startMoment = moment(startTimeString);
    const endMoment = moment(endTimeString);

    if (startMoment >= endMoment) {
      this._snackBar.open('Please check End Time again', 'close', {
        duration: 5000
      });
    } else {
      this.activities.forEach(a => {
        if (a.id === this.timeForm.value.activityControl.id) {
          activity = a;
        }
      });

      let workingEntry: WorkingEntryTimesheet;
      workingEntry = new WorkingEntryTimesheet();
      workingEntry.start = startMoment;
      workingEntry.end = endMoment;
      workingEntry.workDay = workDay;
      workingEntry.deleted = false;
      workingEntry.activity = activity;

      this.workingEntryService.create(workingEntry).subscribe(
        res => {
          if (res.ok) {
            this.newWorkingEntry.emit(res.body);
            this.saved.emit(true);
            // 400 else error
          }
        },
        err => {
          if (err.error.errorKey === 'overlappingtime') {
            // then show the snackbar.
            this._snackBar.open('Time Entry is overlapped', 'Close', {
              duration: 5000
            });
          }
        }
      );
    }
  }

  onChangeRole(role: IRoleTimesheet) {
    if (role) {
      this.selectableActivities = role.activities;
    }
  }
}
