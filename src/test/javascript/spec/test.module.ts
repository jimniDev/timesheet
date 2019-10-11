import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgModule, ElementRef, Renderer } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AccountService } from 'app/core';
import { MockAccountService } from './helpers/mock-account.service';
import { MockActivatedRoute, MockRouter } from './helpers/mock-route.service';

@NgModule({
  providers: [
    DatePipe,
    {
      provide: ActivatedRoute,
      useValue: new MockActivatedRoute({ id: 123 })
    },
    {
      provide: Router,
      useClass: MockRouter
    },
    {
      provide: AccountService,
      useClass: MockAccountService
    },
    {
      provide: ElementRef,
      useValue: null
    },
    {
      provide: Renderer,
      useValue: null
    }
  ],
  imports: [HttpClientTestingModule]
})
export class TimesheetTestModule {}
