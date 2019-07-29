/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { TargetWorkingDayTimesheetUpdateComponent } from 'app/entities/target-working-day-timesheet/target-working-day-timesheet-update.component';
import { TargetWorkingDayTimesheetService } from 'app/entities/target-working-day-timesheet/target-working-day-timesheet.service';
import { TargetWorkingDayTimesheet } from 'app/shared/model/target-working-day-timesheet.model';

describe('Component Tests', () => {
  describe('TargetWorkingDayTimesheet Management Update Component', () => {
    let comp: TargetWorkingDayTimesheetUpdateComponent;
    let fixture: ComponentFixture<TargetWorkingDayTimesheetUpdateComponent>;
    let service: TargetWorkingDayTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [TargetWorkingDayTimesheetUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(TargetWorkingDayTimesheetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TargetWorkingDayTimesheetUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TargetWorkingDayTimesheetService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new TargetWorkingDayTimesheet(123);
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
        const entity = new TargetWorkingDayTimesheet();
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
