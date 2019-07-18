/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TimesheetTestModule } from '../../../test.module';
import { CountryTimesheetComponent } from 'app/entities/country-timesheet/country-timesheet.component';
import { CountryTimesheetService } from 'app/entities/country-timesheet/country-timesheet.service';
import { CountryTimesheet } from 'app/shared/model/country-timesheet.model';

describe('Component Tests', () => {
  describe('CountryTimesheet Management Component', () => {
    let comp: CountryTimesheetComponent;
    let fixture: ComponentFixture<CountryTimesheetComponent>;
    let service: CountryTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [CountryTimesheetComponent],
        providers: []
      })
        .overrideTemplate(CountryTimesheetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CountryTimesheetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CountryTimesheetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new CountryTimesheet(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.countries[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
