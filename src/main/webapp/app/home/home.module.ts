import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TimesheetSharedModule } from 'app/shared';
import { HOME_ROUTE, HomeComponent } from './';
import { TimetableComponent } from './timetable/timetable/timetable.component';

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent, TimetableComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetHomeModule {}
