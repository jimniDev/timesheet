/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { WorkDayTimesheetUpdateComponent } from 'app/entities/work-day-timesheet/work-day-timesheet-update.component';
import { WorkDayTimesheetService } from 'app/entities/work-day-timesheet/work-day-timesheet.service';
import { WorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';

describe('Component Tests', () => {
  describe('WorkDayTimesheet Management Update Component', () => {
    let comp: WorkDayTimesheetUpdateComponent;
    let fixture: ComponentFixture<WorkDayTimesheetUpdateComponent>;
    let service: WorkDayTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WorkDayTimesheetUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(WorkDayTimesheetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WorkDayTimesheetUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WorkDayTimesheetService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new WorkDayTimesheet(123);
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
        const entity = new WorkDayTimesheet();
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
