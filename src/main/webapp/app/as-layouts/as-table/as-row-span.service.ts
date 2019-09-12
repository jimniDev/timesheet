import { Injectable } from '@angular/core';
import { AsLayoutsModule } from '../as-layouts.module';

@Injectable({
  providedIn: AsLayoutsModule
})
export class AsRowSpanService {
  private DATA = [];
  private spans = [];

  constructor() {}

  setData(data) {
    this.DATA = data;
  }

  deleteCache() {
    this.spans = [];
  }

  /**
   * Evaluated and store an evaluation of the rowspan for each row.
   * The key determines the column it affects, and the accessor determines the
   * value that should be checked for spanning.
   */
  cacheSpan(key, accessor) {
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

  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }
}
