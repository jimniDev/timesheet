/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TimesheetTestModule } from '../../../test.module';
import { WorkingEntryTimesheetDeleteDialogComponent } from 'app/entities/working-entry-timesheet/working-entry-timesheet-delete-dialog.component';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet/working-entry-timesheet.service';

describe('Component Tests', () => {
  describe('WorkingEntryTimesheet Management Delete Component', () => {
    let comp: WorkingEntryTimesheetDeleteDialogComponent;
    let fixture: ComponentFixture<WorkingEntryTimesheetDeleteDialogComponent>;
    let service: WorkingEntryTimesheetService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WorkingEntryTimesheetDeleteDialogComponent]
      })
        .overrideTemplate(WorkingEntryTimesheetDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(WorkingEntryTimesheetDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WorkingEntryTimesheetService);
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
