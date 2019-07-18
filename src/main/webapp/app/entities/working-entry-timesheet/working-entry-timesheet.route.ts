import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';
import { WorkingEntryTimesheetService } from './working-entry-timesheet.service';
import { WorkingEntryTimesheetComponent } from './working-entry-timesheet.component';
import { WorkingEntryTimesheetDetailComponent } from './working-entry-timesheet-detail.component';
import { WorkingEntryTimesheetUpdateComponent } from './working-entry-timesheet-update.component';
import { WorkingEntryTimesheetDeletePopupComponent } from './working-entry-timesheet-delete-dialog.component';
import { IWorkingEntryTimesheet } from 'app/shared/model/working-entry-timesheet.model';

@Injectable({ providedIn: 'root' })
export class WorkingEntryTimesheetResolve implements Resolve<IWorkingEntryTimesheet> {
  constructor(private service: WorkingEntryTimesheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IWorkingEntryTimesheet> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<WorkingEntryTimesheet>) => response.ok),
        map((workingEntry: HttpResponse<WorkingEntryTimesheet>) => workingEntry.body)
      );
    }
    return of(new WorkingEntryTimesheet());
  }
}

export const workingEntryRoute: Routes = [
  {
    path: '',
    component: WorkingEntryTimesheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workingEntry.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: WorkingEntryTimesheetDetailComponent,
    resolve: {
      workingEntry: WorkingEntryTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workingEntry.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: WorkingEntryTimesheetUpdateComponent,
    resolve: {
      workingEntry: WorkingEntryTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workingEntry.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: WorkingEntryTimesheetUpdateComponent,
    resolve: {
      workingEntry: WorkingEntryTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workingEntry.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const workingEntryPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: WorkingEntryTimesheetDeletePopupComponent,
    resolve: {
      workingEntry: WorkingEntryTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.workingEntry.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
