/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TimesheetTestModule } from '../../../test.module';
import { TargetWorkingDayTimesheetComponent } from 'app/entities/target-working-day-timesheet/target-working-day-timesheet.component';
import { TargetWorkingDayTimesheetService } from 'app/entities/target-working-day-timesheet/target-working-day-timesheet.service';
import { TargetWorkingDayTimesheet } from 'app/shared/model/target-working-day-timesheet.model';

describe('Component Tests', () => {
  describe('TargetWorkingDayTimesheet Management Component', () => {
    let comp: TargetWorkingDayTimesheetComponent;
    let fixture: ComponentFixture<TargetWorkingDayTimesheetComponent>;
    let service: TargetWorkingDayTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [TargetWorkingDayTimesheetComponent],
        providers: []
      })
        .overrideTemplate(TargetWorkingDayTimesheetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TargetWorkingDayTimesheetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(TargetWorkingDayTimesheetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new TargetWorkingDayTimesheet(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.targetWorkingDays[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
