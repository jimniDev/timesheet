import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsTimeInputComponent } from './as-time-input.component';

describe('AsTimeInputComponent', () => {
  let component: AsTimeInputComponent;
  let fixture: ComponentFixture<AsTimeInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AsTimeInputComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsTimeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
