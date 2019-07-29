/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TimesheetTestModule } from '../../../test.module';
import { WorkBreakTimesheetComponent } from 'app/entities/work-break-timesheet/work-break-timesheet.component';
import { WorkBreakTimesheetService } from 'app/entities/work-break-timesheet/work-break-timesheet.service';
import { WorkBreakTimesheet } from 'app/shared/model/work-break-timesheet.model';

describe('Component Tests', () => {
  describe('WorkBreakTimesheet Management Component', () => {
    let comp: WorkBreakTimesheetComponent;
    let fixture: ComponentFixture<WorkBreakTimesheetComponent>;
    let service: WorkBreakTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WorkBreakTimesheetComponent],
        providers: []
      })
        .overrideTemplate(WorkBreakTimesheetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WorkBreakTimesheetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WorkBreakTimesheetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new WorkBreakTimesheet(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.workBreaks[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
