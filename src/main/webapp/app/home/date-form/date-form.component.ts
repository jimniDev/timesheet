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
  model: NgbDateStruct;
  date: { year: number; month: number };

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

  onSubmit() {}
}
//@media only screen and (max-width: 880px), (min-device-width: 768px) and (max-device-width: 1024px) {
