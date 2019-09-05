import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { NgbDateStruct, NgbCalendar, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { ActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { WorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';
import { LocationTimesheet } from 'app/shared/model/location-timesheet.model';
import { stringLiteral } from '@babel/types';
import { Moment } from 'moment';
import * as moment from 'moment';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';

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
    roleControl: new FormControl(''),
    activityControl: new FormControl('')
  });

  constructor(private calendar: NgbCalendar, private workingEntryService: WorkingEntryTimesheetService) {}

  ngOnInit() {}

  get today() {
    return new Date();
  }

  onSubmit() {
    this.timeForm.value;
    let startTimeString: string;
    let endTimeString: string;
    const workDay: WorkDayTimesheet = new WorkDayTimesheet();

    const formDate = moment(this.timeForm.value.date);
    workDay.date = formDate;

    startTimeString = formDate.format('YYYY-MM-DD') + ' ' + this.timeForm.value.startTime;
    endTimeString = formDate.format('YYYY-MM-DD') + ' ' + this.timeForm.value.endTime;
    let startMoment = moment(startTimeString);
    let endMoment = moment(endTimeString);

    let workingEntry: WorkingEntryTimesheet;
    workingEntry = new WorkingEntryTimesheet();
    workingEntry.start = startMoment;
    workingEntry.end = endMoment;
    workingEntry.workDay = workDay;
    workingEntry.deleted = false;

    this.workingEntryService.create(workingEntry).subscribe(res => {
      if (res.ok) {
        this.newWorkingEntry.emit(res.body);
        this.saved.emit(true);
      }
    });
  }
}
