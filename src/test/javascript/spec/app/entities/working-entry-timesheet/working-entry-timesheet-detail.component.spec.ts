/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { WorkingEntryTimesheetDetailComponent } from 'app/entities/working-entry-timesheet/working-entry-timesheet-detail.component';
import { WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';

describe('Component Tests', () => {
  describe('WorkingEntryTimesheet Management Detail Component', () => {
    let comp: WorkingEntryTimesheetDetailComponent;
    let fixture: ComponentFixture<WorkingEntryTimesheetDetailComponent>;
    const route = ({ data: of({ workingEntry: new WorkingEntryTimesheet(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WorkingEntryTimesheetDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(WorkingEntryTimesheetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(WorkingEntryTimesheetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.workingEntry).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
