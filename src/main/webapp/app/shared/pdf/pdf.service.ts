import { Injectable, ComponentFactoryResolver, Injector } from '@angular/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { IWorkingEntryTimesheet } from '../model/working-entry-timesheet.model';
import { TableGeneratorComponent } from './table-generator/table-generator.component';
import { loadOptions } from '@babel/core';
import { IWorkDayTimesheet } from '../model/work-day-timesheet.model';
import { start } from 'repl';

@Injectable()
export class PdfService {
  constructor(private resolver: ComponentFactoryResolver, private injector: Injector) {}

  public createPDF(workingEntries: IWorkingEntryTimesheet[]): void {
    const raw_data = workingEntries.map(we => [
      we.workDay.date.format('YYYY-MM-DD'),
      we.start.format('HH:mm'),
      we.end.format('HH:mm'),
      this.secondsToHHMM(we.end.diff(we.start, 'seconds', true)),
      we.activity ? we.activity.name : ''
    ]);

    const doc = new jsPDF();
    const rowSpanInformation = this.getRowSpanfromData(raw_data);
    const bodyData = this.dataConversionForRowSpan(workingEntries, raw_data, rowSpanInformation);
    // for (let i = 0; i < raw_data.length; i++) {
    //   let row = raw_data[i];
    //   if (i === 0) { row['0'] = { rowSpan: 5, content: raw_data[0][0], styles: { valign: 'middle', halign: 'center' } }; }
    // }
    doc.autoTable({
      head: this.getColumns(),
      body: bodyData,
      theme: 'grid',
      // createdCell: (data: any) => this.createCells(),
      didDrawPage: (autoTableData: any) => this.createPageHeaderFooter(doc, workingEntries, autoTableData),
      //    didParseCell: (data: any) => { if (data.index === 0) { data({ rowSpan: 5, content: 12, styles: { valign: 'middle', halign: 'center' } }); } },
      margin: { top: 27, bottom: 33 }
    });
    doc.save('timesheet.pdf');
  }
  getColumns() {
    return [{ date: 'Date', from: 'From', to: 'to', worktime: 'Worktime', activity: 'Activity' }];
  }
  createPageHeaderFooter(doc: jsPDF, workingEntries: IWorkingEntryTimesheet[], data: any): void {
    const logo = new Image();
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    logo.src = '../../content/images/logo.jpg';
    const employee = workingEntries[0].workDay.employee.user.firstName + ' ' + workingEntries[0].workDay.employee.user.lastName;
    const month = workingEntries[0].workDay.date.format('MMMM');
    const totalWorkTime = this.totalWorkTime(workingEntries);
    const number_of_pages = doc.internal.getNumberOfPages();
    const docPages = doc.internal.pages;
    if (logo) {
      //  console.log(data.table.rows.length)
      doc.addImage(logo, 'JPG', data.settings.margin.left + 150, pageHeight - 27, 24, 10);
      doc.setFontSize('13');
      doc.text(`Employee : ${employee} , Month : ${month}`, data.settings.margin.left, 25);
      doc.setLineWidth(0.4);
      doc.setDrawColor(16, 24, 32);
      doc.line(data.settings.margin.left - 3, pageHeight - 23, data.settings.margin.left + 40, pageHeight - 23);
      doc.text('Signature', data.settings.margin.left + 7, pageHeight - 18);
      doc.text(`Total WorkTime :${totalWorkTime}`, data.settings.margin.left + 60, pageHeight - 18);
    }
  }
  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }

  getRowSpanfromData(data: any): object {
    const result = [];
    const counts = [];
    const startingIndex = [];
    const length = data.length;
    let i = 0;
    for (i = 0; i < length; i++) {
      if (result.indexOf(data[i][0]) === -1) {
        result.push(data[i][0]);
        startingIndex.push(i);
        counts.push(1);
      } else {
        const index = result.indexOf(data[i][0]);
        ++counts[index];
      }
    }
    const resultObject = [];
    resultObject.push(result, counts, startingIndex);
    return resultObject;
  }

  dataConversionForRowSpan(data: IWorkingEntryTimesheet[], raw_data: any, result: object): any {
    // for (let i = 0; i < raw_data.length; i++) {
    //   let row = raw_data[i];
    //   if (i === 0) { row['0'] = { rowSpan: 5, content: raw_data[0][0], styles: { valign: 'middle', halign: 'center' } }; }
    // }
    const counts = result[1];
    const index = result[2];
    const dates = result[0];
    const body = [];
    const totalWorkTime = [];
    for (let i = 0; i < dates.length; i++) {
      // let rows = [];
      let tempTotalWorkTime = 0;
      if (counts[i] > 1) {
        const rowSpan = counts[i];
        const dateProcessing = dates[i];
        for (let x = 0; x < counts[i]; x++) {
          tempTotalWorkTime = tempTotalWorkTime + data[i + x].end.diff(data[i + x].start, 'seconds', true);
        }
        totalWorkTime[i] = this.secondsToHHMM(tempTotalWorkTime);
        tempTotalWorkTime = 0;
      } else {
        tempTotalWorkTime = data[i].end.diff(data[i].start, 'seconds', true);
        totalWorkTime[i] = this.secondsToHHMM(tempTotalWorkTime);
      }
    }
    for (let y = 0; y < dates.length; y++) {
      const rowspan = counts[y];
      if (rowspan > 1) {
        const row = [];
        for (let a = 0; a < rowspan; a++) {
          for (let keys in raw_data) {
            if (keys === '1' || keys === '2' || keys === '4') {
              row.push(raw_data[index[y]][keys]);
            }
          }
          row.unshift({ rowSpan: rowspan, content: dates[y], styles: { valign: 'middle', halign: 'center' } });
          body.push(row);
        }
      } else {
        const row = [];
        for (let keys in raw_data) {
          row.push(raw_data[index[y]][keys]);
        }
        body.push(row);
      }
    }
    return body;
  }

  // for (var i = 0; i < raw.length; i++) {
  //     var row = [];
  //     for(var key in raw[i]) {
  //         row.push(raw[i][key]);
  //     }
  //     if (i % 5 === 0) {
  //         row.unshift({rowSpan: 5, content: i / 5 + 1, styles: {valign: 'middle', halign: 'center'}});
  //     }
  //     body.push(row)
  // }

  totalWorkTime(data: IWorkingEntryTimesheet[]): string {
    let tempWorkTime = 0;
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
//   const pageContent = (data: { settings: { margin: { left: 5 } } }) => {
//   doc.addFont('../../content/fonts/unineue-heavy-webfont.ttf', 'unineue-heavy', 'normal');
//     doc.addFont('../../content/fonts/unineue-regular-webfont.ttf', 'unineue-regular', 'normal');
// let totalPagesExp = '{total_pages_count_string}';
