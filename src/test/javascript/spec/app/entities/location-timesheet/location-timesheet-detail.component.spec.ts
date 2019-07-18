/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { LocationTimesheetDetailComponent } from 'app/entities/location-timesheet/location-timesheet-detail.component';
import { LocationTimesheet } from 'app/shared/model/location-timesheet.model';

describe('Component Tests', () => {
  describe('LocationTimesheet Management Detail Component', () => {
    let comp: LocationTimesheetDetailComponent;
    let fixture: ComponentFixture<LocationTimesheetDetailComponent>;
    const route = ({ data: of({ location: new LocationTimesheet(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [LocationTimesheetDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(LocationTimesheetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LocationTimesheetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.location).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
