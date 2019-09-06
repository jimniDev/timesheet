import { Routes } from '@angular/router';
import { auditsRoute, configurationRoute, docsRoute, healthRoute, logsRoute, metricsRoute } from './';
import { UserRouteAccessService } from 'app/core';
import { employeeOverviewRoute } from './employee-overview/employee-overview.route';
import { activityconfigRoute } from './activity-config/activity-config.route';

const ADMIN_ROUTES = [
  activityconfigRoute,
  auditsRoute,
  configurationRoute,
  docsRoute,
  healthRoute,
  logsRoute,
  metricsRoute,
  employeeOverviewRoute
];

export const adminState: Routes = [
  {
    path: '',
    data: {
      authorities: ['ROLE_ADMIN']
    },
    canActivate: [UserRouteAccessService],
    children: ADMIN_ROUTES
  }
];
