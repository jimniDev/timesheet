import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { TimesheetSharedModule } from 'app/shared';
import {
  EmployeeTimesheetComponent,
  EmployeeTimesheetDetailComponent,
  EmployeeTimesheetUpdateComponent,
  EmployeeTimesheetDeletePopupComponent,
  EmployeeTimesheetDeleteDialogComponent,
  employeeRoute,
  employeePopupRoute
} from './';
import { AsLayoutsModule } from 'app/as-layouts/as-layouts.module';

const ENTITY_STATES = [...employeeRoute, ...employeePopupRoute];

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild(ENTITY_STATES), AsLayoutsModule],
  declarations: [
    EmployeeTimesheetComponent,
    EmployeeTimesheetDetailComponent,
    EmployeeTimesheetUpdateComponent,
    EmployeeTimesheetDeleteDialogComponent,
    EmployeeTimesheetDeletePopupComponent
  ],
  entryComponents: [
    EmployeeTimesheetComponent,
    EmployeeTimesheetUpdateComponent,
    EmployeeTimesheetDeleteDialogComponent,
    EmployeeTimesheetDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetEmployeeTimesheetModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
