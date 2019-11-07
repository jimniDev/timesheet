import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TimesheetSharedModule } from 'app/shared';
import { EmployeeTimesheetDetailComponent, employeeRoute } from './';
import { AsLayoutsModule } from 'app/as-layouts/as-layouts.module';
import { EmployeeTimeSheetAddDialogComponent } from './employee-timesheet-add-dialog-component';
import { EmployeeTimesheetEditComponent } from './employee-timesheet-edit-component/employee-timesheet-edit-component';

const ENTITY_STATES = [...employeeRoute];

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild(ENTITY_STATES), AsLayoutsModule],
  declarations: [EmployeeTimesheetDetailComponent, EmployeeTimeSheetAddDialogComponent, EmployeeTimesheetEditComponent],
  entryComponents: [EmployeeTimeSheetAddDialogComponent, EmployeeTimesheetEditComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetEmployeeTimesheetModule {
  constructor() {}
}
