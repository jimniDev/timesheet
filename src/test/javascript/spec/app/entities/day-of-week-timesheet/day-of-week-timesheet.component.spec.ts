/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TimesheetTestModule } from '../../../test.module';
import { DayOfWeekTimesheetComponent } from 'app/entities/day-of-week-timesheet/day-of-week-timesheet.component';
import { DayOfWeekTimesheetService } from 'app/entities/day-of-week-timesheet/day-of-week-timesheet.service';
import { DayOfWeekTimesheet } from 'app/shared/model/day-of-week-timesheet.model';

describe('Component Tests', () => {
  describe('DayOfWeekTimesheet Management Component', () => {
    let comp: DayOfWeekTimesheetComponent;
    let fixture: ComponentFixture<DayOfWeekTimesheetComponent>;
    let service: DayOfWeekTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [DayOfWeekTimesheetComponent],
        providers: []
      })
        .overrideTemplate(DayOfWeekTimesheetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DayOfWeekTimesheetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DayOfWeekTimesheetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new DayOfWeekTimesheet(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.dayOfWeeks[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
