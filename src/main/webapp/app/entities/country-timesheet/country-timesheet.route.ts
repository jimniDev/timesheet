import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CountryTimesheet } from 'app/shared/model/country-timesheet.model';
import { CountryTimesheetService } from './country-timesheet.service';
import { CountryTimesheetComponent } from './country-timesheet.component';
import { CountryTimesheetDetailComponent } from './country-timesheet-detail.component';
import { CountryTimesheetUpdateComponent } from './country-timesheet-update.component';
import { CountryTimesheetDeletePopupComponent } from './country-timesheet-delete-dialog.component';
import { ICountryTimesheet } from 'app/shared/model/country-timesheet.model';

@Injectable({ providedIn: 'root' })
export class CountryTimesheetResolve implements Resolve<ICountryTimesheet> {
  constructor(private service: CountryTimesheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICountryTimesheet> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<CountryTimesheet>) => response.ok),
        map((country: HttpResponse<CountryTimesheet>) => country.body)
      );
    }
    return of(new CountryTimesheet());
  }
}

export const countryRoute: Routes = [
  {
    path: '',
    component: CountryTimesheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.country.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CountryTimesheetDetailComponent,
    resolve: {
      country: CountryTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.country.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CountryTimesheetUpdateComponent,
    resolve: {
      country: CountryTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.country.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CountryTimesheetUpdateComponent,
    resolve: {
      country: CountryTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.country.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const countryPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CountryTimesheetDeletePopupComponent,
    resolve: {
      country: CountryTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.country.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
