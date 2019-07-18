import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICountryTimesheet } from 'app/shared/model/country-timesheet.model';
import { CountryTimesheetService } from './country-timesheet.service';

@Component({
  selector: 'jhi-country-timesheet-delete-dialog',
  templateUrl: './country-timesheet-delete-dialog.component.html'
})
export class CountryTimesheetDeleteDialogComponent {
  country: ICountryTimesheet;

  constructor(
    protected countryService: CountryTimesheetService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.countryService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'countryListModification',
        content: 'Deleted an country'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-country-timesheet-delete-popup',
  template: ''
})
export class CountryTimesheetDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ country }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(CountryTimesheetDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.country = country;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/country-timesheet', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/country-timesheet', { outlets: { popup: null } }]);
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
