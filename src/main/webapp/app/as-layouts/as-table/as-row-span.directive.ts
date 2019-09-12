import { Directive, Input, ElementRef, OnInit, Optional, Host } from '@angular/core';
import { CdkTable } from '@angular/cdk/table';
import { AsRowSpanService } from './as-row-span.service';

@Directive({
  selector: '[asRowSpan]'
})
export class AsRowSpanDirective implements OnInit {
  private DATA = [];
  private spans = [];

  @Input() rowIndex: number;
  @Input() colAccessor: Function;

  constructor(private el: ElementRef, @Optional() @Host() private cdkTable: CdkTable<any>) {
    this.DATA = <[]>this.cdkTable.dataSource;
    this.cacheSpan('intern', this.colAccessor);
    el.nativeElement.rowSpan = this.getRowSpan('intern', this.rowIndex);
    el.nativeElement.style.display = this.getRowSpan('intern', this.rowIndex) ? '' : 'none';
  }

  ngOnInit(): void {}

  /**
   * Evaluated and store an evaluation of the rowspan for each row.
   * The key determines the column it affects, and the accessor determines the
   * value that should be checked for spanning.
   */
  cacheSpan(key: string, accessor: Function) {
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

  getRowSpan(col: string, index: number) {
    return this.spans[index] && this.spans[index][col];
  }
}
