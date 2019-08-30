import { Component, OnInit, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ICON_REGISTRY_PROVIDER } from '@angular/material';

@Component({
  selector: 'as-main-card',
  templateUrl: './as-main-card.component.html',
  styleUrls: ['./as-main-card.component.scss']
})
export class AsMainCardComponent implements OnInit {
  @Input() name: string = '';
  @Input() icon: string = '';
  small: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
      if (result.matches) {
        this.small = true;
      } else {
        this.small = false;
      }
    });
  }
}
