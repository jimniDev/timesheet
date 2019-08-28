import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AsNavbarMessagesService } from './as-navbar-messages.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'as-navbar',
  templateUrl: './as-navbar.component.html',
  styleUrls: ['./as-navbar.component.scss']
})
export class AsNavbarComponent implements OnInit {
  @Input() title: String;
  @Input() subtitle: String;

  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;

  constructor(public messagesService: AsNavbarMessagesService, private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
      if (result.matches) {
        this.sidenav.disableClose = false;
        this.sidenav.close();
      } else {
        this.sidenav.disableClose = true;
        this.sidenav.open();
      }
    });
  }
}
