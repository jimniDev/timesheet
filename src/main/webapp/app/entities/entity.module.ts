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
        path: 'activity-timesheet',
        loadChildren: './activity-timesheet/activity-timesheet.module#TimesheetActivityTimesheetModule'
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
