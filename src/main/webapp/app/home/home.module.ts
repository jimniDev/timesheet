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
import { TimetableEditDialogComponent } from './timetable-edit-dialog/timetable-edit-dialog.component';
import { HomeDialog } from './home-dialog';

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild([HOME_ROUTE]), ReactiveFormsModule, AsLayoutsModule],
  declarations: [
    HomeComponent,
    TimetableComponent,
    DateFormComponent,
    TwoDigitsDirective,
    YearMonthSelectComponent,
    HomeDialog,
    TimetableEditDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [HomeDialog, TimetableComponent, TimetableEditDialogComponent]
})
export class TimesheetHomeModule {}
