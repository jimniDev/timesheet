import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'employee-timesheet',
        loadChildren: './employee-timesheet/employee-timesheet.module#TimesheetEmployeeTimesheetModule'
      },
      {
        path: 'working-day-timesheet',
        loadChildren: './working-day-timesheet/working-day-timesheet.module#TimesheetWorkingDayTimesheetModule'
      },
      {
        path: 'day-timesheet',
        loadChildren: './day-timesheet/day-timesheet.module#TimesheetDayTimesheetModule'
      },
      {
        path: 'working-entry-timesheet',
        loadChildren: './working-entry-timesheet/working-entry-timesheet.module#TimesheetWorkingEntryTimesheetModule'
      },
      {
        path: 'activity-timesheet',
        loadChildren: './activity-timesheet/activity-timesheet.module#TimesheetActivityTimesheetModule'
      },
      {
        path: 'location-timesheet',
        loadChildren: './location-timesheet/location-timesheet.module#TimesheetLocationTimesheetModule'
      },
      {
        path: 'country-timesheet',
        loadChildren: './country-timesheet/country-timesheet.module#TimesheetCountryTimesheetModule'
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetEntityModule {}
