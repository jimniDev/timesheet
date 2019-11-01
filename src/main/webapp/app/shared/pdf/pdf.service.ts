import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { IWorkingEntryTimesheet } from '../model/working-entry-timesheet.model';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/user/account.model';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class PdfService {
  public initialized = false;
  private account: Account;

  constructor(private accountService: AccountService, private _snackBar: MatSnackBar) {
    this.accountService.identity().then(a => {
      this.account = a;
      this.initialized = true;
    });
  }

  public createPDF(workingEntries: IWorkingEntryTimesheet[]): void {
    const initialChecking = this.checkEmptyData(workingEntries);
    if (initialChecking === true) {
      const rawData = workingEntries.map(we => [
        we.workDay.date.format('YYYY-MM-DD'),
        this.secondsToHHMM(we.end.diff(we.start, 'seconds', true)),
        we.start.format('HH:mm'),
        we.end.format('HH:mm'),
        we.activity ? we.activity.name : ''
      ]);
      const topMargin = 27;
      const leftMargin = 15;
      const rightMargin = 15;
      const bottomMargin = 33;
      const maxRowInPage = 30; // put the following in parts.
      const doc = new jsPDF();
      const rawdataLength = rawData.length;
      let processedData = [];
      const bodyParts = [];
      const workingEntryParts = [];
      const totaltimeParts = [];
      let calculateRowSpan: any;
      switch (rawdataLength) {
        case 0:
          console.log('No data for printing');
          break;

        case 1:
          processedData = rawData;
          break;

        default:
          calculateRowSpan = this.calculateDataStats(rawData);
          processedData = this.dataConversionForRowSpan(workingEntries, rawData, calculateRowSpan);
          break;
      }
      const idealIndexPairs = [];

      let checker = 0;
      if (processedData.length > maxRowInPage) {
        const parts = Math.floor(processedData.length / maxRowInPage);
        let starting = 0;
        let end = 0;
        for (let i = 0; i <= parts; i++) {
          if (i === 0) {
            starting = maxRowInPage * i;
            end = 29 * (i + 1) + i;
            checker = this.checkProcessedData(processedData, end);
            idealIndexPairs.push(checker);
          } else if (i === parts) {
            starting = checker + 1;
            end = processedData.length - 1;
            idealIndexPairs.push(end);
          } else {
            starting = checker + 1;
            end = 29 * (i + 1) + i;
            checker = this.checkProcessedData(processedData, end);
            idealIndexPairs.push(checker);
          }
        }
      } else {
        bodyParts[0] = processedData;
      }
      let start = 0;
      for (let i = 0; i < idealIndexPairs.length; i++) {
        const tempWEParts = workingEntries.slice(start, idealIndexPairs[i]);
        const tempBodyParts = processedData.slice(start, idealIndexPairs[i]);
        workingEntryParts.push(tempWEParts);
        bodyParts.push(tempBodyParts);
        start = idealIndexPairs[i];
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
            pageBreak: 'always',
            didDrawPage: (autoTableData: any) =>
              this.createPage(doc, workingEntryParts[s], autoTableData, s + 1, bodyParts.length, totaltimeParts),
            margin: { top: topMargin, bottom: bottomMargin, right: rightMargin, left: leftMargin }
          });
        }
        doc.deletePage(1);
      } else {
        doc.autoTable({
          head: this.getColumns(),
          body: bodyParts[0],
          theme: 'grid',
          didDrawPage: (autoTableData: any) =>
            this.createPage(doc, workingEntries, autoTableData, bodyParts.length, bodyParts.length, totaltimeParts),
          margin: { top: topMargin, bottom: bottomMargin, right: rightMargin, left: leftMargin }
        });
      }
      doc.save('timesheet.pdf');
    } else {
      this._snackBar.open('Some Working Entries are not Complete', 'Undo', { duration: 3000 });
    }
  }

  getColumns() {
    return [{ date: 'Date', worktime: 'Worktime', from: 'From', to: 'To', activity: 'Activity' }];
  }
  checkEmptyData(data: any): any {
    let flag = true;
    for (let i = 0; i < data.length; i++) {
      if (data[i].start === null || data[i].end === null) {
        flag = false;
        break;
      }
    }
    return flag;
  }

  createPage(
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
    let totalWorkTime: any;
    logo.src = 'content/images/logo.jpg';
    if (!this.initialized) {
      return;
    }
    if (logo) {
      if (totalPages > 1) {
        this.addLogo(doc, logo, data, pageHeight);
        doc.setFontSize('13');
        if (pageNumber < totalPages && pageNumber > 1) {
          this.addPageNumber(doc, pageNumber, totalPages, data, pageHeight);
          this.addSumOnPreviousPage(doc, totalTime[pageNumber - 2], data);
        }
        if (pageNumber === 1) {
          this.addEmployeeNameandMonth(doc, name, month, data);
          this.addPageNumber(doc, pageNumber, totalPages, data, pageHeight);
        }
        if (pageNumber === totalPages) {
          this.addSignature(doc, data, pageHeight);
          totalWorkTime = totalTime[totalTime.length - 1];
          this.addSumOnPreviousPage(doc, totalTime[pageNumber - 2], data);
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
    let flag = 0;
    let row = [];
    for (let i = 0; i < dates.length; i++) {
      let tempTotalWorkTime = 0;
      const rowspan = rowSpan[i];
      if (rowspan > 1) {
        for (let x = 0; x < rowSpan[i]; x++) {
          const index = datesIndexInRawData[i];
          tempTotalWorkTime = tempTotalWorkTime + data[index + x].end.diff(data[index + x].start, 'seconds', true);
        }
        totalWorkTime[i] = this.secondsToHHMM(tempTotalWorkTime);
        tempTotalWorkTime = 0;
      } else {
        tempTotalWorkTime = data[i].end.diff(data[i].start, 'seconds', true);
        totalWorkTime[i] = this.secondsToHHMM(tempTotalWorkTime);
      }
    }
    for (let a = 0; a < result.dates.length; a++) {
      const beginIndex = datesIndexInRawData[a];
      const counts = rowSpan[a];
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
    doc.text(`Page ${pageNumber} / ${totalPages}`, data.settings.margin.left, pageHeight - 20);
  }

  addSumOnPreviousPage(doc: jsPDF, totalTimeOnPreviouspage: any, data: any): void {
    doc.setFontSize('13');
    doc.text(`Sum of previous page: ${totalTimeOnPreviouspage}`, data.settings.margin.left, 25);
  }

  checkProcessedData(processedDataSet: any, index: any): any {
    let properIndexforPageDivision: any;
    if (typeof processedDataSet[index][0] === 'object') {
      properIndexforPageDivision = index - 1;
    } else if (processedDataSet[index].length === 3) {
      for (let i = index; i >= 0; i--) {
        if (processedDataSet[i].length === 5) {
          properIndexforPageDivision = i - 1;
          break;
        }
      }
    } else {
      properIndexforPageDivision = index;
    }
    return properIndexforPageDivision;
  }
}
