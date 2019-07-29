/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { WeeklyWorkingHoursTimesheetDetailComponent } from 'app/entities/weekly-working-hours-timesheet/weekly-working-hours-timesheet-detail.component';
import { WeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';

describe('Component Tests', () => {
  describe('WeeklyWorkingHoursTimesheet Management Detail Component', () => {
    let comp: WeeklyWorkingHoursTimesheetDetailComponent;
    let fixture: ComponentFixture<WeeklyWorkingHoursTimesheetDetailComponent>;
    const route = ({ data: of({ weeklyWorkingHours: new WeeklyWorkingHoursTimesheet(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [WeeklyWorkingHoursTimesheetDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(WeeklyWorkingHoursTimesheetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(WeeklyWorkingHoursTimesheetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.weeklyWorkingHours).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
