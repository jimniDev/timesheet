import { Component, OnInit, Input, ViewChild, ElementRef, Renderer, Optional, Self, HostBinding, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormGroup, NgControl, FormBuilder } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'as-time-input',
  providers: [{ provide: MatFormFieldControl, useExisting: AsTimeInputComponent }],
  templateUrl: './as-time-input.component.html',
  styleUrls: ['./as-time-input.component.scss']
})
export class AsTimeInputComponent implements OnInit, OnDestroy, ControlValueAccessor, MatFormFieldControl<string> {
  @Input()
  get value(): string | null {
    if (this.parts.value.hours && this.parts.value.minutes) {
      return this.parts.value.hours + ':' + this.parts.value.minutes;
    }
  }
  set value(value: string | null) {
    const res = value.split(':');
    if (res.length === 2) {
      this.parts.setValue({ hours: res[0], minutes: res[1] });
    } else {
      this.parts.setValue({ hours: '', minutes: '' });
    }
    this.stateChanges.next();
  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  get empty() {
    const n = this.parts.value;
    return !n.hours && !n.minutes;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }

  static nextId = 0;
  autofilled?: boolean;

  stateChanges = new Subject<void>();

  parts: FormGroup;

  // public hours: string;
  // public minutes: string;

  focused = false;
  errorState = false;

  controlType = 'as-time-input';

  @HostBinding() id = `as-time-input-${AsTimeInputComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') describedBy = '';

  private _placeholder: string;
  private _required = false;
  private _disabled = false;

  private onChange: Function;
  private onTouched: Function;

  @ViewChild('hours', { static: false }) private hoursInput: ElementRef;
  // To focus on minute input field
  @ViewChild('minutes', { static: false }) private minutesInput: ElementRef;

  constructor(
    private renderer: Renderer,
    @Optional() @Self() public ngControl: NgControl,
    formBuilder: FormBuilder,
    fb: FormBuilder,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    private platform: Platform
  ) {
    // Replace the provider from above with this.
    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    this.parts = formBuilder.group({
      hours: '',
      minutes: ''
    });

    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }

  onFocus(event: any) {
    if (!(this.platform.IOS || this.platform.EDGE)) {
      event.target.select();
    } else {
      setTimeout(event.target.select.bind(event.target), 10);
    }
  }

  onKeyDown(event) {
    const e = <KeyboardEvent>event;
    if (
      // modification : blocked the period (.)
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }

  writeValue(time: string | null): void {
    this.value = time;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  hoursChangeToMinutes() {
    const input = this.hoursInput.nativeElement;
    if (this.parts.value.hours.length > 1 && !(input.selectionStart === 0 && input.selectionEnd === this.parts.value.hours.length)) {
      this.minutesInput.nativeElement.focus();
    }
  }

  _handleInput(): void {
    this.hoursChangeToMinutes();
    this.onChange(this.value);
  }
}
