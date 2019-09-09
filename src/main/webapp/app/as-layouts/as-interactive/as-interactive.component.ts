import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'as-interactive',
  templateUrl: './as-interactive.component.html',
  styleUrls: ['./as-interactive.component.scss']
})
export class AsInteractiveComponent implements OnInit, AfterViewInit {
  className: string;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
      if (result.matches) {
        this.className = 'container';
      } else {
        this.className = '';
      }
    });
  }

  ngAfterViewInit() {}
}
