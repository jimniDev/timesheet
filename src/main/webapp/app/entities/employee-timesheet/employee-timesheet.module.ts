import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TimesheetSharedModule } from 'app/shared';
import { EmployeeTimesheetDetailComponent, employeeRoute } from './';
import { AsLayoutsModule } from 'app/as-layouts/as-layouts.module';
import { EmployeeTimeSheetWeeklyDialogComponent } from './employee-time-sheet-weekly-dialog-component';

const ENTITY_STATES = [...employeeRoute];

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild(ENTITY_STATES), AsLayoutsModule],
  declarations: [EmployeeTimesheetDetailComponent, EmployeeTimeSheetWeeklyDialogComponent],
  entryComponents: [EmployeeTimeSheetWeeklyDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetEmployeeTimesheetModule {
  constructor() {}
}
