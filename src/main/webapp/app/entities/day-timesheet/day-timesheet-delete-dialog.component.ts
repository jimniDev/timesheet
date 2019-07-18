import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDayTimesheet } from 'app/shared/model/day-timesheet.model';
import { DayTimesheetService } from './day-timesheet.service';

@Component({
  selector: 'jhi-day-timesheet-delete-dialog',
  templateUrl: './day-timesheet-delete-dialog.component.html'
})
export class DayTimesheetDeleteDialogComponent {
  day: IDayTimesheet;

  constructor(protected dayService: DayTimesheetService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.dayService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'dayListModification',
        content: 'Deleted an day'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-day-timesheet-delete-popup',
  template: ''
})
export class DayTimesheetDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ day }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(DayTimesheetDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.day = day;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/day-timesheet', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/day-timesheet', { outlets: { popup: null } }]);
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
