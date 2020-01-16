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

  public buttonPDF(workingEntries: IWorkingEntryTimesheet[], targetMinutes: number, actualTime: number) {
    if (this.checkEmptyData(workingEntries) && workingEntries.length > 0) {
      try {
        this.createPDF(workingEntries, targetMinutes, actualTime);
      } catch (e) {
        console.log(e);
      }
    } else {
      const string = workingEntries.length === 0 ? 'No data' : 'Some Working Entries are not Complete';
      this._snackBar.open(string, 'Undo', { duration: 3000 });
    }
  }

  public createPDF(workingEntries: IWorkingEntryTimesheet[], targetTime: number, actualTime: number): void {
    const rawData = this.dataMapping(workingEntries);
    const topMargin = 27,
      leftMargin = 15,
      rightMargin = 15,
      bottomMargin = 33,
      maxRowInPage = 31; // CONFIG FOR PDF GENERATION

    let doc: any;
    doc = new jsPDF();
    const body = this.bodyCreationForTable(rawData, workingEntries, maxRowInPage);
    const workingEntryParts = this.dataSplits(this.calculateSplits(workingEntries, maxRowInPage), workingEntries);
    const dataStats = this.calculateDataStats(rawData);
    const totalTime = this.calculateTotalTimeParts(workingEntryParts, dataStats, this.calculateSplits(workingEntries, maxRowInPage));
    if (body.length > 1) {
      for (let s = 0; s < body.length; s++) {
        doc.autoTable({
          head: this.getColumns(),
          body: body[s],
          theme: 'grid',
          pageBreak: 'always',
          didDrawPage: (autoTableData: any) =>
            this.createPage(doc, workingEntryParts[s], autoTableData, s + 1, body.length, totalTime, dataStats, targetTime, actualTime),
          margin: { top: topMargin, bottom: bottomMargin, right: rightMargin, left: leftMargin }
        });
      }
      doc.deletePage(1);
    } else {
      doc.autoTable({
        head: this.getColumns(),
        body: body[0],
        theme: 'grid',
        didDrawPage: (autoTableData: any) =>
          this.createPage(doc, workingEntries, autoTableData, body.length, body.length, totalTime, dataStats, targetTime, actualTime),
        margin: { top: topMargin, bottom: bottomMargin, right: rightMargin, left: leftMargin }
      });
    }
    doc.save('timesheet.pdf');
  }

  getColumns() {
    return [{ date: 'Date', worktime: 'Worktime', Break: 'Break', from: 'From', to: 'To', activity: 'Activity' }];
  }

  totalWorkTime(data: IWorkingEntryTimesheet[], dataStats: any): string {
    const dates = dataStats.dates;
    const index = dataStats.datesIndexInRawData;
    const processedDates = [];
    let tempWorkTime = 0;
    for (let i = 0; i < data.length; i++) {
      if (processedDates.indexOf(data[i].workDay.date.format('DDMMYYYY')) === -1) {
        processedDates.push(data[i].workDay.date.format('DDMMYYYY'));
        tempWorkTime = tempWorkTime + data[i].workDay.totalWorkingMinutes * 60;
      }
    }
    return this.secondsToHHMM(tempWorkTime);
  }

  calculateTotalTimeParts(workingEntries: any, dataStats: any, index: any): any {
    const totalTimeByParts = [];
    for (let i = 0; i < workingEntries.length; i++) {
      totalTimeByParts[i] = this.totalWorkTime(workingEntries[i], dataStats);
    }
    return totalTimeByParts;
  }

  checkEmptyData(data: IWorkingEntryTimesheet[]): any {
    let flag = true;
    for (let i = 0; i < data.length; i++) {
      if (data[i].start === null || data[i].end === null) {
        flag = false;
        break;
      }
    }
    return flag;
  }

  dataMapping(data: IWorkingEntryTimesheet[]): any {
    const rawData = data.map(we => [
      we.workDay.date.format('YYYY-MM-DD'),
      this.secondsToHHMM(we.workDay.totalWorkingMinutes * 60),
      this.secondsToHHMM(we.workDay.totalBreakMinutes * 60),
      we.start.format('HH:mm'),
      we.end.format('HH:mm'),
      we.activity ? we.activity.name : ''
    ]);
    return rawData;
  }

  secondsToHHMM(seconds: number): string {
    if (seconds >= 0) {
      const hour = Math.floor(seconds / 3600);
      const min = Math.floor((seconds % 3600) / 60);
      return this.pad(hour, 2) + 'h ' + this.pad(min, 2) + 'm';
    } else {
      const hour = Math.ceil(seconds / 3600);
      const min = Math.ceil((seconds % 3600) / 60);
      return '-' + this.pad(Math.abs(hour), 2) + 'h ' + this.pad(Math.abs(min), 2) + 'm';
    }
  }

  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }

  bodyCreationForTable(rawData: any, workingEntries: IWorkingEntryTimesheet[], maxRows: number): any {
    const dataStats = this.calculateDataStats(rawData);
    const body = this.dataConversionForRowSpan(workingEntries, rawData, dataStats);
    const splitsIndex = this.calculateSplits(rawData, maxRows);
    const bodyParts = this.dataSplits(splitsIndex, body);
    return bodyParts;
  }

  dataConversionForRowSpan(data: IWorkingEntryTimesheet[], raw_data: any, result: any): any {
    const body = [];
    const totalWorkTime = [];
    let row = [];
    const dates = result.dates;
    const rowSpan = result.rowSpan;
    const datesIndexInRawData = result.datesIndexInRawData;
    let flag = 0;

    for (let i = 0; i < dates.length; i++) {
      totalWorkTime[i] = this.secondsToHHMM(data[datesIndexInRawData[i]].workDay.totalWorkingMinutes * 60);
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
              case '2':
                switch (flag) {
                  case beginIndex:
                    row.push({
                      rowSpan: counts,
                      content: this.secondsToHHMM(data[datesIndexInRawData[a]].workDay.totalBreakMinutes * 60),
                      styles: { valign: 'middle', halign: 'left' }
                    });
                    break;
                  default:
                    break;
                }
                break;
              case '5':
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
        // tslint:disable-next-line: forin
        for (const keys in raw_data[flag]) {
          //  if (raw_data.hasOwnProperty(keys)) {
          row.push(raw_data[flag][keys]);
          if (keys === '5') {
            flag++;
            body.push(row);
            row = [];
          }
        }
      }
    }

    return body;
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

  calculateSplits(rawData: any, maxRows: number): any {
    const idealIndexPairs = [];
    let checker = 0;
    if (rawData.length > maxRows) {
      const parts = Math.floor(rawData.length / maxRows);
      let starting = 0;
      let end = 0;
      for (let i = 0; i <= parts; i++) {
        if (i === 0) {
          starting = maxRows * i;
          end = 29 * (i + 1) + i;
          checker = this.checkProcessedData(rawData, end);
          idealIndexPairs.push(checker);
        } else if (i === parts) {
          starting = checker + 1;
          end = rawData.length - 1;
          idealIndexPairs.push(end);
        } else {
          starting = checker + 1;
          end = 29 * (i + 1) + i;
          checker = this.checkProcessedData(rawData, end);
          idealIndexPairs.push(checker);
        }
      }
      return idealIndexPairs;
    } else {
      idealIndexPairs.push(rawData.length);
      return idealIndexPairs;
    }
  }

  dataSplits(splitsIndex: any, data: any): any {
    let start = 0;
    const splitCollector: any = [];
    for (let i = 0; i < splitsIndex.length; i++) {
      const tempWEParts = data.slice(start, splitsIndex[i] + 1);
      splitCollector.push(tempWEParts);
      start = splitsIndex[i] + 1;
    }
    return splitCollector;
  }

  createPage(
    doc: jsPDF,
    workingEntries: IWorkingEntryTimesheet[],
    data: any,
    pageNumber: number,
    totalPages: number,
    totalTime: any,
    datesObj: any,
    targettime: number,
    totalTimeFromServer: number
  ): void {
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    const name = this.account.firstName + ' ' + this.account.lastName;
    const month = workingEntries[0].workDay.date.format('MMMM');
    const year = workingEntries[0].workDay.date.format('YYYY');
    let totalWorkTime = totalTimeFromServer;
    const targetTime = this.secondsToHHMM(targettime * 60);
    const differnce = this.difference(this.totalWorkTime(workingEntries, datesObj), targetTime);

    if (!this.initialized) {
      return;
    }
    const base64logo = this.getLogo().default;
    if (base64logo) {
      if (totalPages > 1) {
        this.addLogo(doc, base64logo, data, pageHeight);
        doc.setFontSize('13');
        if (pageNumber < totalPages && pageNumber > 1) {
          this.addPageNumber(doc, pageNumber, totalPages, data, pageHeight);
          this.addSumOnPreviousPage(doc, totalTime[pageNumber - 2], data);
        }
        if (pageNumber === 1) {
          this.addTitle(doc, 'Monthly Timesheet');
          this.addEmployeeNameandMonthYear(doc, name, month, year, data);
          this.addPageNumber(doc, pageNumber, totalPages, data, pageHeight);
        }
        if (pageNumber === totalPages) {
          this.addSignature(doc, data, pageHeight);
          totalWorkTime = totalTimeFromServer;
          this.addSumOnPreviousPage(doc, totalTime[pageNumber - 2], data);
          this.addTotalWorkTime(doc, totalWorkTime, data, pageHeight, targetTime, differnce);
        }
      } else {
        this.addLogo(doc, base64logo, data, pageHeight);
        this.addTitle(doc, 'Monthly Timesheet');
        this.addEmployeeNameandMonthYear(doc, name, month, year, data);
        this.addTotalWorkTime(doc, totalWorkTime, data, pageHeight, targetTime, differnce);
        this.addSignature(doc, data, pageHeight);
      }
    }
  }

  addLogo(doc: jsPDF, logo: any, data: any, pageHeight: any): void {
    doc.addImage(logo, 'PNG', data.settings.margin.left + 150, pageHeight - 27, 24, 10);
  }

  addSignature(doc: jsPDF, data: any, pageHeight: any): void {
    doc.setFontSize('12');
    doc.setLineWidth(0.4);
    doc.setDrawColor(16, 24, 32);
    doc.line(data.settings.margin.left - 3, pageHeight - 23, data.settings.margin.left + 40, pageHeight - 23);
    doc.text('Signature', data.settings.margin.left + 7, pageHeight - 18);
  }

  addTitle(doc: jsPDF, title: string) {
    doc.setFontSize('15');
    // doc.setTextColor(0, 48, 87);
    const textWidth = (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
    const textOffset = (doc.internal.pageSize.width - textWidth) / 2;
    doc.text(`${title}`, textOffset, 13);
  }

  addEmployeeNameandMonthYear(doc: jsPDF, name: string, month: string, year: string, data: any): void {
    doc.setFontSize('12');
    doc.setTextColor(16, 24, 32);
    doc.text(`Employee: ${name}, Year: ${year}, Month: ${month}`, data.settings.margin.left, 25);
  }

  addTotalWorkTime(doc: jsPDF, totalWorkTime: any, data: any, pageHeight: any, targetTime: any, difference: any): void {
    doc.setFontSize('10');
    doc.text(
      `Total: ${this.secondsToHHMM(totalWorkTime * 60)} | Target: ${targetTime} | Diff: ${difference}`,
      data.settings.margin.left + 55,
      pageHeight - 18
    );
  }

  addPageNumber(doc: jsPDF, pageNumber: any, totalPages: number, data: any, pageHeight: any): void {
    doc.setFontSize('10');
    doc.text(`Page ${pageNumber} / ${totalPages}`, data.settings.margin.left, pageHeight - 20);
  }

  addSumOnPreviousPage(doc: jsPDF, totalTimeOnPreviouspage: any, data: any): void {
    doc.setFontSize('13');
    doc.text(`Sum of previous page: ${totalTimeOnPreviouspage}`, data.settings.margin.left, 25);
  }

  difference(time: string, time2: string): any {
    const timeHours = +time.slice(0, time.indexOf('h')).toString();
    const timeMinutes = +time.slice(time.indexOf('h') + 2, time.indexOf('m'));
    const timeToSeconds = timeHours * 3600 + timeMinutes * 60;
    const time2Hours = +time2.slice(0, time2.indexOf('h')).toString();
    const time2Minutes = +time2.slice(time2.indexOf('h') + 2, time2.indexOf('m'));
    const time2ToSeconds = time2Hours * 3600 + time2Minutes * 60;

    if (timeToSeconds > time2ToSeconds) {
      const hour = Math.floor((timeToSeconds - time2ToSeconds) / 3600);
      const min = Math.floor(((timeToSeconds - time2ToSeconds) % 3600) / 60);
      return this.pad(hour, 2) + 'h ' + this.pad(min, 2) + 'm';
    } else {
      const hour = Math.ceil((timeToSeconds - time2ToSeconds) / 3600);
      const min = Math.ceil(((timeToSeconds - time2ToSeconds) % 3600) / 60);
      return '-' + this.pad(Math.abs(hour), 2) + 'h ' + this.pad(Math.abs(min), 2) + 'm';
    }
  }

  getLogo(): any {
    return require('app/../content/images/logo-base64Img.txt');
  }
}
