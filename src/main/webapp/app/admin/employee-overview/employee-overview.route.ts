import { EmployeeOverviewComponent } from './employee-overview.component';
import { Route } from '@angular/router';
import { UserRouteAccessService } from 'app/core';

export const employeeOverviewRoute: Route = {
  path: 'employee-overview',
  component: EmployeeOverviewComponent,
  data: {
    authorities: ['ROLE_ADMIN'],
    pageTitle: 'home.title'
  },
  canActivate: [UserRouteAccessService]
};
