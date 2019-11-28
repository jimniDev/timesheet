import { Directive, Input, ElementRef, AfterViewChecked, Renderer2 } from '@angular/core';
import { AsRowSpanService } from './as-row-span.service';

@Directive({
  selector: '[asRowSpan]'
})
export class AsRowSpanDirective implements AfterViewChecked {
  @Input() rowIndex: number;
  @Input() colName: string;
  @Input('asRowSpan') rowSpanService: AsRowSpanService;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewChecked(): void {
    this.renderer.setAttribute(this.el.nativeElement, 'rowSpan', this.rowSpanService.getRowSpan(this.colName, this.rowIndex).toString());
    this.renderer.setStyle(this.el.nativeElement, 'display', this.rowSpanService.getRowSpan(this.colName, this.rowIndex) ? '' : 'none');
  }
}
