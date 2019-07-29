/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TimesheetTestModule } from '../../../test.module';
import { WeeklyWorkingHoursTimesheetComponent } from 'app/entities/weekly-working-hours-timesheet/weekly-working-hours-timesheet.component';
import { WeeklyWorkingHoursTimesheetService } from 'app/entities/weekly-working-hours-timesheet/weekly-working-hours-timesheet.service';
import { WeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';

describe('Component Tests', () => {
  describe('WeeklyWorkingHoursTimesheet Management Component', () => {
    let comp: WeeklyWorkingHoursTimesheetComponent;
    let fixture: ComponentFixture<WeeklyWorkingHoursTimesheetComponent>;
    let service: WeeklyWorkingHoursTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WeeklyWorkingHoursTimesheetComponent],
        providers: []
      })
        .overrideTemplate(WeeklyWorkingHoursTimesheetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WeeklyWorkingHoursTimesheetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WeeklyWorkingHoursTimesheetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new WeeklyWorkingHoursTimesheet(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.weeklyWorkingHours[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
