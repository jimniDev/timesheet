/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { ActivityTimesheetUpdateComponent } from 'app/entities/activity-timesheet/activity-timesheet-update.component';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet/activity-timesheet.service';
import { ActivityTimesheet } from 'app/shared/model/activity-timesheet.model';

describe('Component Tests', () => {
  describe('ActivityTimesheet Management Update Component', () => {
    let comp: ActivityTimesheetUpdateComponent;
    let fixture: ComponentFixture<ActivityTimesheetUpdateComponent>;
    let service: ActivityTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [ActivityTimesheetUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ActivityTimesheetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ActivityTimesheetUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ActivityTimesheetService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ActivityTimesheet(123);
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
        const entity = new ActivityTimesheet();
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
