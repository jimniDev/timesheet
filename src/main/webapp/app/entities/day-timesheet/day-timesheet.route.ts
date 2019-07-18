import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DayTimesheet } from 'app/shared/model/day-timesheet.model';
import { DayTimesheetService } from './day-timesheet.service';
import { DayTimesheetComponent } from './day-timesheet.component';
import { DayTimesheetDetailComponent } from './day-timesheet-detail.component';
import { DayTimesheetUpdateComponent } from './day-timesheet-update.component';
import { DayTimesheetDeletePopupComponent } from './day-timesheet-delete-dialog.component';
import { IDayTimesheet } from 'app/shared/model/day-timesheet.model';

@Injectable({ providedIn: 'root' })
export class DayTimesheetResolve implements Resolve<IDayTimesheet> {
  constructor(private service: DayTimesheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDayTimesheet> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<DayTimesheet>) => response.ok),
        map((day: HttpResponse<DayTimesheet>) => day.body)
      );
    }
    return of(new DayTimesheet());
  }
}

export const dayRoute: Routes = [
  {
    path: '',
    component: DayTimesheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.day.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: DayTimesheetDetailComponent,
    resolve: {
      day: DayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.day.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: DayTimesheetUpdateComponent,
    resolve: {
      day: DayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.day.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: DayTimesheetUpdateComponent,
    resolve: {
      day: DayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.day.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const dayPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: DayTimesheetDeletePopupComponent,
    resolve: {
      day: DayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.day.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
