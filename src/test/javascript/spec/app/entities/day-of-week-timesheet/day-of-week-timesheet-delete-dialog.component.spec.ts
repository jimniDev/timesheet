/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TimesheetTestModule } from '../../../test.module';
import { DayOfWeekTimesheetDeleteDialogComponent } from 'app/entities/day-of-week-timesheet/day-of-week-timesheet-delete-dialog.component';
import { DayOfWeekTimesheetService } from 'app/entities/day-of-week-timesheet/day-of-week-timesheet.service';

describe('Component Tests', () => {
  describe('DayOfWeekTimesheet Management Delete Component', () => {
    let comp: DayOfWeekTimesheetDeleteDialogComponent;
    let fixture: ComponentFixture<DayOfWeekTimesheetDeleteDialogComponent>;
    let service: DayOfWeekTimesheetService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [DayOfWeekTimesheetDeleteDialogComponent]
      })
        .overrideTemplate(DayOfWeekTimesheetDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DayOfWeekTimesheetDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DayOfWeekTimesheetService);
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
