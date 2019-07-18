/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TimesheetTestModule } from '../../../test.module';
import { DayTimesheetComponent } from 'app/entities/day-timesheet/day-timesheet.component';
import { DayTimesheetService } from 'app/entities/day-timesheet/day-timesheet.service';
import { DayTimesheet } from 'app/shared/model/day-timesheet.model';

describe('Component Tests', () => {
  describe('DayTimesheet Management Component', () => {
    let comp: DayTimesheetComponent;
    let fixture: ComponentFixture<DayTimesheetComponent>;
    let service: DayTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [DayTimesheetComponent],
        providers: []
      })
        .overrideTemplate(DayTimesheetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DayTimesheetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DayTimesheetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new DayTimesheet(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.days[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
