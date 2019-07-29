import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IWorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';
import { WorkDayTimesheetService } from './work-day-timesheet.service';

@Component({
  selector: 'jhi-work-day-timesheet-delete-dialog',
  templateUrl: './work-day-timesheet-delete-dialog.component.html'
})
export class WorkDayTimesheetDeleteDialogComponent {
  workDay: IWorkDayTimesheet;

  constructor(
    protected workDayService: WorkDayTimesheetService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.workDayService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'workDayListModification',
        content: 'Deleted an workDay'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-work-day-timesheet-delete-popup',
  template: ''
})
export class WorkDayTimesheetDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ workDay }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(WorkDayTimesheetDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.workDay = workDay;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/work-day-timesheet', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/work-day-timesheet', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
