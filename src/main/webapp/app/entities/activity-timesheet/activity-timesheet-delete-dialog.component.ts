import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { ActivityTimesheetService } from './activity-timesheet.service';

@Component({
  selector: 'jhi-activity-timesheet-delete-dialog',
  templateUrl: './activity-timesheet-delete-dialog.component.html'
})
export class ActivityTimesheetDeleteDialogComponent {
  activity: IActivityTimesheet;

  constructor(
    protected activityService: ActivityTimesheetService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.activityService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'activityListModification',
        content: 'Deleted an activity'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-activity-timesheet-delete-popup',
  template: ''
})
export class ActivityTimesheetDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ activity }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(ActivityTimesheetDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.activity = activity;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/activity-timesheet', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/activity-timesheet', { outlets: { popup: null } }]);
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
