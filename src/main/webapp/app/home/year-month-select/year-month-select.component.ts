import { Component, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'jhi-year-month-select',
  templateUrl: './year-month-select.component.html',
  styleUrls: ['./year-month-select.component.scss']
})
export class YearMonthSelectComponent implements OnInit {
  @Output() selectedDate = new EventEmitter<Moment>();

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
      this.selectedDate.emit(moment(this.selectedYear + '-' + this.selectedMonth + '-01', 'YYYY-MM-DD'));
    } else {
      this.selectedDate.emit(null);
    }
  }

  onChangeMonth(month: MatSelectChange) {
    if (month.value) {
      this.resetButtonDisabled = false;
      this.selectedMonth = month.value;
      this.selectedDate.emit(moment(this.selectedYear + '-' + this.selectedMonth + '-01', 'YYYY-MM-DD'));
    } else {
      this.selectedDate.emit(null);
    }
  }

  // resetFilter(): void {
  //   this.resetButtonDisabled = true;
  //   this.selectedYear = null;
  //   this.selectedMonth = null;
  //   this.selectedDate.emit(null);
  // }
}
