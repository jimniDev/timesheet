import { ActivityConfigComponent } from './activity-config.component';
import { Route } from '@angular/router';
import { UserRouteAccessService } from 'app/core';

export const activityconfigRoute: Route = {
  path: 'activity-config',
  component: ActivityConfigComponent,
  data: {
    authorities: ['ROLE_ADMIN'],
    pageTitle: 'home.title'
  },
  canActivate: [UserRouteAccessService]
};
