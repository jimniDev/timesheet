import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';

@Component({
  selector: 'jhi-working-entry-timesheet-detail',
  templateUrl: './working-entry-timesheet-detail.component.html'
})
export class WorkingEntryTimesheetDetailComponent implements OnInit {
  workingEntry: IWorkingEntryTimesheet;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ workingEntry }) => {
      this.workingEntry = workingEntry;
    });
  }

  previousState() {
    window.history.back();
  }
}
