import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ActivityTimesheet } from 'app/shared/model/activity-timesheet.model';
import { ActivityTimesheetService } from './activity-timesheet.service';
import { ActivityTimesheetComponent } from './activity-timesheet.component';
import { ActivityTimesheetDetailComponent } from './activity-timesheet-detail.component';
import { ActivityTimesheetUpdateComponent } from './activity-timesheet-update.component';
import { ActivityTimesheetDeletePopupComponent } from './activity-timesheet-delete-dialog.component';
import { IActivityTimesheet } from 'app/shared/model/activity-timesheet.model';

@Injectable({ providedIn: 'root' })
export class ActivityTimesheetResolve implements Resolve<IActivityTimesheet> {
  constructor(private service: ActivityTimesheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IActivityTimesheet> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ActivityTimesheet>) => response.ok),
        map((activity: HttpResponse<ActivityTimesheet>) => activity.body)
      );
    }
    return of(new ActivityTimesheet());
  }
}

export const activityRoute: Routes = [
  {
    path: '',
    component: ActivityTimesheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.activity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ActivityTimesheetDetailComponent,
    resolve: {
      activity: ActivityTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.activity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ActivityTimesheetUpdateComponent,
    resolve: {
      activity: ActivityTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.activity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ActivityTimesheetUpdateComponent,
    resolve: {
      activity: ActivityTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.activity.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const activityPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: ActivityTimesheetDeletePopupComponent,
    resolve: {
      activity: ActivityTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.activity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
