import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsInteractiveComponent } from './as-interactive.component';

describe('AsInteractiveComponent', () => {
  let component: AsInteractiveComponent;
  let fixture: ComponentFixture<AsInteractiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AsInteractiveComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsInteractiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
