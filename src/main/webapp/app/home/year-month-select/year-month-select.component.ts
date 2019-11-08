import { Component, OnInit, SimpleChanges, Output, EventEmitter, Input } from '@angular/core';
import * as moment from 'moment';
import { MatSelectChange } from '@angular/material/select';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface YearMonth {
  year: string;
  month: string;
}

@Component({
  selector: 'jhi-year-month-select',
  templateUrl: './year-month-select.component.html',
  styleUrls: ['./year-month-select.component.scss']
})
export class YearMonthSelectComponent implements OnInit {
  @Output() selectedDate = new EventEmitter<YearMonth>();
  @Input() changeYear: string = moment()
    .year()
    .toString();
  @Input() changeMonth: string = (moment().month() + 1).toString();

  years = Array.from(Array(20), (e, i) => (i + 2019).toString());
  months = Array.from(Array(12), (e, i) => (i + 1).toString());
  selectedYear: string = moment()
    .year()
    .toString();
  selectedMonth: string = (moment().month() + 1).toString();
  resetButtonDisabled = true;

  yearMonthForm = new FormGroup({
    yearForm: new FormControl(this.changeYear),
    monthForm: new FormControl(this.changeMonth)
  });

  constructor() {}

  ngOnInit() {
    this.changeYear = this.selectedYear;
    this.changeMonth = this.selectedMonth;
    this.yearMonthForm.get('yearForm').valueChanges.subscribe(value => {
      this.onChangeYear(value);
    });
    this.yearMonthForm.get('monthForm').valueChanges.subscribe(value => {
      this.onChangeMonth(value);
    });
  }

  onChangeYear(year) {
    if (year) {
      this.resetButtonDisabled = false;
      this.changeYear = year;
      this.selectedDate.emit(<YearMonth>{ year: this.changeYear, month: this.changeMonth });
    }
  }

  onChangeMonth(month) {
    if (month) {
      this.resetButtonDisabled = false;
      this.changeMonth = month;
      this.selectedDate.emit(<YearMonth>{ year: this.changeYear, month: this.changeMonth });
    }
  }

  resetFilter(): void {
    this.resetButtonDisabled = true;
    this.selectedYear = moment()
      .year()
      .toString();
    this.selectedMonth = (moment().month() + 1).toString();
    this.selectedDate.emit(<YearMonth>{ year: this.selectedYear, month: this.selectedMonth });
  }
}
