/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TimesheetTestModule } from '../../../test.module';
import { LocationTimesheetComponent } from 'app/entities/location-timesheet/location-timesheet.component';
import { LocationTimesheetService } from 'app/entities/location-timesheet/location-timesheet.service';
import { LocationTimesheet } from 'app/shared/model/location-timesheet.model';

describe('Component Tests', () => {
  describe('LocationTimesheet Management Component', () => {
    let comp: LocationTimesheetComponent;
    let fixture: ComponentFixture<LocationTimesheetComponent>;
    let service: LocationTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [LocationTimesheetComponent],
        providers: []
      })
        .overrideTemplate(LocationTimesheetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LocationTimesheetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(LocationTimesheetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new LocationTimesheet(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.locations[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
