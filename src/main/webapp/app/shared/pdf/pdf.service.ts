import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { IWorkingEntryTimesheet } from '../model/working-entry-timesheet.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() {}

  public createPDF(workingEntries: IWorkingEntryTimesheet[]): void {
    let doc = new jsPDF();
    workingEntries.forEach(we => {});
    doc.text('Hello world!', 10, 10);
    doc.save('timesheet.pdf');
  }
}
