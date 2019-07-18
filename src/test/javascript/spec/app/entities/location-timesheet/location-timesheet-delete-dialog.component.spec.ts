/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TimesheetTestModule } from '../../../test.module';
import { LocationTimesheetDeleteDialogComponent } from 'app/entities/location-timesheet/location-timesheet-delete-dialog.component';
import { LocationTimesheetService } from 'app/entities/location-timesheet/location-timesheet.service';

describe('Component Tests', () => {
  describe('LocationTimesheet Management Delete Component', () => {
    let comp: LocationTimesheetDeleteDialogComponent;
    let fixture: ComponentFixture<LocationTimesheetDeleteDialogComponent>;
    let service: LocationTimesheetService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [LocationTimesheetDeleteDialogComponent]
      })
        .overrideTemplate(LocationTimesheetDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LocationTimesheetDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(LocationTimesheetService);
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
