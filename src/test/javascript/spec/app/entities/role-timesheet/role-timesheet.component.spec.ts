/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TimesheetTestModule } from '../../../test.module';
import { RoleTimesheetComponent } from 'app/entities/role-timesheet/role-timesheet.component';
import { RoleTimesheetService } from 'app/entities/role-timesheet/role-timesheet.service';
import { RoleTimesheet } from 'app/shared/model/role-timesheet.model';

describe('Component Tests', () => {
  describe('RoleTimesheet Management Component', () => {
    let comp: RoleTimesheetComponent;
    let fixture: ComponentFixture<RoleTimesheetComponent>;
    let service: RoleTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [RoleTimesheetComponent],
        providers: []
      })
        .overrideTemplate(RoleTimesheetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RoleTimesheetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(RoleTimesheetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new RoleTimesheet(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.roles[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
