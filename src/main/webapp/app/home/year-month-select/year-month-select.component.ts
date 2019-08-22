import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'jhi-year-month-select',
  templateUrl: './year-month-select.component.html',
  styleUrls: ['./year-month-select.component.scss']
})
export class YearMonthSelectComponent implements OnInit, OnChanges {
  @Input() dates: Moment[] = new Array<Moment>();
  @Output() selectedDate = new EventEmitter<Moment>();

  distinctMonthsOfYear: string[] = new Array<string>();
  selectedYear: string;
  selectedMonth: string;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {}

  onChangeYear(year: string) {
    this.selectedYear = year;
    this.selectedMonth = this.getDistinctMonthsFromYear()[0];
    this.selectedDate.emit(moment(this.selectedYear + '-' + this.selectedMonth + '-01'));
  }

  onChangeMonth(month: string) {
    this.selectedMonth = month;
    this.selectedDate.emit(moment(this.selectedYear + '-' + this.selectedMonth + '-01'));
  }

  getDistinctYears(): string[] {
    let years: string[] = new Array<string>();
    this.dates.forEach(date => {
      let yearContained: boolean = false;
      years.forEach(year => {
        if (year === date.format('YYYY')) {
          yearContained = true;
        }
      });
      if (!yearContained) {
        years.push(date.format('YYYY'));
      }
    });
    return years;
  }

  getDistinctMonthsFromYear() {
    let months: string[] = new Array<string>();
    this.dates
      .filter(date => date.format('YYYY') === this.selectedYear)
      .forEach(date => {
        let monthContained: boolean = false;
        months.forEach(month => {
          if (month === date.format('MM')) {
            monthContained = true;
          }
        });
        if (!monthContained) {
          months.push(date.format('MM'));
        }
      });
    return months;
  }
}
