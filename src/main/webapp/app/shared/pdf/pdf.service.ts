import { Injectable } from '@angular/core';
import { IWorkingEntryTimesheet } from '../model/working-entry-timesheet.model';

// import * as jsPDF from 'jspdf';
// import 'jspdf-autotable';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class PdfService {
  constructor() {}

  public createPDF(workingEntries: IWorkingEntryTimesheet[]): void {
    // const rows = workingEntries.map(we => [
    //   we.workDay.date.format('YYYY-MM-DD'),
    //   we.start.format('HH:mm'),
    //   we.end.format('HH:mm'),
    //   this.secondsToHHMM(we.end.diff(we.start, 'seconds', true)),
    //   we.activity ? we.activity.name : ''
    // ]);
    // const doc = new jsPDF();
    // doc.text(30, 10, 'Timesheet');
    // doc.autoTable(40, {
    //   head: [['Date', 'From', 'To', 'Worktime', 'Activity']],
    //   body: rows
    // });
    // doc.text(20, 20, 'Sum');
    // doc.save('timesheet.pdf');

    const docDefinition = {
      content: [
        { text: 'AS Scope Timesheet - Philipp Ringele - October', fontSize: 15 },
        {
          layout: {
            hLineWidth: (i, node) => 1, // (i === 0 || i === node.table.body.length) ? 2 : 1,
            vLineWidth: (i, node) => 1, //  (i === 0 || i === node.table.widths.length) ? 2 : 1,
            hLineColor: (i, node) => 'black', // (i === 0 || i === node.table.body.length) ? 'black' : 'gray',
            vLineColor: (i, node) => 'black' // (i === 0 || i === node.table.widths.length) ? 'black' : 'gray',
            // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // paddingLeft: function(i, node) { return 4; },
            // paddingRight: function(i, node) { return 4; },
            // paddingTop: function(i, node) { return 2; },
            // paddingBottom: function(i, node) { return 2; },
            // fillColor: function (rowIndex, node, columnIndex) { return null; }
          },
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],

            body: workingEntries.map(we => [
              we.workDay.date.format('YYYY-MM-DD'),
              we.start.format('HH:mm'),
              we.end.format('HH:mm'),
              this.secondsToHHMM(we.end.diff(we.start, 'seconds', true)),
              we.activity ? we.activity.name : ''
            ])
          }
        }
      ]
    };
    pdfMake.createPdf(docDefinition).open({}, window);
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
