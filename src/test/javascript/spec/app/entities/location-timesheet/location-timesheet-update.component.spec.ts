/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { LocationTimesheetUpdateComponent } from 'app/entities/location-timesheet/location-timesheet-update.component';
import { LocationTimesheetService } from 'app/entities/location-timesheet/location-timesheet.service';
import { LocationTimesheet } from 'app/shared/model/location-timesheet.model';

describe('Component Tests', () => {
  describe('LocationTimesheet Management Update Component', () => {
    let comp: LocationTimesheetUpdateComponent;
    let fixture: ComponentFixture<LocationTimesheetUpdateComponent>;
    let service: LocationTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [LocationTimesheetUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(LocationTimesheetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LocationTimesheetUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(LocationTimesheetService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new LocationTimesheet(123);
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
        const entity = new LocationTimesheet();
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
