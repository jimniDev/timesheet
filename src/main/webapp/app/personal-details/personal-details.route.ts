import { Route } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { PersonalDetailsComponent } from './personal-details.component';

export const PersonalDetailsRoute: Route = {
  path: 'personal-details',
  component: PersonalDetailsComponent,
  data: {
    authorities: ['ROLE_USER', 'ROLE_ADMIN'],
    pageTitle: 'AS Scope Timesheet'
  },
  canActivate: [UserRouteAccessService]
};
