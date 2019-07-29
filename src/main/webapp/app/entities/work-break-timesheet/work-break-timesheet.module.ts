import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TimesheetSharedModule } from 'app/shared';
import {
  WorkBreakTimesheetComponent,
  WorkBreakTimesheetDetailComponent,
  WorkBreakTimesheetUpdateComponent,
  WorkBreakTimesheetDeletePopupComponent,
  WorkBreakTimesheetDeleteDialogComponent,
  workBreakRoute,
  workBreakPopupRoute
} from './';

const ENTITY_STATES = [...workBreakRoute, ...workBreakPopupRoute];

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    WorkBreakTimesheetComponent,
    WorkBreakTimesheetDetailComponent,
    WorkBreakTimesheetUpdateComponent,
    WorkBreakTimesheetDeleteDialogComponent,
    WorkBreakTimesheetDeletePopupComponent
  ],
  entryComponents: [
    WorkBreakTimesheetComponent,
    WorkBreakTimesheetUpdateComponent,
    WorkBreakTimesheetDeleteDialogComponent,
    WorkBreakTimesheetDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetWorkBreakTimesheetModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
