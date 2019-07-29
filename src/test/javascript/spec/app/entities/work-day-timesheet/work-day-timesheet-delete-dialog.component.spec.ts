/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TimesheetTestModule } from '../../../test.module';
import { WorkDayTimesheetDeleteDialogComponent } from 'app/entities/work-day-timesheet/work-day-timesheet-delete-dialog.component';
import { WorkDayTimesheetService } from 'app/entities/work-day-timesheet/work-day-timesheet.service';

describe('Component Tests', () => {
  describe('WorkDayTimesheet Management Delete Component', () => {
    let comp: WorkDayTimesheetDeleteDialogComponent;
    let fixture: ComponentFixture<WorkDayTimesheetDeleteDialogComponent>;
    let service: WorkDayTimesheetService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WorkDayTimesheetDeleteDialogComponent]
      })
        .overrideTemplate(WorkDayTimesheetDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(WorkDayTimesheetDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WorkDayTimesheetService);
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
