import { NgModule } from '@angular/core';

import { TimesheetSharedLibsModule, FindLanguageFromKeyPipe } from './';

@NgModule({
  imports: [TimesheetSharedLibsModule],
  declarations: [FindLanguageFromKeyPipe],
  exports: [TimesheetSharedLibsModule, FindLanguageFromKeyPipe]
})
export class TimesheetSharedCommonModule {}
