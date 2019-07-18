/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { WorkingDayTimesheetUpdateComponent } from 'app/entities/working-day-timesheet/working-day-timesheet-update.component';
import { WorkingDayTimesheetService } from 'app/entities/working-day-timesheet/working-day-timesheet.service';
import { WorkingDayTimesheet } from 'app/shared/model/working-day-timesheet.model';

describe('Component Tests', () => {
  describe('WorkingDayTimesheet Management Update Component', () => {
    let comp: WorkingDayTimesheetUpdateComponent;
    let fixture: ComponentFixture<WorkingDayTimesheetUpdateComponent>;
    let service: WorkingDayTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WorkingDayTimesheetUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(WorkingDayTimesheetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WorkingDayTimesheetUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WorkingDayTimesheetService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new WorkingDayTimesheet(123);
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
        const entity = new WorkingDayTimesheet();
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
