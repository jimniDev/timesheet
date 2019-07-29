import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DayOfWeekTimesheet } from 'app/shared/model/day-of-week-timesheet.model';
import { DayOfWeekTimesheetService } from './day-of-week-timesheet.service';
import { DayOfWeekTimesheetComponent } from './day-of-week-timesheet.component';
import { DayOfWeekTimesheetDetailComponent } from './day-of-week-timesheet-detail.component';
import { DayOfWeekTimesheetUpdateComponent } from './day-of-week-timesheet-update.component';
import { DayOfWeekTimesheetDeletePopupComponent } from './day-of-week-timesheet-delete-dialog.component';
import { IDayOfWeekTimesheet } from 'app/shared/model/day-of-week-timesheet.model';

@Injectable({ providedIn: 'root' })
export class DayOfWeekTimesheetResolve implements Resolve<IDayOfWeekTimesheet> {
  constructor(private service: DayOfWeekTimesheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDayOfWeekTimesheet> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<DayOfWeekTimesheet>) => response.ok),
        map((dayOfWeek: HttpResponse<DayOfWeekTimesheet>) => dayOfWeek.body)
      );
    }
    return of(new DayOfWeekTimesheet());
  }
}

export const dayOfWeekRoute: Routes = [
  {
    path: '',
    component: DayOfWeekTimesheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.dayOfWeek.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: DayOfWeekTimesheetDetailComponent,
    resolve: {
      dayOfWeek: DayOfWeekTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.dayOfWeek.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: DayOfWeekTimesheetUpdateComponent,
    resolve: {
      dayOfWeek: DayOfWeekTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.dayOfWeek.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: DayOfWeekTimesheetUpdateComponent,
    resolve: {
      dayOfWeek: DayOfWeekTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.dayOfWeek.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const dayOfWeekPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: DayOfWeekTimesheetDeletePopupComponent,
    resolve: {
      dayOfWeek: DayOfWeekTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.dayOfWeek.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
