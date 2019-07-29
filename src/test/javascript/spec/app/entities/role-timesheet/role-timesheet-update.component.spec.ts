/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { RoleTimesheetUpdateComponent } from 'app/entities/role-timesheet/role-timesheet-update.component';
import { RoleTimesheetService } from 'app/entities/role-timesheet/role-timesheet.service';
import { RoleTimesheet } from 'app/shared/model/role-timesheet.model';

describe('Component Tests', () => {
  describe('RoleTimesheet Management Update Component', () => {
    let comp: RoleTimesheetUpdateComponent;
    let fixture: ComponentFixture<RoleTimesheetUpdateComponent>;
    let service: RoleTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [RoleTimesheetUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(RoleTimesheetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RoleTimesheetUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(RoleTimesheetService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new RoleTimesheet(123);
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
        const entity = new RoleTimesheet();
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
