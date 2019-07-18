/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { DayTimesheetUpdateComponent } from 'app/entities/day-timesheet/day-timesheet-update.component';
import { DayTimesheetService } from 'app/entities/day-timesheet/day-timesheet.service';
import { DayTimesheet } from 'app/shared/model/day-timesheet.model';

describe('Component Tests', () => {
  describe('DayTimesheet Management Update Component', () => {
    let comp: DayTimesheetUpdateComponent;
    let fixture: ComponentFixture<DayTimesheetUpdateComponent>;
    let service: DayTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [DayTimesheetUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(DayTimesheetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DayTimesheetUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DayTimesheetService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new DayTimesheet(123);
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
        const entity = new DayTimesheet();
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
