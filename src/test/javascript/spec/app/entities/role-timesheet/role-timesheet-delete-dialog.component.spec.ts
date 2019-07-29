/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TimesheetTestModule } from '../../../test.module';
import { RoleTimesheetDeleteDialogComponent } from 'app/entities/role-timesheet/role-timesheet-delete-dialog.component';
import { RoleTimesheetService } from 'app/entities/role-timesheet/role-timesheet.service';

describe('Component Tests', () => {
  describe('RoleTimesheet Management Delete Component', () => {
    let comp: RoleTimesheetDeleteDialogComponent;
    let fixture: ComponentFixture<RoleTimesheetDeleteDialogComponent>;
    let service: RoleTimesheetService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [RoleTimesheetDeleteDialogComponent]
      })
        .overrideTemplate(RoleTimesheetDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RoleTimesheetDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(RoleTimesheetService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
