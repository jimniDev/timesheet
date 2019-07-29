import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WorkBreakTimesheet } from 'app/shared/model/work-break-timesheet.model';
import { WorkBreakTimesheetService } from './work-break-timesheet.service';
import { WorkBreakTimesheetComponent } from './work-break-timesheet.component';
import { WorkBreakTimesheetDetailComponent } from './work-break-timesheet-detail.component';
import { WorkBreakTimesheetUpdateComponent } from './work-break-timesheet-update.component';
import { WorkBreakTimesheetDeletePopupComponent } from './work-break-timesheet-delete-dialog.component';
import { IWorkBreakTimesheet } from 'app/shared/model/work-break-timesheet.model';

@Injectable({ providedIn: 'root' })
export class WorkBreakTimesheetResolve implements Resolve<IWorkBreakTimesheet> {
  constructor(private service: WorkBreakTimesheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IWorkBreakTimesheet> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<WorkBreakTimesheet>) => response.ok),
        map((workBreak: HttpResponse<WorkBreakTimesheet>) => workBreak.body)
      );
    }
    return of(new WorkBreakTimesheet());
  }
}

export const workBreakRoute: Routes = [
  {
    path: '',
    component: WorkBreakTimesheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workBreak.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: WorkBreakTimesheetDetailComponent,
    resolve: {
      workBreak: WorkBreakTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workBreak.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: WorkBreakTimesheetUpdateComponent,
    resolve: {
      workBreak: WorkBreakTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workBreak.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: WorkBreakTimesheetUpdateComponent,
    resolve: {
      workBreak: WorkBreakTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workBreak.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const workBreakPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: WorkBreakTimesheetDeletePopupComponent,
    resolve: {
      workBreak: WorkBreakTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workBreak.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
