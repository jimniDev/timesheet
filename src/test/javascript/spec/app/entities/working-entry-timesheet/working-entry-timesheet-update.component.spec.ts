/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { WorkingEntryTimesheetUpdateComponent } from 'app/entities/working-entry-timesheet/working-entry-timesheet-update.component';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet/working-entry-timesheet.service';
import { WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';

describe('Component Tests', () => {
  describe('WorkingEntryTimesheet Management Update Component', () => {
    let comp: WorkingEntryTimesheetUpdateComponent;
    let fixture: ComponentFixture<WorkingEntryTimesheetUpdateComponent>;
    let service: WorkingEntryTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WorkingEntryTimesheetUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(WorkingEntryTimesheetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WorkingEntryTimesheetUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WorkingEntryTimesheetService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new WorkingEntryTimesheet(123);
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
        const entity = new WorkingEntryTimesheet();
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
