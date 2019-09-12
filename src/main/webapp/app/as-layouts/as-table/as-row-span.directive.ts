import { Directive, Input, ElementRef, AfterViewChecked } from '@angular/core';
import { AsRowSpanService } from './as-row-span.service';

@Directive({
  selector: '[asRowSpan]'
})
export class AsRowSpanDirective implements AfterViewChecked {
  @Input() rowIndex: number;
  @Input() colName: string;
  @Input('asRowSpan') rowSpanService: AsRowSpanService;

  constructor(private el: ElementRef) {}

  ngAfterViewChecked(): void {
    this.el.nativeElement.rowSpan = this.rowSpanService.getRowSpan(this.colName, this.rowIndex);
    this.el.nativeElement.style.display = this.rowSpanService.getRowSpan(this.colName, this.rowIndex) ? '' : 'none';
  }
}
