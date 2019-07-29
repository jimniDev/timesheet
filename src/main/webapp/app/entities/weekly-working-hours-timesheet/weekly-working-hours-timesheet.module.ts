import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TimesheetSharedModule } from 'app/shared';
import {
  WeeklyWorkingHoursTimesheetComponent,
  WeeklyWorkingHoursTimesheetDetailComponent,
  WeeklyWorkingHoursTimesheetUpdateComponent,
  WeeklyWorkingHoursTimesheetDeletePopupComponent,
  WeeklyWorkingHoursTimesheetDeleteDialogComponent,
  weeklyWorkingHoursRoute,
  weeklyWorkingHoursPopupRoute
} from './';

const ENTITY_STATES = [...weeklyWorkingHoursRoute, ...weeklyWorkingHoursPopupRoute];

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    WeeklyWorkingHoursTimesheetComponent,
    WeeklyWorkingHoursTimesheetDetailComponent,
    WeeklyWorkingHoursTimesheetUpdateComponent,
    WeeklyWorkingHoursTimesheetDeleteDialogComponent,
    WeeklyWorkingHoursTimesheetDeletePopupComponent
  ],
  entryComponents: [
    WeeklyWorkingHoursTimesheetComponent,
    WeeklyWorkingHoursTimesheetUpdateComponent,
    WeeklyWorkingHoursTimesheetDeleteDialogComponent,
    WeeklyWorkingHoursTimesheetDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetWeeklyWorkingHoursTimesheetModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
