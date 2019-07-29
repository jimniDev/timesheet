import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TargetWorkingDayTimesheet } from 'app/shared/model/target-working-day-timesheet.model';
import { TargetWorkingDayTimesheetService } from './target-working-day-timesheet.service';
import { TargetWorkingDayTimesheetComponent } from './target-working-day-timesheet.component';
import { TargetWorkingDayTimesheetDetailComponent } from './target-working-day-timesheet-detail.component';
import { TargetWorkingDayTimesheetUpdateComponent } from './target-working-day-timesheet-update.component';
import { TargetWorkingDayTimesheetDeletePopupComponent } from './target-working-day-timesheet-delete-dialog.component';
import { ITargetWorkingDayTimesheet } from 'app/shared/model/target-working-day-timesheet.model';

@Injectable({ providedIn: 'root' })
export class TargetWorkingDayTimesheetResolve implements Resolve<ITargetWorkingDayTimesheet> {
  constructor(private service: TargetWorkingDayTimesheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITargetWorkingDayTimesheet> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<TargetWorkingDayTimesheet>) => response.ok),
        map((targetWorkingDay: HttpResponse<TargetWorkingDayTimesheet>) => targetWorkingDay.body)
      );
    }
    return of(new TargetWorkingDayTimesheet());
  }
}

export const targetWorkingDayRoute: Routes = [
  {
    path: '',
    component: TargetWorkingDayTimesheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.targetWorkingDay.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: TargetWorkingDayTimesheetDetailComponent,
    resolve: {
      targetWorkingDay: TargetWorkingDayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.targetWorkingDay.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: TargetWorkingDayTimesheetUpdateComponent,
    resolve: {
      targetWorkingDay: TargetWorkingDayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.targetWorkingDay.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: TargetWorkingDayTimesheetUpdateComponent,
    resolve: {
      targetWorkingDay: TargetWorkingDayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.targetWorkingDay.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const targetWorkingDayPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: TargetWorkingDayTimesheetDeletePopupComponent,
    resolve: {
      targetWorkingDay: TargetWorkingDayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.targetWorkingDay.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
