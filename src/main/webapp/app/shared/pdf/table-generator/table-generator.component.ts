import { Component, OnInit, ElementRef } from '@angular/core';
import { AsRowSpanService } from 'app/as-layouts/as-table/as-row-span.service';
import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';

@Component({
  selector: 'jhi-table-generator',
  templateUrl: './table-generator.component.html',
  styleUrls: ['./table-generator.component.scss']
})
export class TableGeneratorComponent implements OnInit {
  workingEntries: IWorkingEntryTimesheet[];

  displayedColumns = ['workDay.date', 'Total Worktime', 'Break Time', 'start', 'end', 'Sum', 'Activity'];

  constructor(public asRowSpan: AsRowSpanService, public elRef: ElementRef) {}

  ngOnInit() {}

  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }

  secondsToHHMM(seconds: number): string {
    const hour = Math.floor(seconds / 3600);
    const min = Math.floor((seconds % 3600) / 60);
    return this.pad(hour, 2) + 'h ' + this.pad(min, 2) + 'm';
  }

  sumDate(date1: any, date2: any): String {
    if (date2 > date1) {
      const sum = Math.abs((date1 - date2) / 1000);
      const hour = Math.floor(sum / 3600);
      const min = Math.floor((sum % 3600) / 60);
      return this.pad(hour, 2) + 'h ' + this.pad(min, 2) + 'm';
    } else {
      return null;
    }
  }
}
