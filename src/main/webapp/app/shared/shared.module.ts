import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TimesheetSharedCommonModule, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [TimesheetSharedCommonModule],
  declarations: [HasAnyAuthorityDirective],
  exports: [TimesheetSharedCommonModule, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimesheetSharedModule {
  static forRoot() {
    return {
      ngModule: TimesheetSharedModule
    };
  }
}
