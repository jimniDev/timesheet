import { Injectable } from '@angular/core';
import { AsLayoutsModule } from '../as-layouts.module';

@Injectable({
  providedIn: AsLayoutsModule
})
export class AsRowSpanService {
  private DATA: Array<any>;
  private spans: Array<any>;
  private accessors: Map<string, Function>;

  constructor() {
    // this.DATA = new Array();
    this.spans = new Array();
    this.accessors = new Map();
  }

  public setData(data): void {
    this.DATA = data;
  }

  public deleteCache(): void {
    this.spans = new Array();
    this.accessors = new Map();
  }

  public updateCache(data?: Array<any>): void {
    if (data) {
      this.setData(data);
    }
    this.spans = [];
    this.accessors.forEach((value, key) => {
      this.cacheSpan(key, value);
    });
  }

  /**
   * Evaluated and store an evaluation of the rowspan for each row.
   * The key determines the column it affects, and the accessor determines the
   * value that should be checked for spanning.
   */
  public cacheSpan(key: string, accessor: Function): void {
    this.accessors.set(key, accessor);
    for (let i = 0; i < this.DATA.length; ) {
      let currentValue = accessor(this.DATA[i]);
      let count = 1;

      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < this.DATA.length; j++) {
        if (currentValue != accessor(this.DATA[j])) {
          break;
        }

        count++;
      }

      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      // Store the number of similar values that were found (the span)
      // and skip i to the next unique row.
      this.spans[i][key] = count;
      i += count;
    }
  }

  public getRowSpan(col: string, index: number): number {
    return this.spans[index] && this.spans[index][col];
  }
}
