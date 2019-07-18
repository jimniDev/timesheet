/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TimesheetTestModule } from '../../../test.module';
import { EmployeeTimesheetDeleteDialogComponent } from 'app/entities/employee-timesheet/employee-timesheet-delete-dialog.component';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet/employee-timesheet.service';

describe('Component Tests', () => {
  describe('EmployeeTimesheet Management Delete Component', () => {
    let comp: EmployeeTimesheetDeleteDialogComponent;
    let fixture: ComponentFixture<EmployeeTimesheetDeleteDialogComponent>;
    let service: EmployeeTimesheetService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [EmployeeTimesheetDeleteDialogComponent]
      })
        .overrideTemplate(EmployeeTimesheetDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EmployeeTimesheetDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EmployeeTimesheetService);
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
