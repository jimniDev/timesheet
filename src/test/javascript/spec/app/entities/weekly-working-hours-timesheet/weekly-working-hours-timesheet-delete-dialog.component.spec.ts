/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TimesheetTestModule } from '../../../test.module';
import { WeeklyWorkingHoursTimesheetDeleteDialogComponent } from 'app/entities/weekly-working-hours-timesheet/weekly-working-hours-timesheet-delete-dialog.component';
import { WeeklyWorkingHoursTimesheetService } from 'app/entities/weekly-working-hours-timesheet/weekly-working-hours-timesheet.service';

describe('Component Tests', () => {
  describe('WeeklyWorkingHoursTimesheet Management Delete Component', () => {
    let comp: WeeklyWorkingHoursTimesheetDeleteDialogComponent;
    let fixture: ComponentFixture<WeeklyWorkingHoursTimesheetDeleteDialogComponent>;
    let service: WeeklyWorkingHoursTimesheetService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WeeklyWorkingHoursTimesheetDeleteDialogComponent]
      })
        .overrideTemplate(WeeklyWorkingHoursTimesheetDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(WeeklyWorkingHoursTimesheetDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WeeklyWorkingHoursTimesheetService);
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
