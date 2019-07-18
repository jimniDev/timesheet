import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TimesheetSharedModule } from 'app/shared';
import {
  DayTimesheetComponent,
  DayTimesheetDetailComponent,
  DayTimesheetUpdateComponent,
  DayTimesheetDeletePopupComponent,
  DayTimesheetDeleteDialogComponent,
  dayRoute,
  dayPopupRoute
} from './';

const ENTITY_STATES = [...dayRoute, ...dayPopupRoute];

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DayTimesheetComponent,
    DayTimesheetDetailComponent,
    DayTimesheetUpdateComponent,
    DayTimesheetDeleteDialogComponent,
    DayTimesheetDeletePopupComponent
  ],
  entryComponents: [
    DayTimesheetComponent,
    DayTimesheetUpdateComponent,
    DayTimesheetDeleteDialogComponent,
    DayTimesheetDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetDayTimesheetModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
