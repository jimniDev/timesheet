/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TimesheetTestModule } from '../../../test.module';
import { WorkingEntryTimesheetComponent } from 'app/entities/working-entry-timesheet/working-entry-timesheet.component';
import { WorkingEntryTimesheetService } from 'app/entities/working-entry-timesheet/working-entry-timesheet.service';
import { WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';

describe('Component Tests', () => {
  describe('WorkingEntryTimesheet Management Component', () => {
    let comp: WorkingEntryTimesheetComponent;
    let fixture: ComponentFixture<WorkingEntryTimesheetComponent>;
    let service: WorkingEntryTimesheetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WorkingEntryTimesheetComponent],
        providers: []
      })
        .overrideTemplate(WorkingEntryTimesheetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(WorkingEntryTimesheetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(WorkingEntryTimesheetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new WorkingEntryTimesheet(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.workingEntries[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
