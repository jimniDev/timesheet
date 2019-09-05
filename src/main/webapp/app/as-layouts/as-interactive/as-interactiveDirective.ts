import { Directive, HostListener, OnInit, Renderer2, ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Directive({
  selector: '[as-timeInteractive]'
})
export class InteractiveDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2, private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe(result => {
      if (result.matches) {
        this.renderer.addClass(this.el.nativeElement, 'footer');
      } else {
        this.renderer.removeClass(this.el.nativeElement, 'footer');
      }
    });
  }
}
