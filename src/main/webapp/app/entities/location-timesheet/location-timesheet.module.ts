import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TimesheetSharedModule } from 'app/shared';
import {
  LocationTimesheetComponent,
  LocationTimesheetDetailComponent,
  LocationTimesheetUpdateComponent,
  LocationTimesheetDeletePopupComponent,
  LocationTimesheetDeleteDialogComponent,
  locationRoute,
  locationPopupRoute
} from './';

const ENTITY_STATES = [...locationRoute, ...locationPopupRoute];

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    LocationTimesheetComponent,
    LocationTimesheetDetailComponent,
    LocationTimesheetUpdateComponent,
    LocationTimesheetDeleteDialogComponent,
    LocationTimesheetDeletePopupComponent
  ],
  entryComponents: [
    LocationTimesheetComponent,
    LocationTimesheetUpdateComponent,
    LocationTimesheetDeleteDialogComponent,
    LocationTimesheetDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetLocationTimesheetModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
