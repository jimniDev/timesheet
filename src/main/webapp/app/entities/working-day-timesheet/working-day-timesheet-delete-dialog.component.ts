import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IWorkingDayTimesheet } from 'app/shared/model/working-day-timesheet.model';
import { WorkingDayTimesheetService } from './working-day-timesheet.service';

@Component({
  selector: 'jhi-working-day-timesheet-delete-dialog',
  templateUrl: './working-day-timesheet-delete-dialog.component.html'
})
export class WorkingDayTimesheetDeleteDialogComponent {
  workingDay: IWorkingDayTimesheet;

  constructor(
    protected workingDayService: WorkingDayTimesheetService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.workingDayService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'workingDayListModification',
        content: 'Deleted an workingDay'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-working-day-timesheet-delete-popup',
  template: ''
})
export class WorkingDayTimesheetDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ workingDay }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(WorkingDayTimesheetDeleteDialogComponent as Component, {
          size: 'lg',
          backdrop: 'static'
        });
        this.ngbModalRef.componentInstance.workingDay = workingDay;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/working-day-timesheet', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/working-day-timesheet', { outlets: { popup: null } }]);
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
