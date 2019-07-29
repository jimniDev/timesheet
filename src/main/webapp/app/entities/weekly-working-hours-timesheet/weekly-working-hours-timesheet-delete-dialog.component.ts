import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IWeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';
import { WeeklyWorkingHoursTimesheetService } from './weekly-working-hours-timesheet.service';

@Component({
  selector: 'jhi-weekly-working-hours-timesheet-delete-dialog',
  templateUrl: './weekly-working-hours-timesheet-delete-dialog.component.html'
})
export class WeeklyWorkingHoursTimesheetDeleteDialogComponent {
  weeklyWorkingHours: IWeeklyWorkingHoursTimesheet;

  constructor(
    protected weeklyWorkingHoursService: WeeklyWorkingHoursTimesheetService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.weeklyWorkingHoursService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'weeklyWorkingHoursListModification',
        content: 'Deleted an weeklyWorkingHours'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-weekly-working-hours-timesheet-delete-popup',
  template: ''
})
export class WeeklyWorkingHoursTimesheetDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ weeklyWorkingHours }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(WeeklyWorkingHoursTimesheetDeleteDialogComponent as Component, {
          size: 'lg',
          backdrop: 'static'
        });
        this.ngbModalRef.componentInstance.weeklyWorkingHours = weeklyWorkingHours;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/weekly-working-hours-timesheet', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/weekly-working-hours-timesheet', { outlets: { popup: null } }]);
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
