/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TimesheetTestModule } from '../../../test.module';
import { WorkBreakTimesheetDeleteDialogComponent } from 'app/entities/work-break-timesheet/work-break-timesheet-delete-dialog.component';
import { WorkBreakTimesheetService } from 'app/entities/work-break-timesheet/work-break-timesheet.service';

describe('Component Tests', () => {
  describe('WorkBreakTimesheet Management Delete Component', () => {
    let comp: WorkBreakTimesheetDeleteDialogComponent;
    let fixture: ComponentFixture<WorkBreakTimesheetDeleteDialogComponent>;
    let service: WorkBreakTimesheetService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WorkBreakTimesheetDeleteDialogComponent]
      })
        .overrideTemplate(WorkBreakTimesheetDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(WorkBreakTimesheetDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WorkBreakTimesheetService);
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
