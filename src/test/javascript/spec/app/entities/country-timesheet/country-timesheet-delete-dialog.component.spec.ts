/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TimesheetTestModule } from '../../../test.module';
import { CountryTimesheetDeleteDialogComponent } from 'app/entities/country-timesheet/country-timesheet-delete-dialog.component';
import { CountryTimesheetService } from 'app/entities/country-timesheet/country-timesheet.service';

describe('Component Tests', () => {
  describe('CountryTimesheet Management Delete Component', () => {
    let comp: CountryTimesheetDeleteDialogComponent;
    let fixture: ComponentFixture<CountryTimesheetDeleteDialogComponent>;
    let service: CountryTimesheetService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [CountryTimesheetDeleteDialogComponent]
      })
        .overrideTemplate(CountryTimesheetDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CountryTimesheetDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CountryTimesheetService);
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
