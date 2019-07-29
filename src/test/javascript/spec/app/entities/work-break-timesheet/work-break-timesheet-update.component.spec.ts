/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { WorkBreakTimesheetUpdateComponent } from 'app/entities/work-break-timesheet/work-break-timesheet-update.component';
import { WorkBreakTimesheetService } from 'app/entities/work-break-timesheet/work-break-timesheet.service';
import { WorkBreakTimesheet } from 'app/shared/model/work-break-timesheet.model';

describe('Component Tests', () => {
  describe('WorkBreakTimesheet Management Update Component', () => {
    let comp: WorkBreakTimesheetUpdateComponent;
    let fixture: ComponentFixture<WorkBreakTimesheetUpdateComponent>;
    let service: WorkBreakTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WorkBreakTimesheetUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(WorkBreakTimesheetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WorkBreakTimesheetUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WorkBreakTimesheetService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new WorkBreakTimesheet(123);
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
        const entity = new WorkBreakTimesheet();
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
