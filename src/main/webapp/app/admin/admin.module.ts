import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';
import { TimesheetSharedModule } from 'app/shared';
import { EmployeeOverviewComponent } from './employee-overview/employee-overview.component';
import { ActivityConfigComponent } from './activity-config/activity-config.component';
import { AsLayoutsModule } from 'app/as-layouts/as-layouts.module';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */
import {
  adminState,
  AuditsComponent,
  LogsComponent,
  JhiMetricsMonitoringComponent,
  JhiHealthModalComponent,
  JhiHealthCheckComponent,
  JhiConfigurationComponent,
  JhiDocsComponent
} from './';
import { ActivityCreationDialogComponent } from './activity-config/activity-creation-dialog/activity-creation-dialog.component';

import { ActivityRoleMappingDialogComponent } from './activity-config/activity-role-mapping-dialog/activity-role-mapping-dialog.component';
import { ActivityTableComponent } from './activity-config/activity-table/activity-table.component';
import { RoleTableComponent } from './activity-config/role-table/role-table.component';
import { ActivityEditDialogComponent } from './activity-config/activity-edit-dialog/activity-edit-dialog.component';
import { RoleEditDialogComponent } from './activity-config/role-edit-dialog/role-edit-dialog.component';
import { RoleCreationDialogComponent } from './activity-config/role-creation-dialog/role-creation-dialog.component';

@NgModule({
  imports: [AsLayoutsModule, TimesheetSharedModule, AsLayoutsModule, RouterModule.forChild(adminState)],
  declarations: [
    AuditsComponent,
    LogsComponent,
    JhiConfigurationComponent,
    JhiHealthCheckComponent,
    JhiHealthModalComponent,
    JhiDocsComponent,
    JhiMetricsMonitoringComponent,
    EmployeeOverviewComponent,
    ActivityConfigComponent,
    ActivityConfigComponent,
    ActivityCreationDialogComponent,
    RoleCreationDialogComponent,
    ActivityRoleMappingDialogComponent,
    ActivityTableComponent,
    RoleTableComponent,
    RoleEditDialogComponent,
    ActivityEditDialogComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  entryComponents: [
    JhiHealthModalComponent,
    ActivityCreationDialogComponent,
    RoleCreationDialogComponent,
    ActivityRoleMappingDialogComponent,
    RoleEditDialogComponent,
    ActivityEditDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetAdminModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
