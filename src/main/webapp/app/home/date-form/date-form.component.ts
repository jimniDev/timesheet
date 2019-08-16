import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { ActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { WorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';
import { LocationTimesheet } from 'app/shared/model/location-timesheet.model';
import { stringLiteral } from '@babel/types';
import moment = require('moment');

@Component({
  selector: 'jhi-date-form',
  templateUrl: './date-form.component.html',
  styleUrls: ['./date-form.component.scss']
})
export class DateFormComponent implements OnInit {
  //roles: string[];
  datepic: NgbDateStruct;

  startHour = { hour: 13 };
  startMin = { minute: 30 };
  endHour = { hour: 13 };
  endMin = { minute: 30 };

  timeForm = new FormGroup({
    date: new FormControl('', Validators.required),
    startHour: new FormControl('', Validators.required),
    startMin: new FormControl('', Validators.required),
    endHour: new FormControl('', Validators.required),
    endMin: new FormControl('', Validators.required),
    roleControl: new FormControl(''),
    activityControl: new FormControl('')
  });

  constructor(private calendar: NgbCalendar) {}

  ngOnInit() {}

  makeMoment() {}

  onSubmit() {
    this.timeForm.value;
    const test = 'test';

    let startTimeString: string;
    let endTimeString: string;

    startTimeString = this.timeForm.value.date._i + ' ' + this.timeForm.value.startHour + ':' + this.timeForm.value.startMin;
    endTimeString = this.timeForm.value.date._i + ' ' + this.timeForm.value.endHour + ':' + this.timeForm.value.endMin;
    let startMoment = moment(startTimeString);
    let endMoment = moment(endTimeString);

    let workingEntry: WorkingEntryTimesheet;
    workingEntry = new WorkingEntryTimesheet();
    (workingEntry.start = startMoment), (workingEntry.end = endMoment);
    //workingEntry.activity = <ActivityTimesheet> this.timeForm.get(['activityControl']).value;
    //workingEntry.workDay = <WorkDayTimesheet> this.editForm.get(['workDay']).value;
    //workingEntry.location = <LocationTimesheet> this.editForm.get(['location']).value;
  }
}
//@media only screen and (max-width: 880px), (min-device-width: 768px) and (max-device-width: 1024px) {
