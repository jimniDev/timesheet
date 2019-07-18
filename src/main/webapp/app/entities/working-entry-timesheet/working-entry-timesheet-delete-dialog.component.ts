import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { WorkingEntryTimesheetService } from './working-entry-timesheet.service';

@Component({
  selector: 'jhi-working-entry-timesheet-delete-dialog',
  templateUrl: './working-entry-timesheet-delete-dialog.component.html'
})
export class WorkingEntryTimesheetDeleteDialogComponent {
  workingEntry: IWorkingEntryTimesheet;

  constructor(
    protected workingEntryService: WorkingEntryTimesheetService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.workingEntryService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'workingEntryListModification',
        content: 'Deleted an workingEntry'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-working-entry-timesheet-delete-popup',
  template: ''
})
export class WorkingEntryTimesheetDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ workingEntry }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(WorkingEntryTimesheetDeleteDialogComponent as Component, {
          size: 'lg',
          backdrop: 'static'
        });
        this.ngbModalRef.componentInstance.workingEntry = workingEntry;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/working-entry-timesheet', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/working-entry-timesheet', { outlets: { popup: null } }]);
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
