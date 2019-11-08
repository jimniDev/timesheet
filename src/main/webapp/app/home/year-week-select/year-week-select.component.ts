import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatSelectChange } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface YearWeek {
  year: string;
  week: string;
}

@Component({
  selector: 'jhi-year-week-select',
  templateUrl: './year-week-select.component.html',
  styleUrls: ['./year-week-select.component.scss']
})
export class YearWeekSelectComponent implements OnInit {
  @Output() selectedDate = new EventEmitter<YearWeek>();
  @Input() changeYear: string = moment()
    .year()
    .toString();
  @Input() changeWeek: string = moment()
    .isoWeek()
    .toString();

  selectedYear: string = moment()
    .year()
    .toString();

  years = Array.from(Array(20), (e, i) => (i + 2019).toString());

  weeks = Array.from(Array(moment(this.selectedYear + '-12-28', 'YYYY-MM-DD').isoWeek()), (e, i) => (i + 1).toString());
  selectedMonth: string = (moment().month() + 1).toString();
  selectedWeek: string = moment()
    .isoWeek()
    .toString();
  resetButtonDisabled = true;

  yearWeekForm = new FormGroup({
    yearForm: new FormControl(this.changeYear, Validators.required),
    weekForm: new FormControl(this.changeWeek, Validators.required)
  });

  constructor() {
    this.yearWeekForm.get('yearForm').valueChanges.subscribe(value => {
      this.onChangeYear(value);
    });
    this.yearWeekForm.get('weekForm').valueChanges.subscribe(value => {
      this.onChangeWeek(value);
    });
  }

  ngOnInit() {}

  onChangeYear(year: MatSelectChange) {
    if (year.value) {
      this.resetButtonDisabled = false;
      this.selectedYear = year.value;
      this.weeks = Array.from(Array(moment(this.selectedYear + '-12-28', 'YYYY-MM-DD').isoWeek()), (e, i) => (i + 1).toString());
      this.selectedDate.emit(<YearWeek>{ year: this.selectedYear, week: this.selectedWeek });
    } else {
      this.selectedDate.emit(null);
    }
  }

  onChangeWeek(week: MatSelectChange) {
    if (week.value) {
      this.resetButtonDisabled = false;
      this.selectedWeek = week.value;
      this.selectedDate.emit(<YearWeek>{ year: this.selectedYear, week: this.selectedWeek });
    } else {
      this.selectedDate.emit(null);
    }
  }

  resetFilter(): void {
    this.resetButtonDisabled = true;
    this.selectedYear = moment()
      .year()
      .toString();
    this.selectedMonth = (moment().month() + 1).toString();
    this.selectedWeek = moment()
      .isoWeek()
      .toString();
    this.selectedDate.emit(<YearWeek>{ year: this.selectedYear, week: this.selectedWeek });
  }
}
