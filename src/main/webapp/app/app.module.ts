import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { TimesheetSharedModule } from 'app/shared';
import { TimesheetCoreModule } from 'app/core';
import { TimesheetAppRoutingModule } from './app-routing.module';
import { TimesheetHomeModule } from './home/home.module';
import { TimesheetEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { JhiMainComponent, ErrorComponent } from './layouts';
import { AsLayoutsModule } from './as-layouts/as-layouts.module';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'always' }),
    AsLayoutsModule,
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-' }),
    TimesheetSharedModule.forRoot(),
    TimesheetCoreModule,
    TimesheetHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    TimesheetEntityModule,
    TimesheetAppRoutingModule,
    BrowserAnimationsModule
  ],
  declarations: [JhiMainComponent, ErrorComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotificationInterceptor,
      multi: true
    }
  ],
  bootstrap: [JhiMainComponent]
})
export class TimesheetAppModule {
  constructor() {}
}
