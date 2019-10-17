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
    const employee = workingEntries[0].workDay.employee.user.firstName + ' ' + workingEntries[0].workDay.employee.user.lastName;
    const month = workingEntries[0].workDay.date.format('MMMM');
    logo.src = '../../content/images/logo.jpg';
    const pageContent = function(data: { settings: { margin: { left: 5 } } }) {
      if (logo) {
        doc.addImage(logo, 'JPG', data.settings.margin.left, 5, 30, 20);
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.setFont('courier', 'normal');
        doc.text('Total WorkTime :', data.settings.margin.left, pageHeight - 5);
      }
      // doc.setFontSize('15');
      doc.setFont('courier', 'normal');
      doc.setFontSize('13');
      doc.text(`Employee Name : ${employee}  Month : ${month}`, data.settings.margin.left + 30, 25);
    };
    doc.autoTable({
      head: [['Date', 'From', 'To', 'Worktime', 'Activity']],
      body: rows,
      theme: 'grid',
      didDrawPage: pageContent,
      margin: { top: 27 }
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
