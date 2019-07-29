import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TimesheetSharedModule } from 'app/shared';
import {
  RoleTimesheetComponent,
  RoleTimesheetDetailComponent,
  RoleTimesheetUpdateComponent,
  RoleTimesheetDeletePopupComponent,
  RoleTimesheetDeleteDialogComponent,
  roleRoute,
  rolePopupRoute
} from './';

const ENTITY_STATES = [...roleRoute, ...rolePopupRoute];

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    RoleTimesheetComponent,
    RoleTimesheetDetailComponent,
    RoleTimesheetUpdateComponent,
    RoleTimesheetDeleteDialogComponent,
    RoleTimesheetDeletePopupComponent
  ],
  entryComponents: [
    RoleTimesheetComponent,
    RoleTimesheetUpdateComponent,
    RoleTimesheetDeleteDialogComponent,
    RoleTimesheetDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetRoleTimesheetModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
