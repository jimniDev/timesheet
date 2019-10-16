import { Injectable, ComponentFactoryResolver, Injector } from '@angular/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { IWorkingEntryTimesheet } from '../model/working-entry-timesheet.model';
import { TableGeneratorComponent } from './table-generator/table-generator.component';
import { loadOptions } from '@babel/core';

@Injectable()
export class PdfService {
  constructor(private resolver: ComponentFactoryResolver, private injector: Injector) {}

  public createPDF(workingEntries: IWorkingEntryTimesheet[]): void {
    const rows = workingEntries.map(we => [
      we.workDay.date.format('YYYY-MM-DD'),
      we.start.format('HH:mm'),
      we.end.format('HH:mm'),
      this.secondsToHHMM(we.end.diff(we.start, 'seconds', true)),
      we.activity ? we.activity.name : ''
    ]);
    const doc = new jsPDF();
    const logo = new Image();
    logo.src = '../../content/images/logo.jpg';
    const pageContent = function(data: { settings: { margin: { left: 5 } } }) {
      if (logo) {
        doc.addImage(logo, 'JPG', data.settings.margin.left, 0, 10, 15);
      }
    };
    doc.autoTable({
      head: [['Date', 'From', 'To', 'Worktime', 'Activity']],
      body: rows,
      theme: 'grid',
      didDrawPage: pageContent
    });
    doc.save('timesheet.pdf');
  }
  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }

  secondsToHHMM(seconds: number): string {
    const hour = Math.round(seconds / 3600);
    const min = Math.round((seconds % 3600) / 60);
    return this.pad(hour, 2) + 'h ' + this.pad(min, 2) + 'm';
  }
}
