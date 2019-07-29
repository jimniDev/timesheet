/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { RoleTimesheetDetailComponent } from 'app/entities/role-timesheet/role-timesheet-detail.component';
import { RoleTimesheet } from 'app/shared/model/role-timesheet.model';

describe('Component Tests', () => {
  describe('RoleTimesheet Management Detail Component', () => {
    let comp: RoleTimesheetDetailComponent;
    let fixture: ComponentFixture<RoleTimesheetDetailComponent>;
    const route = ({ data: of({ role: new RoleTimesheet(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [RoleTimesheetDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(RoleTimesheetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RoleTimesheetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.role).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
