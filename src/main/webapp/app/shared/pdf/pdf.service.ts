import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { IWorkingEntryTimesheet } from '../model/working-entry-timesheet.model';
import { Moment } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() {}

  public createPDF(workingEntries: IWorkingEntryTimesheet[]): void {
    let rows = workingEntries.map(we => [
      we.workDay.date.format('YYYY-MM-DD'),
      we.start.format('HH:mm'),
      we.end.format('HH:mm'),
      this.secondsToHHMM(we.end.diff(we.start, 'seconds', true)),
      we.activity ? we.activity.name : ''
    ]);
    let doc = new jsPDF();
    doc.autoTable({
      head: [['Date', 'From', 'To', 'Worktime', 'Activity']],
      body: rows
    });
    doc.save('timesheet.pdf');
  }

  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }

  secondsToHHMM(seconds: number): string {
    const hour = Math.round(seconds / 3600);
    const min = Math.round((seconds % 3600) / 60);
    return this.pad(hour, 2) + 'h ' + this.pad(min, 2) + 'm';
  }
}
