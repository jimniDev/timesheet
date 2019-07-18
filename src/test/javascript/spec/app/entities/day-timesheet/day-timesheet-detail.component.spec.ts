/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { DayTimesheetDetailComponent } from 'app/entities/day-timesheet/day-timesheet-detail.component';
import { DayTimesheet } from 'app/shared/model/day-timesheet.model';

describe('Component Tests', () => {
  describe('DayTimesheet Management Detail Component', () => {
    let comp: DayTimesheetDetailComponent;
    let fixture: ComponentFixture<DayTimesheetDetailComponent>;
    const route = ({ data: of({ day: new DayTimesheet(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [DayTimesheetDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(DayTimesheetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DayTimesheetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.day).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
