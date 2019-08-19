import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TimesheetSharedModule } from 'app/shared';
import { HOME_ROUTE, HomeComponent } from './';
import { TimetableComponent } from './timetable/timetable/timetable.component';
import { DateFormComponent } from './date-form/date-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TwoDigitsDirective } from './two-digits.directive';

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild([HOME_ROUTE]), ReactiveFormsModule],
  declarations: [HomeComponent, TimetableComponent, DateFormComponent, TwoDigitsDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetHomeModule {}
