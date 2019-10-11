import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CookieModule } from 'ngx-cookie';

@NgModule({
  imports: [InfiniteScrollModule, CookieModule.forRoot(), ReactiveFormsModule],
  exports: [FormsModule, CommonModule, InfiniteScrollModule, ReactiveFormsModule]
})
export class TimesheetSharedLibsModule {
  static forRoot() {
    return {
      ngModule: TimesheetSharedLibsModule
    };
  }
}
