import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TimesheetSharedModule } from 'app/shared';
import { HOME_ROUTE, HomeComponent } from './';
import { TimetableComponent } from './timetable/timetable.component';
import { DateFormComponent } from './date-form/date-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TwoDigitsDirective } from './two-digits.directive';
import { YearMonthSelectComponent } from './year-month-select/year-month-select.component';
import { AsLayoutsModule } from 'app/as-layouts/as-layouts.module';
import { HomeDialogComponent } from './home-dialog/home-dialog.component';
import { TimetableEditDialogComponent } from './timetable-edit-dialog/timetable-edit-dialog.component';
import { TimetableDeleteDialogComponent } from './timetable-delete-dialog/timetable-delete-dialog.component';
import { YearWeekSelectComponent } from './year-week-select/year-week-select.component';

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild([HOME_ROUTE]), ReactiveFormsModule, AsLayoutsModule],
  declarations: [
    HomeComponent,
    TimetableComponent,
    DateFormComponent,
    TwoDigitsDirective,
    YearMonthSelectComponent,
    HomeDialogComponent,
    TimetableEditDialogComponent,
    TimetableDeleteDialogComponent,
    YearWeekSelectComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [HomeDialogComponent, TimetableComponent, TimetableEditDialogComponent, TimetableDeleteDialogComponent]
})
export class TimesheetHomeModule {}
