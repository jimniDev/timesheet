import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-date-form',
  templateUrl: './date-form.component.html',
  styleUrls: ['./date-form.component.scss']
})
export class DateFormComponent implements OnInit {
  //roles: string[];
  // model: NgbDateStruct;
  // date: {year: number, month: number};
  model;

  timeForm = new FormGroup({
    startTime: new FormControl('', Validators.required),
    endTime: new FormControl('', Validators.required),
    roleControl: new FormControl(''),
    activityControl: new FormControl('')
  });

  constructor(private calendar: NgbCalendar) {}

  ngOnInit() {}

  onSubmit() {}

  selectToday() {
    this.model = this.calendar.getToday();
  }
}
