import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WorkingDayTimesheet } from 'app/shared/model/working-day-timesheet.model';
import { WorkingDayTimesheetService } from './working-day-timesheet.service';
import { WorkingDayTimesheetComponent } from './working-day-timesheet.component';
import { WorkingDayTimesheetDetailComponent } from './working-day-timesheet-detail.component';
import { WorkingDayTimesheetUpdateComponent } from './working-day-timesheet-update.component';
import { WorkingDayTimesheetDeletePopupComponent } from './working-day-timesheet-delete-dialog.component';
import { IWorkingDayTimesheet } from 'app/shared/model/working-day-timesheet.model';

@Injectable({ providedIn: 'root' })
export class WorkingDayTimesheetResolve implements Resolve<IWorkingDayTimesheet> {
  constructor(private service: WorkingDayTimesheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IWorkingDayTimesheet> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<WorkingDayTimesheet>) => response.ok),
        map((workingDay: HttpResponse<WorkingDayTimesheet>) => workingDay.body)
      );
    }
    return of(new WorkingDayTimesheet());
  }
}

export const workingDayRoute: Routes = [
  {
    path: '',
    component: WorkingDayTimesheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workingDay.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: WorkingDayTimesheetDetailComponent,
    resolve: {
      workingDay: WorkingDayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workingDay.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: WorkingDayTimesheetUpdateComponent,
    resolve: {
      workingDay: WorkingDayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workingDay.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: WorkingDayTimesheetUpdateComponent,
    resolve: {
      workingDay: WorkingDayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workingDay.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const workingDayPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: WorkingDayTimesheetDeletePopupComponent,
    resolve: {
      workingDay: WorkingDayTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workingDay.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
