/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { WeeklyWorkingHoursTimesheetUpdateComponent } from 'app/entities/weekly-working-hours-timesheet/weekly-working-hours-timesheet-update.component';
import { WeeklyWorkingHoursTimesheetService } from 'app/entities/weekly-working-hours-timesheet/weekly-working-hours-timesheet.service';
import { WeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';

describe('Component Tests', () => {
  describe('WeeklyWorkingHoursTimesheet Management Update Component', () => {
    let comp: WeeklyWorkingHoursTimesheetUpdateComponent;
    let fixture: ComponentFixture<WeeklyWorkingHoursTimesheetUpdateComponent>;
    let service: WeeklyWorkingHoursTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WeeklyWorkingHoursTimesheetUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(WeeklyWorkingHoursTimesheetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WeeklyWorkingHoursTimesheetUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WeeklyWorkingHoursTimesheetService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new WeeklyWorkingHoursTimesheet(123);
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
        const entity = new WeeklyWorkingHoursTimesheet();
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
