import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { RoleTimesheetService } from './role-timesheet.service';

@Component({
  selector: 'jhi-role-timesheet-delete-dialog',
  templateUrl: './role-timesheet-delete-dialog.component.html'
})
export class RoleTimesheetDeleteDialogComponent {
  role: IRoleTimesheet;

  constructor(protected roleService: RoleTimesheetService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.roleService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'roleListModification',
        content: 'Deleted an role'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-role-timesheet-delete-popup',
  template: ''
})
export class RoleTimesheetDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ role }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(RoleTimesheetDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.role = role;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/role-timesheet', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/role-timesheet', { outlets: { popup: null } }]);
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
