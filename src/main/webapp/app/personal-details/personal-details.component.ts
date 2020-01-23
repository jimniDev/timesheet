import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { AccountService } from 'app/core';
import { IBalanceHash, EmployeeTimesheetService } from 'app/entities/employee-timesheet';
@Component({
  selector: 'jhi-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
  public selectedYear = moment().year();
  public monthlyBalanceSource = new MatTableDataSource<IBalanceHash>();
  public yearlyBalance = 0;
  public years = Array.from(Array(20), (e, i) => i + 2019);

  yearForm = new FormGroup({
    yearSelect: new FormControl(this.selectedYear)
  });

  constructor(private employeeService: EmployeeTimesheetService, private accountService: AccountService) {}

  ngOnInit() {
    this.loadBalanceTable(this.selectedYear);
    this.yearForm.get('yearSelect').valueChanges.subscribe(value => {
      this.onChangeYear(value);
    });
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  onChangeYear(year) {
    if (year) {
      this.selectedYear = year;
      this.loadBalanceTable(this.selectedYear);
    }
  }

  loadBalanceTable(year) {
    this.yearlyBalance = 0;
    this.employeeService.balanceByYear(year).subscribe(res => {
      if (res) {
        const balanceArr = Object.keys(res.body).map(key => ({ month: key, balance: res.body[key] }));
        console.log(balanceArr);
        this.monthlyBalanceSource.data = balanceArr;
        balanceArr.forEach(data => (this.yearlyBalance += data.balance));
      }
    });
  }

  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }

  minutesToHHMM(mins: number): string {
    if (mins >= 0) {
      const hour = Math.floor(mins / 60);
      const min = Math.floor(mins % 60);
      return this.pad(hour, 2) + 'h ' + this.pad(min, 2) + 'm';
    } else {
      const hour = Math.ceil(mins / 60);
      const min = Math.ceil(mins % 60);
      return '-' + this.pad(Math.abs(hour), 2) + 'h ' + this.pad(Math.abs(min), 2) + 'm';
    }
  }
}
