/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { WorkDayTimesheetDetailComponent } from 'app/entities/work-day-timesheet/work-day-timesheet-detail.component';
import { WorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';

describe('Component Tests', () => {
  describe('WorkDayTimesheet Management Detail Component', () => {
    let comp: WorkDayTimesheetDetailComponent;
    let fixture: ComponentFixture<WorkDayTimesheetDetailComponent>;
    const route = ({ data: of({ workDay: new WorkDayTimesheet(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WorkDayTimesheetDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(WorkDayTimesheetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(WorkDayTimesheetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.workDay).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
