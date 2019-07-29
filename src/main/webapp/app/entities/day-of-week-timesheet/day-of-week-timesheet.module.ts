import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TimesheetSharedModule } from 'app/shared';
import {
  DayOfWeekTimesheetComponent,
  DayOfWeekTimesheetDetailComponent,
  DayOfWeekTimesheetUpdateComponent,
  DayOfWeekTimesheetDeletePopupComponent,
  DayOfWeekTimesheetDeleteDialogComponent,
  dayOfWeekRoute,
  dayOfWeekPopupRoute
} from './';

const ENTITY_STATES = [...dayOfWeekRoute, ...dayOfWeekPopupRoute];

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DayOfWeekTimesheetComponent,
    DayOfWeekTimesheetDetailComponent,
    DayOfWeekTimesheetUpdateComponent,
    DayOfWeekTimesheetDeleteDialogComponent,
    DayOfWeekTimesheetDeletePopupComponent
  ],
  entryComponents: [
    DayOfWeekTimesheetComponent,
    DayOfWeekTimesheetUpdateComponent,
    DayOfWeekTimesheetDeleteDialogComponent,
    DayOfWeekTimesheetDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetDayOfWeekTimesheetModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
