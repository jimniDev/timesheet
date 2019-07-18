/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TimesheetTestModule } from '../../../test.module';
import { EmployeeTimesheetComponent } from 'app/entities/employee-timesheet/employee-timesheet.component';
import { EmployeeTimesheetService } from 'app/entities/employee-timesheet/employee-timesheet.service';
import { EmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';

describe('Component Tests', () => {
  describe('EmployeeTimesheet Management Component', () => {
    let comp: EmployeeTimesheetComponent;
    let fixture: ComponentFixture<EmployeeTimesheetComponent>;
    let service: EmployeeTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [EmployeeTimesheetComponent],
        providers: []
      })
        .overrideTemplate(EmployeeTimesheetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmployeeTimesheetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EmployeeTimesheetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new EmployeeTimesheet(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.employees[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
