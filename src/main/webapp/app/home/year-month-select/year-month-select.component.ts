import { Component, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { MatSelectChange } from '@angular/material/select';

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

  years = Array.from(Array(20), (e, i) => (i + 2019).toString());
  months = Array.from(Array(12), (e, i) => (i + 1).toString());
  selectedYear: string = moment()
    .year()
    .toString();
  selectedMonth: string = (moment().month() + 1).toString();
  resetButtonDisabled = true;

  constructor() {}

  ngOnInit() {}

  onChangeYear(year: MatSelectChange) {
    if (year.value) {
      this.resetButtonDisabled = false;
      this.selectedYear = year.value;
      this.selectedDate.emit(<YearMonth>{ year: this.selectedYear, month: this.selectedMonth });
    }
  }

  onChangeMonth(month: MatSelectChange) {
    if (month.value) {
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
