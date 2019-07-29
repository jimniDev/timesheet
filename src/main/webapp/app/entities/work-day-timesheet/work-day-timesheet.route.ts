import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';
import { WorkDayTimesheetService } from './work-day-timesheet.service';
import { WorkDayTimesheetComponent } from './work-day-timesheet.component';
import { WorkDayTimesheetDetailComponent } from './work-day-timesheet-detail.component';
import { WorkDayTimesheetUpdateComponent } from './work-day-timesheet-update.component';
import { WorkDayTimesheetDeletePopupComponent } from './work-day-timesheet-delete-dialog.component';
import { IWorkDayTimesheet } from 'app/shared/model/work-day-timesheet.model';

@Injectable({ providedIn: 'root' })
export class WorkDayTimesheetResolve implements Resolve<IWorkDayTimesheet> {
  constructor(private service: WorkDayTimesheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IWorkDayTimesheet> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<WorkDayTimesheet>) => response.ok),
        map((workDay: HttpResponse<WorkDayTimesheet>) => workDay.body)
      );
    }
    return of(new WorkDayTimesheet());
  }
}

export const workDayRoute: Routes = [
  {
    path: '',
    component: WorkDayTimesheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workDay.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: WorkDayTimesheetDetailComponent,
    resolve: {
      workDay: WorkDayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workDay.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: WorkDayTimesheetUpdateComponent,
    resolve: {
      workDay: WorkDayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workDay.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: WorkDayTimesheetUpdateComponent,
    resolve: {
      workDay: WorkDayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workDay.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const workDayPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: WorkDayTimesheetDeletePopupComponent,
    resolve: {
      workDay: WorkDayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workDay.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
