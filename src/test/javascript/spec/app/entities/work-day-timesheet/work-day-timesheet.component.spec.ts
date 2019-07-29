/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TimesheetTestModule } from '../../../test.module';
import { WorkDayTimesheetComponent } from 'app/entities/work-day-timesheet/work-day-timesheet.component';
import { WorkDayTimesheetService } from 'app/entities/work-day-timesheet/work-day-timesheet.service';
import { WorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';

describe('Component Tests', () => {
  describe('WorkDayTimesheet Management Component', () => {
    let comp: WorkDayTimesheetComponent;
    let fixture: ComponentFixture<WorkDayTimesheetComponent>;
    let service: WorkDayTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WorkDayTimesheetComponent],
        providers: []
      })
        .overrideTemplate(WorkDayTimesheetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WorkDayTimesheetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WorkDayTimesheetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new WorkDayTimesheet(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.workDays[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
