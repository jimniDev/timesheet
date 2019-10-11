import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TimesheetSharedModule } from 'app/shared';
import { EmployeeOverviewComponent } from './employee-overview/employee-overview.component';
import { ActivityConfigComponent } from './activity-config/activity-config.component';
import { AsLayoutsModule } from 'app/as-layouts/as-layouts.module';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */
import { adminState } from './';
import { ActivityCreationDialogComponent } from './activity-config/activity-creation-dialog/activity-creation-dialog.component';
import { ActivityRoleDialogComponent } from './activity-config/activity-role-dialog/activity-role-dialog.component';
import { ActivityRoleMappingDialogComponent } from './activity-config/activity-role-mapping-dialog/activity-role-mapping-dialog.component';
import { ActivityTableComponent } from './activity-config/activity-table/activity-table.component';
import { RoleTableComponent } from './activity-config/role-table/role-table.component';
import { ActivityRoleEditDialogComponent } from './activity-config/activity-role-edit-dialog/activity-role-edit-dialog.component';
import { ActivityEditDialogComponent } from './activity-config/activity-edit-dialog/activity-edit-dialog.component';

@NgModule({
  imports: [AsLayoutsModule, TimesheetSharedModule, AsLayoutsModule, RouterModule.forChild(adminState)],
  declarations: [
    EmployeeOverviewComponent,
    ActivityConfigComponent,
    ActivityConfigComponent,
    ActivityCreationDialogComponent,
    ActivityRoleDialogComponent,
    ActivityRoleMappingDialogComponent,
    ActivityTableComponent,
    RoleTableComponent,
    ActivityRoleEditDialogComponent,
    ActivityEditDialogComponent
  ],
  providers: [],
  entryComponents: [
    ActivityCreationDialogComponent,
    ActivityRoleDialogComponent,
    ActivityRoleMappingDialogComponent,
    ActivityRoleEditDialogComponent,
    ActivityEditDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetAdminModule {
  constructor() {}
}
