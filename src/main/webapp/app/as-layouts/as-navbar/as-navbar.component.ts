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

  messageIndex = 0;

  messagesClearedShow = false;

  sideNavMode = 'side';

  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;

  constructor(public messagesService: AsNavbarMessagesService, private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
      if (result.matches) {
        this.sidenav.disableClose = false;
        this.sideNavMode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.disableClose = true;
        this.sideNavMode = 'side';
        this.sidenav.open();
      }
    });
  }

  nextMessage() {
    if (this.messageIndex < this.messagesService.messages.length - 1) {
      this.messageIndex++;
      console.log(this.messageIndex);
    } else {
      if (this.messageIndex === this.messagesService.messages.length - 1) {
        this.messageIndex = 0;
      }
    }
  }

  deleteMessage(index: number): void {
    // this.messagesService.messages.splice(index, 1);
    this.messagesService.messages.splice(index, 1);
    if (!(this.messageIndex === 0 || this.messageIndex === this.messagesService.messages.length - 1)) {
      this.messageIndex--;
    }
    this.messagesClearedShow = this.messagesService.messages.length === 0;
    if (this.messagesClearedShow) {
      setTimeout(() => (this.messagesClearedShow = false), 3000);
    }
  }

  clearMessage(): void {
    this.messagesService.messages = [];
  }

  closeOnLtMd() {
    if (this.breakpointObserver.isMatched([Breakpoints.Small, Breakpoints.XSmall])) {
      this.sidenav.close();
    }
  }
}
