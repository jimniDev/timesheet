/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { EmployeeTimesheetUpdateComponent } from 'app/entities/employee-timesheet/employee-timesheet-update.component';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet/employee-timesheet.service';
import { EmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';

describe('Component Tests', () => {
  describe('EmployeeTimesheet Management Update Component', () => {
    let comp: EmployeeTimesheetUpdateComponent;
    let fixture: ComponentFixture<EmployeeTimesheetUpdateComponent>;
    let service: EmployeeTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [EmployeeTimesheetUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(EmployeeTimesheetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmployeeTimesheetUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EmployeeTimesheetService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new EmployeeTimesheet(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new EmployeeTimesheet();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
