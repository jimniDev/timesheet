import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LocationTimesheet } from 'app/shared/model/location-timesheet.model';
import { LocationTimesheetService } from './location-timesheet.service';
import { LocationTimesheetComponent } from './location-timesheet.component';
import { LocationTimesheetDetailComponent } from './location-timesheet-detail.component';
import { LocationTimesheetUpdateComponent } from './location-timesheet-update.component';
import { LocationTimesheetDeletePopupComponent } from './location-timesheet-delete-dialog.component';
import { ILocationTimesheet } from 'app/shared/model/location-timesheet.model';

@Injectable({ providedIn: 'root' })
export class LocationTimesheetResolve implements Resolve<ILocationTimesheet> {
  constructor(private service: LocationTimesheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ILocationTimesheet> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<LocationTimesheet>) => response.ok),
        map((location: HttpResponse<LocationTimesheet>) => location.body)
      );
    }
    return of(new LocationTimesheet());
  }
}

export const locationRoute: Routes = [
  {
    path: '',
    component: LocationTimesheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.location.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: LocationTimesheetDetailComponent,
    resolve: {
      location: LocationTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.location.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: LocationTimesheetUpdateComponent,
    resolve: {
      location: LocationTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.location.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: LocationTimesheetUpdateComponent,
    resolve: {
      location: LocationTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.location.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const locationPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: LocationTimesheetDeletePopupComponent,
    resolve: {
      location: LocationTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.location.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
