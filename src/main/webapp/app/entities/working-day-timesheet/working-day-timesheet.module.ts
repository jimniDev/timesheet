import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TimesheetSharedModule } from 'app/shared';
import {
  WorkingDayTimesheetComponent,
  WorkingDayTimesheetDetailComponent,
  WorkingDayTimesheetUpdateComponent,
  WorkingDayTimesheetDeletePopupComponent,
  WorkingDayTimesheetDeleteDialogComponent,
  workingDayRoute,
  workingDayPopupRoute
} from './';

const ENTITY_STATES = [...workingDayRoute, ...workingDayPopupRoute];

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    WorkingDayTimesheetComponent,
    WorkingDayTimesheetDetailComponent,
    WorkingDayTimesheetUpdateComponent,
    WorkingDayTimesheetDeleteDialogComponent,
    WorkingDayTimesheetDeletePopupComponent
  ],
  entryComponents: [
    WorkingDayTimesheetComponent,
    WorkingDayTimesheetUpdateComponent,
    WorkingDayTimesheetDeleteDialogComponent,
    WorkingDayTimesheetDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetWorkingDayTimesheetModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
