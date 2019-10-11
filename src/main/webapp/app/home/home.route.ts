import { Route } from '@angular/router';

import { HomeComponent } from './';
import { UserRouteAccessService } from 'app/core';

export const HOME_ROUTE: Route = {
  path: '',
  component: HomeComponent,
  data: {
    authorities: ['ROLE_USER', 'ROLE_ADMIN'],
    pageTitle: 'AS Scope Timesheet'
  },
  canActivate: [UserRouteAccessService]
};
