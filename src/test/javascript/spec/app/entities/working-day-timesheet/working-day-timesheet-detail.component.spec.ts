/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { WorkingDayTimesheetDetailComponent } from 'app/entities/working-day-timesheet/working-day-timesheet-detail.component';
import { WorkingDayTimesheet } from 'app/shared/model/working-day-timesheet.model';

describe('Component Tests', () => {
  describe('WorkingDayTimesheet Management Detail Component', () => {
    let comp: WorkingDayTimesheetDetailComponent;
    let fixture: ComponentFixture<WorkingDayTimesheetDetailComponent>;
    const route = ({ data: of({ workingDay: new WorkingDayTimesheet(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WorkingDayTimesheetDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(WorkingDayTimesheetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(WorkingDayTimesheetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.workingDay).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
