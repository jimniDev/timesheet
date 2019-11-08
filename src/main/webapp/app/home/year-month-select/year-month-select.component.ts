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
    yearForm: new FormControl(this.changeYear, Validators.required),
    monthForm: new FormControl(this.changeMonth, Validators.required)
  });

  constructor() {}

  ngOnInit() {
    this.yearMonthForm.get('yearForm').valueChanges.subscribe(value => {
      this.onChangeYear(value);
    });
    this.yearMonthForm.get('monthForm').valueChanges.subscribe(value => {
      this.onChangeMonth(value);
    });
  }

  onChangeYear(year: MatSelectChange) {
    if (year.value || year) {
      this.resetButtonDisabled = false;
      this.selectedYear = year.value;
      this.selectedDate.emit(<YearMonth>{ year: this.selectedYear, month: this.selectedMonth });
    }
  }

  onChangeMonth(month: MatSelectChange) {
    if (month.value || month) {
      this.resetButtonDisabled = false;
      this.selectedMonth = month.value;
      this.selectedDate.emit(<YearMonth>{ year: this.selectedYear, month: this.selectedMonth });
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
