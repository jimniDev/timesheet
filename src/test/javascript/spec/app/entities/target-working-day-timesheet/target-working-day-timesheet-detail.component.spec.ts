/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { TargetWorkingDayTimesheetDetailComponent } from 'app/entities/target-working-day-timesheet/target-working-day-timesheet-detail.component';
import { TargetWorkingDayTimesheet } from 'app/shared/model/target-working-day-timesheet.model';

describe('Component Tests', () => {
  describe('TargetWorkingDayTimesheet Management Detail Component', () => {
    let comp: TargetWorkingDayTimesheetDetailComponent;
    let fixture: ComponentFixture<TargetWorkingDayTimesheetDetailComponent>;
    const route = ({ data: of({ targetWorkingDay: new TargetWorkingDayTimesheet(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [TargetWorkingDayTimesheetDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(TargetWorkingDayTimesheetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TargetWorkingDayTimesheetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.targetWorkingDay).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
