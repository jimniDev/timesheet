import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';
import { EmployeeTimesheetService } from './employee-timesheet.service';
import { EmployeeTimesheetComponent } from './employee-timesheet.component';
import { EmployeeTimesheetDetailComponent } from './employee-timesheet-detail.component';
import { EmployeeTimesheetUpdateComponent } from './employee-timesheet-update.component';
import { EmployeeTimesheetDeletePopupComponent } from './employee-timesheet-delete-dialog.component';
import { IEmployeeTimesheet } from 'app/shared/model/employee-timesheet.model';

@Injectable({ providedIn: 'root' })
export class EmployeeTimesheetResolve implements Resolve<IEmployeeTimesheet> {
  constructor(private service: EmployeeTimesheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEmployeeTimesheet> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<EmployeeTimesheet>) => response.ok),
        map((employee: HttpResponse<EmployeeTimesheet>) => employee.body)
      );
    }
    return of(new EmployeeTimesheet());
  }
}

export const employeeRoute: Routes = [
  {
    path: '',
    component: EmployeeTimesheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.employee.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: EmployeeTimesheetDetailComponent,
    resolve: {
      employee: EmployeeTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.employee.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: EmployeeTimesheetUpdateComponent,
    resolve: {
      employee: EmployeeTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.employee.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: EmployeeTimesheetUpdateComponent,
    resolve: {
      employee: EmployeeTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.employee.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const employeePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: EmployeeTimesheetDeletePopupComponent,
    resolve: {
      employee: EmployeeTimesheetResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'timesheetApp.employee.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
