import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { RoleTimesheet } from 'app/shared/model/role-timesheet.model';
import { RoleTimesheetService } from './role-timesheet.service';
import { RoleTimesheetComponent } from './role-timesheet.component';
import { RoleTimesheetDetailComponent } from './role-timesheet-detail.component';
import { RoleTimesheetUpdateComponent } from './role-timesheet-update.component';
import { RoleTimesheetDeletePopupComponent } from './role-timesheet-delete-dialog.component';
import { IRoleTimesheet } from 'app/shared/model/role-timesheet.model';

@Injectable({ providedIn: 'root' })
export class RoleTimesheetResolve implements Resolve<IRoleTimesheet> {
  constructor(private service: RoleTimesheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRoleTimesheet> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<RoleTimesheet>) => response.ok),
        map((role: HttpResponse<RoleTimesheet>) => role.body)
      );
    }
    return of(new RoleTimesheet());
  }
}

export const roleRoute: Routes = [
  {
    path: '',
    component: RoleTimesheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.role.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: RoleTimesheetDetailComponent,
    resolve: {
      role: RoleTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.role.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: RoleTimesheetUpdateComponent,
    resolve: {
      role: RoleTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.role.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: RoleTimesheetUpdateComponent,
    resolve: {
      role: RoleTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.role.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const rolePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: RoleTimesheetDeletePopupComponent,
    resolve: {
      role: RoleTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.role.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
