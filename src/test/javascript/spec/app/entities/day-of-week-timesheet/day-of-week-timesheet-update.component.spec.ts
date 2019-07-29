/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { DayOfWeekTimesheetUpdateComponent } from 'app/entities/day-of-week-timesheet/day-of-week-timesheet-update.component';
import { DayOfWeekTimesheetService } from 'app/entities/day-of-week-timesheet/day-of-week-timesheet.service';
import { DayOfWeekTimesheet } from 'app/shared/model/day-of-week-timesheet.model';

describe('Component Tests', () => {
  describe('DayOfWeekTimesheet Management Update Component', () => {
    let comp: DayOfWeekTimesheetUpdateComponent;
    let fixture: ComponentFixture<DayOfWeekTimesheetUpdateComponent>;
    let service: DayOfWeekTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [DayOfWeekTimesheetUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(DayOfWeekTimesheetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DayOfWeekTimesheetUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DayOfWeekTimesheetService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new DayOfWeekTimesheet(123);
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
        const entity = new DayOfWeekTimesheet();
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
