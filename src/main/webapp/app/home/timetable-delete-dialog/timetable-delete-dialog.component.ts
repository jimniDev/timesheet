import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TimetableComponent } from '../timetable/timetable.component';
import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';

@Component({
  selector: 'jhi-timetable-delete-dialog',
  templateUrl: './timetable-delete-dialog.component.html'
})
export class TimetableDeleteDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TimetableDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public workingEntryData: IWorkingEntryTimesheet
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  delete() {
    this.dialogRef.close(this.workingEntryData);
  }
}
