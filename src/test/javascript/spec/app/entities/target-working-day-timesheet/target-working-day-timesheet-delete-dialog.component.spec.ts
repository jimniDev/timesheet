/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TimesheetTestModule } from '../../../test.module';
import { TargetWorkingDayTimesheetDeleteDialogComponent } from 'app/entities/target-working-day-timesheet/target-working-day-timesheet-delete-dialog.component';
import { TargetWorkingDayTimesheetService } from 'app/entities/target-working-day-timesheet/target-working-day-timesheet.service';

describe('Component Tests', () => {
  describe('TargetWorkingDayTimesheet Management Delete Component', () => {
    let comp: TargetWorkingDayTimesheetDeleteDialogComponent;
    let fixture: ComponentFixture<TargetWorkingDayTimesheetDeleteDialogComponent>;
    let service: TargetWorkingDayTimesheetService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [TargetWorkingDayTimesheetDeleteDialogComponent]
      })
        .overrideTemplate(TargetWorkingDayTimesheetDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TargetWorkingDayTimesheetDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TargetWorkingDayTimesheetService);
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
