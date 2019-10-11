import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { employeeOverviewRoute } from './employee-overview/employee-overview.route';
import { activityconfigRoute } from './activity-config/activity-config.route';

const ADMIN_ROUTES = [activityconfigRoute, employeeOverviewRoute];

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
