/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TimesheetTestModule } from '../../../test.module';
import { ActivityTimesheetComponent } from 'app/entities/activity-timesheet/activity-timesheet.component';
import { ActivityTimesheetService } from 'app/entities/activity-timesheet/activity-timesheet.service';
import { ActivityTimesheet } from 'app/shared/model/activity-timesheet.model';

describe('Component Tests', () => {
  describe('ActivityTimesheet Management Component', () => {
    let comp: ActivityTimesheetComponent;
    let fixture: ComponentFixture<ActivityTimesheetComponent>;
    let service: ActivityTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [ActivityTimesheetComponent],
        providers: []
      })
        .overrideTemplate(ActivityTimesheetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ActivityTimesheetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ActivityTimesheetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ActivityTimesheet(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.activities[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
