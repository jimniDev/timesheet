/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TimesheetTestModule } from '../../../test.module';
import { WorkingDayTimesheetComponent } from 'app/entities/working-day-timesheet/working-day-timesheet.component';
import { WorkingDayTimesheetService } from 'app/entities/working-day-timesheet/working-day-timesheet.service';
import { WorkingDayTimesheet } from 'app/shared/model/working-day-timesheet.model';

describe('Component Tests', () => {
  describe('WorkingDayTimesheet Management Component', () => {
    let comp: WorkingDayTimesheetComponent;
    let fixture: ComponentFixture<WorkingDayTimesheetComponent>;
    let service: WorkingDayTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WorkingDayTimesheetComponent],
        providers: []
      })
        .overrideTemplate(WorkingDayTimesheetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WorkingDayTimesheetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WorkingDayTimesheetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new WorkingDayTimesheet(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.workingDays[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
