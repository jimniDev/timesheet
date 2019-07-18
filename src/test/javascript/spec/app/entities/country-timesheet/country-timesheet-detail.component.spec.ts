/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TimesheetTestModule } from '../../../test.module';
import { CountryTimesheetDetailComponent } from 'app/entities/country-timesheet/country-timesheet-detail.component';
import { CountryTimesheet } from 'app/shared/model/country-timesheet.model';

describe('Component Tests', () => {
  describe('CountryTimesheet Management Detail Component', () => {
    let comp: CountryTimesheetDetailComponent;
    let fixture: ComponentFixture<CountryTimesheetDetailComponent>;
    const route = ({ data: of({ country: new CountryTimesheet(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TimesheetTestModule],
        declarations: [CountryTimesheetDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CountryTimesheetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CountryTimesheetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.country).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
