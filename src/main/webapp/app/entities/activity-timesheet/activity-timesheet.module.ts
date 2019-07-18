import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TimesheetSharedModule } from 'app/shared';
import {
  ActivityTimesheetComponent,
  ActivityTimesheetDetailComponent,
  ActivityTimesheetUpdateComponent,
  ActivityTimesheetDeletePopupComponent,
  ActivityTimesheetDeleteDialogComponent,
  activityRoute,
  activityPopupRoute
} from './';

const ENTITY_STATES = [...activityRoute, ...activityPopupRoute];

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ActivityTimesheetComponent,
    ActivityTimesheetDetailComponent,
    ActivityTimesheetUpdateComponent,
    ActivityTimesheetDeleteDialogComponent,
    ActivityTimesheetDeletePopupComponent
  ],
  entryComponents: [
    ActivityTimesheetComponent,
    ActivityTimesheetUpdateComponent,
    ActivityTimesheetDeleteDialogComponent,
    ActivityTimesheetDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetActivityTimesheetModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
