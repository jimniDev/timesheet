import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ILocationTimesheet } from 'app/shared/model/location-timesheet.model';
import { LocationTimesheetService } from './location-timesheet.service';

@Component({
  selector: 'jhi-location-timesheet-delete-dialog',
  templateUrl: './location-timesheet-delete-dialog.component.html'
})
export class LocationTimesheetDeleteDialogComponent {
  location: ILocationTimesheet;

  constructor(
    protected locationService: LocationTimesheetService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.locationService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'locationListModification',
        content: 'Deleted an location'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-location-timesheet-delete-popup',
  template: ''
})
export class LocationTimesheetDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ location }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(LocationTimesheetDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.location = location;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/location-timesheet', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/location-timesheet', { outlets: { popup: null } }]);
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
