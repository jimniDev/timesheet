import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TimesheetSharedModule } from 'app/shared';
import {
  WorkDayTimesheetComponent,
  WorkDayTimesheetDetailComponent,
  WorkDayTimesheetUpdateComponent,
  WorkDayTimesheetDeletePopupComponent,
  WorkDayTimesheetDeleteDialogComponent,
  workDayRoute,
  workDayPopupRoute
} from './';

const ENTITY_STATES = [...workDayRoute, ...workDayPopupRoute];

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    WorkDayTimesheetComponent,
    WorkDayTimesheetDetailComponent,
    WorkDayTimesheetUpdateComponent,
    WorkDayTimesheetDeleteDialogComponent,
    WorkDayTimesheetDeletePopupComponent
  ],
  entryComponents: [
    WorkDayTimesheetComponent,
    WorkDayTimesheetUpdateComponent,
    WorkDayTimesheetDeleteDialogComponent,
    WorkDayTimesheetDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetWorkDayTimesheetModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
