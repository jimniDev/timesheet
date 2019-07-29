import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IWorkBreakTimesheet } from 'app/shared/model/work-break-timesheet.model';
import { WorkBreakTimesheetService } from './work-break-timesheet.service';

@Component({
  selector: 'jhi-work-break-timesheet-delete-dialog',
  templateUrl: './work-break-timesheet-delete-dialog.component.html'
})
export class WorkBreakTimesheetDeleteDialogComponent {
  workBreak: IWorkBreakTimesheet;

  constructor(
    protected workBreakService: WorkBreakTimesheetService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.workBreakService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'workBreakListModification',
        content: 'Deleted an workBreak'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-work-break-timesheet-delete-popup',
  template: ''
})
export class WorkBreakTimesheetDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ workBreak }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(WorkBreakTimesheetDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.workBreak = workBreak;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/work-break-timesheet', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/work-break-timesheet', { outlets: { popup: null } }]);
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
