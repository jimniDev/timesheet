/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TimesheetTestModule } from '../../../test.module';
import { DayTimesheetDeleteDialogComponent } from 'app/entities/day-timesheet/day-timesheet-delete-dialog.component';
import { DayTimesheetService } from 'app/entities/day-timesheet/day-timesheet.service';

describe('Component Tests', () => {
  describe('DayTimesheet Management Delete Component', () => {
    let comp: DayTimesheetDeleteDialogComponent;
    let fixture: ComponentFixture<DayTimesheetDeleteDialogComponent>;
    let service: DayTimesheetService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [DayTimesheetDeleteDialogComponent]
      })
        .overrideTemplate(DayTimesheetDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DayTimesheetDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DayTimesheetService);
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
