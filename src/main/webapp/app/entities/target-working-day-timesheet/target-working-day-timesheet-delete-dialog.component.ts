import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ITargetWorkingDayTimesheet } from 'app/shared/model/target-working-day-timesheet.model';
import { TargetWorkingDayTimesheetService } from './target-working-day-timesheet.service';

@Component({
  selector: 'jhi-target-working-day-timesheet-delete-dialog',
  templateUrl: './target-working-day-timesheet-delete-dialog.component.html'
})
export class TargetWorkingDayTimesheetDeleteDialogComponent {
  targetWorkingDay: ITargetWorkingDayTimesheet;

  constructor(
    protected targetWorkingDayService: TargetWorkingDayTimesheetService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.targetWorkingDayService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'targetWorkingDayListModification',
        content: 'Deleted an targetWorkingDay'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-target-working-day-timesheet-delete-popup',
  template: ''
})
export class TargetWorkingDayTimesheetDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ targetWorkingDay }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(TargetWorkingDayTimesheetDeleteDialogComponent as Component, {
          size: 'lg',
          backdrop: 'static'
        });
        this.ngbModalRef.componentInstance.targetWorkingDay = targetWorkingDay;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/target-working-day-timesheet', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/target-working-day-timesheet', { outlets: { popup: null } }]);
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
