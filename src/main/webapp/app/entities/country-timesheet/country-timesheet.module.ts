import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TimesheetSharedModule } from 'app/shared';
import {
  CountryTimesheetComponent,
  CountryTimesheetDetailComponent,
  CountryTimesheetUpdateComponent,
  CountryTimesheetDeletePopupComponent,
  CountryTimesheetDeleteDialogComponent,
  countryRoute,
  countryPopupRoute
} from './';

const ENTITY_STATES = [...countryRoute, ...countryPopupRoute];

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CountryTimesheetComponent,
    CountryTimesheetDetailComponent,
    CountryTimesheetUpdateComponent,
    CountryTimesheetDeleteDialogComponent,
    CountryTimesheetDeletePopupComponent
  ],
  entryComponents: [
    CountryTimesheetComponent,
    CountryTimesheetUpdateComponent,
    CountryTimesheetDeleteDialogComponent,
    CountryTimesheetDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetCountryTimesheetModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
