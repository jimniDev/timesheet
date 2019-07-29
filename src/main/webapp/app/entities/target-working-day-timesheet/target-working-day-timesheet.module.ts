import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TimesheetSharedModule } from 'app/shared';
import {
  TargetWorkingDayTimesheetComponent,
  TargetWorkingDayTimesheetDetailComponent,
  TargetWorkingDayTimesheetUpdateComponent,
  TargetWorkingDayTimesheetDeletePopupComponent,
  TargetWorkingDayTimesheetDeleteDialogComponent,
  targetWorkingDayRoute,
  targetWorkingDayPopupRoute
} from './';

const ENTITY_STATES = [...targetWorkingDayRoute, ...targetWorkingDayPopupRoute];

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TargetWorkingDayTimesheetComponent,
    TargetWorkingDayTimesheetDetailComponent,
    TargetWorkingDayTimesheetUpdateComponent,
    TargetWorkingDayTimesheetDeleteDialogComponent,
    TargetWorkingDayTimesheetDeletePopupComponent
  ],
  entryComponents: [
    TargetWorkingDayTimesheetComponent,
    TargetWorkingDayTimesheetUpdateComponent,
    TargetWorkingDayTimesheetDeleteDialogComponent,
    TargetWorkingDayTimesheetDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetTargetWorkingDayTimesheetModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
