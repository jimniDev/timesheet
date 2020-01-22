import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TimesheetSharedModule } from 'app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { AsLayoutsModule } from 'app/as-layouts/as-layouts.module';
import { PersonalDetailsComponent } from './personal-details.component';
import { PersonalDetailsRoute } from './personal-details.route';

@NgModule({
  imports: [TimesheetSharedModule, RouterModule.forChild([PersonalDetailsRoute]), ReactiveFormsModule, AsLayoutsModule],
  declarations: [PersonalDetailsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: []
})
export class PersonalDetailsModule {}
