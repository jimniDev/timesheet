import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsNavbarMessagesService {
  messages: string[] = new Array<string>();

  constructor() {}

  public add(message: string): void {
    this.messages.push(message);
  }
  public show(): string {
    console.log(this.messages.pop);
    return this.messages.pop();
  }

  // public close(): void {
  //   this.messages;
  // }
}
