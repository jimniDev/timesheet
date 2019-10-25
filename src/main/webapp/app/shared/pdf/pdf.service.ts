import { Injectable, ComponentFactoryResolver, Injector } from '@angular/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { IWorkingEntryTimesheet } from '../model/working-entry-timesheet.model';
import { TableGeneratorComponent } from './table-generator/table-generator.component';
import { loadOptions } from '@babel/core';
import { IWorkDayTimesheet } from '../model/work-day-timesheet.model';
import { start } from 'repl';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';

@Injectable()
export class PdfService {
  public initialized = false;
  private account: Account;

  constructor(private accountService: AccountService) {
    this.accountService.identity().then(a => {
      this.account = a;
      this.initialized = true;
    });
  }
  public createPDF(workingEntries: IWorkingEntryTimesheet[]): void {
    const rawData = workingEntries.map(we => [
      we.workDay.date.format('YYYY-MM-DD'),
      this.secondsToHHMM(we.end.diff(we.start, 'seconds', true)),
      we.start.format('HH:mm'),
      we.end.format('HH:mm'),
      we.activity ? we.activity.name : ''
    ]);
    const doc = new jsPDF();
    const rawdataLength = rawData.length;
    let processedData = [];
    const bodyParts = [];
    const workingEntryParts = [];
    const timeTotalOfParts = [];
    const totaltimeParts = [];

    switch (rawdataLength) {
      case 0:
        console.log('No data for printing');
        break;

      case 1:
        processedData = rawData;
        break;

      default:
        const calculateRowSpan = this.calculateDataStats(rawData);
        processedData = this.dataConversionForRowSpan(workingEntries, rawData, calculateRowSpan);
        break;
    }

    if (processedData.length > 30) {
      const parts = Math.floor(processedData.length / 30);
      let starting = 0;
      let end = 29;
      for (let i = 0; i < parts; i++) {
        let dataDivision = processedData.slice(starting, end);
        const tempParts = workingEntries.slice(starting, end);
        bodyParts.push(dataDivision);
        workingEntryParts.push(tempParts);
        starting = starting + 30 * (i + 1);
        end = end + (processedData.length - starting + 1);
        if (i === parts - 1) {
          dataDivision = processedData.slice(starting, end);
          const temp = workingEntries.slice(starting, end);
          bodyParts.push(dataDivision);
          workingEntryParts.push(temp);
        }
      }
    } else {
      bodyParts[0] = processedData;
    }

    for (let x = 0; x < workingEntryParts.length; x++) {
      const total = this.totalWorkTime(workingEntryParts[x]);
      totaltimeParts[x] = total;
    }
    totaltimeParts.push(this.totalWorkTime(workingEntries));

    if (bodyParts.length > 1) {
      for (let s = 0; s < bodyParts.length; s++) {
        doc.autoTable({
          head: this.getColumns(),
          body: bodyParts[s],
          theme: 'grid',
          didDrawPage: (autoTableData: any) =>
            this.createPageHeaderFooter(doc, workingEntryParts[s], autoTableData, s + 1, bodyParts.length, totaltimeParts),
          margin: { top: 27, bottom: 33, right: 15, left: 15 }
        });
      }
    } else {
      doc.autoTable({
        head: this.getColumns(),
        body: bodyParts[0],
        theme: 'grid',
        didDrawPage: (autoTableData: any) =>
          this.createPageHeaderFooter(doc, workingEntries, autoTableData, bodyParts.length, bodyParts.length, totaltimeParts),
        margin: { top: 27, bottom: 33, right: 15, left: 15 }
      });
    }

    doc.save('timesheet.pdf');
  }
  getColumns() {
    return [{ date: 'Date', worktime: 'Worktime', from: 'From', to: 'to', activity: 'Activity' }];
  }
  createPageHeaderFooter(
    doc: jsPDF,
    workingEntries: IWorkingEntryTimesheet[],
    data: any,
    pageNumber: number,
    totalPages: number,
    totalTime: any
  ): void {
    const logo = new Image();
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    const name = this.account.firstName + this.account.lastName;
    const month = workingEntries[0].workDay.date.format('MMMM');
    // const totalWorkTime = this.totalWorkTime(workingEntries);
    let totalWorkTime: any;
    logo.src = '../../content/images/logo.jpg';
    if (!this.initialized) {
      return;
    }
    if (logo) {
      if (totalPages > 1) {
        this.addLogo(doc, logo, data, pageHeight);
        doc.setFontSize('13');
        if (pageNumber !== totalPages) {
          this.addPageNumber(doc, pageNumber, totalPages, data, pageHeight);
        }
        if (pageNumber === 1) {
          this.addEmployeeNameandMonth(doc, name, month, data);
        } else {
          this.addSumOnPreviousPage(doc, totalTime[pageNumber - 2], data);
        }
        if (pageNumber === totalPages) {
          this.addSignature(doc, data, pageHeight);
          this.addTotalWorkTime(doc, totalWorkTime, data, pageHeight);
        }
      } else {
        totalWorkTime = this.totalWorkTime(workingEntries);
        this.addLogo(doc, logo, data, pageHeight);
        this.addEmployeeNameandMonth(doc, name, month, data);
        this.addTotalWorkTime(doc, totalWorkTime, data, pageHeight);
        this.addSignature(doc, data, pageHeight);
      }
    }
  }
  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }
  calculateDataStats(data: any): object {
    const processingResult = {
      dates: [],
      rowSpan: [],
      datesIndexInRawData: []
    };
    const processingResultObject = processingResult;
    const datesLength = data.length;
    for (let i = 0; i < datesLength; i++) {
      if (processingResultObject.dates.indexOf(data[i][0]) === -1) {
        processingResultObject.dates.push(data[i][0]);
        processingResultObject.datesIndexInRawData.push(i);
        processingResultObject.rowSpan.push(1);
      } else {
        ++processingResultObject.rowSpan[processingResult.dates.indexOf(data[i][0])];
      }
    }
    return processingResultObject;
  }

  dataConversionForRowSpan(data: IWorkingEntryTimesheet[], raw_data: any, result: any): any {
    const body = [];
    const totalWorkTime = [];
    const dates = result.dates;
    const rowSpan = result.rowSpan;
    const datesIndexInRawData = result.datesIndexInRawData;
    let flag = 0; // Flag variable or watchVariable to follow up with Index in WorkingEntries
    let row = []; // To be pushed in the body for autotable with rowspan details
    for (let i = 0; i < dates.length; i++) {
      let tempTotalWorkTime = 0;
      const rowspan = rowSpan[i];
      if (rowspan > 1) {
        for (let x = 0; x < rowSpan[i]; x++) {
          tempTotalWorkTime = tempTotalWorkTime + data[i + x].end.diff(data[i + x].start, 'seconds', true);
        }
        totalWorkTime[i] = this.secondsToHHMM(tempTotalWorkTime);
        tempTotalWorkTime = 0;
      } else {
        tempTotalWorkTime = data[i].end.diff(data[i].start, 'seconds', true);
        totalWorkTime[i] = this.secondsToHHMM(tempTotalWorkTime);
      }
    }
    for (let a = 0; a < result.dates.length; a++) {
      const beginIndex = datesIndexInRawData[a]; // First apperance of date in the workingEntries Array
      const counts = rowSpan[a]; // Counts of Dates in the dataset
      if (counts > 1) {
        for (let b = 0; b < counts; b++) {
          // tslint:disable-next-line: forin
          for (const keys in raw_data[flag]) {
            switch (keys) {
              case '0':
                switch (flag) {
                  case beginIndex:
                    row.push({ rowSpan: counts, content: result.dates[a], styles: { valign: 'middle', halign: 'left' } });
                    break;
                  default:
                    break;
                }
                break;
              case '1':
                switch (flag) {
                  case beginIndex:
                    row.push({ rowSpan: counts, content: totalWorkTime[a], styles: { valign: 'middle', halign: 'left' } });
                    break;
                  default:
                    break;
                }
                break;
              case '4':
                row.push(raw_data[flag][keys]);
                flag++;
                body.push(row);
                row = [];
                break;
              default:
                row.push(raw_data[flag][keys]);
                break;
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
    for (let i = 0; i < data.length; i++) {
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

  addLogo(doc: jsPDF, logo: any, data: any, pageHeight: any): void {
    doc.addImage(logo, 'JPG', data.settings.margin.left + 150, pageHeight - 27, 24, 10);
  }

  addSignature(doc: jsPDF, data: any, pageHeight: any): void {
    doc.setFontSize('13');
    doc.setLineWidth(0.4);
    doc.setDrawColor(16, 24, 32);
    doc.line(data.settings.margin.left - 3, pageHeight - 23, data.settings.margin.left + 40, pageHeight - 23);
    doc.text('Signature', data.settings.margin.left + 7, pageHeight - 18);
  }

  addEmployeeNameandMonth(doc: jsPDF, name: string, month: string, data: any): void {
    doc.setFontSize('13');
    doc.text(`Employee: ${name}, Month: ${month} `, data.settings.margin.left, 25);
  }

  addTotalWorkTime(doc: jsPDF, totalWorkTime: any, data: any, pageHeight: any): void {
    doc.setFontSize('13');
    doc.text(`Total WorkTime: ${totalWorkTime} `, data.settings.margin.left + 60, pageHeight - 18);
  }

  addPageNumber(doc: jsPDF, pageNumber: any, totalPages: number, data: any, pageHeight: any): void {
    doc.setFontSize('10');
    doc.text(`Page ${pageNumber} / ${totalPages}`, data.settings.margin.left, pageHeight - 27);
  }

  addSumOnPreviousPage(doc: jsPDF, totalTimeOnPreviouspage: any, data: any): void {
    doc.setFontSize('13');
    doc.text(`Sum of previous page: ${totalTimeOnPreviouspage}`, data.settings.margin.left, 25);
  }
}
