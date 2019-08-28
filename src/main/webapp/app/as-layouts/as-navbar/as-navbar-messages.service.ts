import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsNavbarMessagesService {
  messages: string[] = new Array<string>();

  constructor() {}

  public add(message: string, milliSeconds?: number): void {
    if (!milliSeconds) {
      milliSeconds = 3000;
    }
    this.messages.push(message);
    setTimeout(() => {
      const index = this.messages.indexOf(message);
      if (index !== -1) {
        this.messages.splice(index, 1);
      }
    }, milliSeconds);
  }
}
