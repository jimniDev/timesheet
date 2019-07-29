/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { WorkBreakTimesheetDetailComponent } from 'app/entities/work-break-timesheet/work-break-timesheet-detail.component';
import { WorkBreakTimesheet } from 'app/shared/model/work-break-timesheet.model';

describe('Component Tests', () => {
  describe('WorkBreakTimesheet Management Detail Component', () => {
    let comp: WorkBreakTimesheetDetailComponent;
    let fixture: ComponentFixture<WorkBreakTimesheetDetailComponent>;
    const route = ({ data: of({ workBreak: new WorkBreakTimesheet(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WorkBreakTimesheetDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(WorkBreakTimesheetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(WorkBreakTimesheetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.workBreak).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
