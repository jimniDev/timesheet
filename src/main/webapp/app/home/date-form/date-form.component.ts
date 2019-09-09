import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { NgbDateStruct, NgbCalendar, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { ActivityTimesheet, IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { WorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';
import { LocationTimesheet } from 'app/shared/model/location-timesheet.model';
import { stringLiteral, thisTypeAnnotation } from '@babel/types';
import { Moment } from 'moment';
import * as moment from 'moment';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet';
import { RoleTimesheetService } from 'app/entities/role-timesheet';
import { HttpResponse } from '@angular/common/http';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';

@Component({
  selector: 'jhi-date-form',
  templateUrl: './date-form.component.html',
  styleUrls: ['./date-form.component.scss'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class DateFormComponent implements OnInit {
  //roles: string[];
  datepic: NgbDateStruct;

  @Output() newWorkingEntry = new EventEmitter<WorkingEntryTimesheet>();
  @Output() saved = new EventEmitter<boolean>();

  timeForm = new FormGroup({
    date: new FormControl('', Validators.required),
    startTime: new FormControl(''),
    endTime: new FormControl(''),
    roleControl: new FormControl('', Validators.required),
    activityControl: new FormControl('', Validators.required)
  });

  activities: IActivityTimesheet[];
  roles: IRoleTimesheet[];
  selectableActivities: IActivityTimesheet[];

  constructor(
    private calendar: NgbCalendar,
    private workingEntryService: WorkingEntryTimesheetService,
    private activityService: ActivityTimesheetService,
    private roleService: RoleTimesheetService
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
    this.timeForm.value;
    let startTimeString: string;
    let endTimeString: string;
    const workDay: WorkDayTimesheet = new WorkDayTimesheet();
    let activity: ActivityTimesheet = new ActivityTimesheet();

    const formDate = moment(this.timeForm.value.date);
    workDay.date = formDate;

    startTimeString = formDate.format('YYYY-MM-DD') + ' ' + this.timeForm.value.startTime;
    endTimeString = formDate.format('YYYY-MM-DD') + ' ' + this.timeForm.value.endTime;
    let startMoment = moment(startTimeString);
    let endMoment = moment(endTimeString);

    this.activities.forEach(a => {
      if (a.id == this.timeForm.value.activityControl.id) {
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

    this.workingEntryService.create(workingEntry).subscribe(res => {
      if (res.ok) {
        this.newWorkingEntry.emit(res.body);
        this.saved.emit(true);
      }
    });
  }

  onChangeRole(role: IRoleTimesheet) {
    if (role) {
      this.selectableActivities = role.activities;
    }
  }
}
