/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { EmployeeTimesheetDetailComponent } from 'app/entities/employee-timesheet/employee-timesheet-detail.component';
import { EmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';

describe('Component Tests', () => {
  describe('EmployeeTimesheet Management Detail Component', () => {
    let comp: EmployeeTimesheetDetailComponent;
    let fixture: ComponentFixture<EmployeeTimesheetDetailComponent>;
    const route = ({ data: of({ employee: new EmployeeTimesheet(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [EmployeeTimesheetDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(EmployeeTimesheetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EmployeeTimesheetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.employee).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
