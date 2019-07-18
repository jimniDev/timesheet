/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { ActivityTimesheetDetailComponent } from 'app/entities/activity-timesheet/activity-timesheet-detail.component';
import { ActivityTimesheet } from 'app/shared/model/activity-timesheet.model';

describe('Component Tests', () => {
  describe('ActivityTimesheet Management Detail Component', () => {
    let comp: ActivityTimesheetDetailComponent;
    let fixture: ComponentFixture<ActivityTimesheetDetailComponent>;
    const route = ({ data: of({ activity: new ActivityTimesheet(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [ActivityTimesheetDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ActivityTimesheetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ActivityTimesheetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.activity).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
