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
    let bodyData = [];
    if (raw_data.length > 1) {
      const rowSpanInformation = this.getRowSpanfromData(raw_data);
      bodyData = this.dataConversionForRowSpan(workingEntries, raw_data, rowSpanInformation);
    } else {
      if (raw_data.length !== 0) {
        bodyData = raw_data;
      }
    }

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
    return [{ date: 'Date', worktime: 'Worktime', from: 'From', to: 'to', activity: 'Activity' }];
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
    const endingIndex = [];
    const length = data.length;
    for (let i = 0; i < length; i++) {
      if (result.indexOf(data[i][0]) === -1) {
        result.push(data[i][0]);
        startingIndex.push(i);
        counts.push(1);
      } else {
        const index = result.indexOf(data[i][0]);
        ++counts[index];
      }
    }
    for (let y = 0; y < startingIndex.length; y++) {
      endingIndex[y] = startingIndex[y] + counts[y] - 1;
    }
    const resultObject = [];
    resultObject.push(result, counts, startingIndex, endingIndex);
    return resultObject;
  }

  dataConversionForRowSpan(data: IWorkingEntryTimesheet[], raw_data: any, result: object): any {
    const countsOfDates = result[1];
    const indexOfDatesStarting = result[2];
    const indexOfDatesEnding = result[3];
    const dates = result[0];
    const body = [];
    const totalWorkTime = [];
    for (let i = 0; i < dates.length; i++) {
      let tempTotalWorkTime = 0;
      if (countsOfDates[i] > 1) {
        const rowSpan = countsOfDates[i];
        const dateProcessing = dates[i];
        for (let x = 0; x < countsOfDates[i]; x++) {
          tempTotalWorkTime = tempTotalWorkTime + data[i + x].end.diff(data[i + x].start, 'seconds', true);
        }
        totalWorkTime[i] = this.secondsToHHMM(tempTotalWorkTime);
        tempTotalWorkTime = 0;
      } else {
        tempTotalWorkTime = data[i].end.diff(data[i].start, 'seconds', true);
        totalWorkTime[i] = this.secondsToHHMM(tempTotalWorkTime);
      }
    }
    let flag = 0;
    let row = [];
    for (let a = 0; a < dates.length; a++) {
      const beginIndex = indexOfDatesStarting[a];
      const endIndex = indexOfDatesStarting[a];
      const counts = countsOfDates[a];

      if (counts > 1) {
        for (let b = 0; b < counts; b++) {
          for (const keys in raw_data[flag]) {
            if (raw_data.hasOwnProperty(keys)) {
              if (keys === '0') {
                if (flag === beginIndex) {
                  row.push({ rowSpan: counts, content: dates[a], styles: { valign: 'middle', halign: 'left' } });
                } else {
                }
              } else if (keys === '3') {
                if (flag === beginIndex) {
                  row.push({ rowSpan: counts, content: totalWorkTime[a], styles: { valign: 'middle', halign: 'left' } });
                } else {
                }
              } else {
                row.push(raw_data[flag][keys]);
                if (keys === '4') {
                  flag++;
                  body.push(row);
                  row = [];
                }
              }
            }
          }
        }
      } else {
        for (const keys in raw_data[flag]) {
          if (raw_data.hasOwnProperty(keys)) {
            row.push(raw_data[flag][keys]);
            if (keys === '4') {
              flag++;
              body.push(row);
              row = [];
            }
          }
        }
      }
    }

    return body;
  }
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
