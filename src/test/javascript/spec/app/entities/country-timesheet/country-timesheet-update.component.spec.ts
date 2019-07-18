/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { CountryTimesheetUpdateComponent } from 'app/entities/country-timesheet/country-timesheet-update.component';
import { CountryTimesheetService } from 'app/entities/country-timesheet/country-timesheet.service';
import { CountryTimesheet } from 'app/shared/model/country-timesheet.model';

describe('Component Tests', () => {
  describe('CountryTimesheet Management Update Component', () => {
    let comp: CountryTimesheetUpdateComponent;
    let fixture: ComponentFixture<CountryTimesheetUpdateComponent>;
    let service: CountryTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [CountryTimesheetUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CountryTimesheetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CountryTimesheetUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CountryTimesheetService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new CountryTimesheet(123);
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
        const entity = new CountryTimesheet();
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
