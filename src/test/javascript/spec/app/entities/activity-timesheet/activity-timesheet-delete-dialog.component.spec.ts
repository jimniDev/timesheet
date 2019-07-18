/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TimesheetTestModule } from '../../../test.module';
import { ActivityTimesheetDeleteDialogComponent } from 'app/entities/activity-timesheet/activity-timesheet-delete-dialog.component';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet/activity-timesheet.service';

describe('Component Tests', () => {
  describe('ActivityTimesheet Management Delete Component', () => {
    let comp: ActivityTimesheetDeleteDialogComponent;
    let fixture: ComponentFixture<ActivityTimesheetDeleteDialogComponent>;
    let service: ActivityTimesheetService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [ActivityTimesheetDeleteDialogComponent]
      })
        .overrideTemplate(ActivityTimesheetDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ActivityTimesheetDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ActivityTimesheetService);
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
