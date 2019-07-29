import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDayOfWeekTimesheet } from 'app/shared/model/day-of-week-timesheet.model';
import { DayOfWeekTimesheetService } from './day-of-week-timesheet.service';

@Component({
  selector: 'jhi-day-of-week-timesheet-delete-dialog',
  templateUrl: './day-of-week-timesheet-delete-dialog.component.html'
})
export class DayOfWeekTimesheetDeleteDialogComponent {
  dayOfWeek: IDayOfWeekTimesheet;

  constructor(
    protected dayOfWeekService: DayOfWeekTimesheetService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.dayOfWeekService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'dayOfWeekListModification',
        content: 'Deleted an dayOfWeek'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-day-of-week-timesheet-delete-popup',
  template: ''
})
export class DayOfWeekTimesheetDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ dayOfWeek }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(DayOfWeekTimesheetDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.dayOfWeek = dayOfWeek;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/day-of-week-timesheet', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/day-of-week-timesheet', { outlets: { popup: null } }]);
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
