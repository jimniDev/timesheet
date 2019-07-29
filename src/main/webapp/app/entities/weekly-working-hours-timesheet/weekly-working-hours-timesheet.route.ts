import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';
import { WeeklyWorkingHoursTimesheetService } from './weekly-working-hours-timesheet.service';
import { WeeklyWorkingHoursTimesheetComponent } from './weekly-working-hours-timesheet.component';
import { WeeklyWorkingHoursTimesheetDetailComponent } from './weekly-working-hours-timesheet-detail.component';
import { WeeklyWorkingHoursTimesheetUpdateComponent } from './weekly-working-hours-timesheet-update.component';
import { WeeklyWorkingHoursTimesheetDeletePopupComponent } from './weekly-working-hours-timesheet-delete-dialog.component';
import { IWeeklyWorkingHoursTimesheet } from 'app/shared/model/weekly-working-hours-timesheet.model';

@Injectable({ providedIn: 'root' })
export class WeeklyWorkingHoursTimesheetResolve implements Resolve<IWeeklyWorkingHoursTimesheet> {
  constructor(private service: WeeklyWorkingHoursTimesheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IWeeklyWorkingHoursTimesheet> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<WeeklyWorkingHoursTimesheet>) => response.ok),
        map((weeklyWorkingHours: HttpResponse<WeeklyWorkingHoursTimesheet>) => weeklyWorkingHours.body)
      );
    }
    return of(new WeeklyWorkingHoursTimesheet());
  }
}

export const weeklyWorkingHoursRoute: Routes = [
  {
    path: '',
    component: WeeklyWorkingHoursTimesheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.weeklyWorkingHours.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: WeeklyWorkingHoursTimesheetDetailComponent,
    resolve: {
      weeklyWorkingHours: WeeklyWorkingHoursTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.weeklyWorkingHours.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: WeeklyWorkingHoursTimesheetUpdateComponent,
    resolve: {
      weeklyWorkingHours: WeeklyWorkingHoursTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.weeklyWorkingHours.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: WeeklyWorkingHoursTimesheetUpdateComponent,
    resolve: {
      weeklyWorkingHours: WeeklyWorkingHoursTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.weeklyWorkingHours.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const weeklyWorkingHoursPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: WeeklyWorkingHoursTimesheetDeletePopupComponent,
    resolve: {
      weeklyWorkingHours: WeeklyWorkingHoursTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.weeklyWorkingHours.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
