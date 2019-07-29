/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { DayOfWeekTimesheetDetailComponent } from 'app/entities/day-of-week-timesheet/day-of-week-timesheet-detail.component';
import { DayOfWeekTimesheet } from 'app/shared/model/day-of-week-timesheet.model';

describe('Component Tests', () => {
  describe('DayOfWeekTimesheet Management Detail Component', () => {
    let comp: DayOfWeekTimesheetDetailComponent;
    let fixture: ComponentFixture<DayOfWeekTimesheetDetailComponent>;
    const route = ({ data: of({ dayOfWeek: new DayOfWeekTimesheet(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [DayOfWeekTimesheetDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(DayOfWeekTimesheetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DayOfWeekTimesheetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.dayOfWeek).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
