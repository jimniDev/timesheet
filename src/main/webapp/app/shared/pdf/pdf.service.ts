import { Injectable, ComponentFactoryResolver, Injector } from '@angular/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { IWorkingEntryTimesheet } from '../model/working-entry-timesheet.model';
import { TableGeneratorComponent } from './table-generator/table-generator.component';
import { loadOptions } from '@babel/core';
import { IWorkDayTimesheet } from '../model/work-day-timesheet.model';

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

    //   const pageContent = (data: { settings: { margin: { left: 5 } } }) => {

    //   doc.addFont('../../content/fonts/unineue-heavy-webfont.ttf', 'unineue-heavy', 'normal');
    //     doc.addFont('../../content/fonts/unineue-regular-webfont.ttf', 'unineue-regular', 'normal');

    doc.autoTable({
      head: [['Date', 'From', 'To', 'Worktime', 'Activity']],
      body: rows,
      theme: 'grid',
      didDrawPage: (autoTableData: any) => this.createPage(doc, workingEntries, autoTableData),
      margin: { top: 27 }
    });
    doc.save('timesheet.pdf');
  }

  createPage(doc: jsPDF, workingEntries: IWorkingEntryTimesheet[], data: any): void {
    const logo = new Image();
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    logo.src = '../../content/images/logo.jpg';
    if (logo) {
      doc.addImage(logo, 'JPG', data.settings.margin.left + 150, pageHeight - 27, 24, 10);
    }
    const employee = workingEntries[0].workDay.employee.user.firstName + ' ' + workingEntries[0].workDay.employee.user.lastName;
    const month = workingEntries[0].workDay.date.format('MMMM');
    const totalWorkTime = this.totalWorkTime(workingEntries);

    doc.setFontSize('13');
    // doc.setFont('unineue-regular', 'normal');
    doc.setLineWidth(0.7);
    doc.setDrawColor(16, 24, 32);
    doc.line(data.settings.margin.left - 3, pageHeight - 25, data.settings.margin.left + 40, pageHeight - 25);
    doc.text('Signature', data.settings.margin.left + 7, pageHeight - 20);
    doc.text(`Total WorkTime :${totalWorkTime}`, data.settings.margin.left + 60, pageHeight - 20);

    // doc.setFontSize('15');
    // doc.setFont('unineue-regular', 'normal');
    doc.setFontSize('13');
    doc.text(`Employee : ${employee}  Month : ${month}`, data.settings.margin.left, 25);
  }

  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }

  totalWorkTime(data: IWorkingEntryTimesheet[]): string {
    let tempWorkTime = 0;
    // let hours = 0;
    // let minutes = 0;
    const length = data.length;
    let i = 0;
    for (i = 0; i < length; i++) {
      tempWorkTime = tempWorkTime + data[i].end.diff(data[i].start, 'seconds', true);
    }
    return this.secondsToHHMM(tempWorkTime);
  }

  secondsToHHMM(seconds: number): string {
    // const hour = Math.round(seconds / 3600);
    const hour = Math.floor(seconds / 3600);
    const min = Math.round((seconds % 3600) / 60);
    return this.pad(hour, 2) + 'h ' + this.pad(min, 2) + 'm';
  }
}
