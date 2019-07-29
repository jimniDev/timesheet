import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWorkBreakTimesheet } from 'app/shared/model/work-break-timesheet.model';

@Component({
  selector: 'jhi-work-break-timesheet-detail',
  templateUrl: './work-break-timesheet-detail.component.html'
})
export class WorkBreakTimesheetDetailComponent implements OnInit {
  workBreak: IWorkBreakTimesheet;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ workBreak }) => {
      this.workBreak = workBreak;
    });
  }

  previousState() {
    window.history.back();
  }
}
