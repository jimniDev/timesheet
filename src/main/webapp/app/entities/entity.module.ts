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
      },
      {
        path: 'target-working-day-timesheet',
        loadChildren: './target-working-day-timesheet/target-working-day-timesheet.module#TimesheetTargetWorkingDayTimesheetModule'
      },
      {
        path: 'day-of-week-timesheet',
        loadChildren: './day-of-week-timesheet/day-of-week-timesheet.module#TimesheetDayOfWeekTimesheetModule'
      },
      {
        path: 'weekly-working-hours-timesheet',
        loadChildren: './weekly-working-hours-timesheet/weekly-working-hours-timesheet.module#TimesheetWeeklyWorkingHoursTimesheetModule'
      },
      {
        path: 'work-day-timesheet',
        loadChildren: './work-day-timesheet/work-day-timesheet.module#TimesheetWorkDayTimesheetModule'
      },
      {
        path: 'role-timesheet',
        loadChildren: './role-timesheet/role-timesheet.module#TimesheetRoleTimesheetModule'
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
