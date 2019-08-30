import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsMainCardComponent } from './as-main-card.component';

describe('AsMainCardComponent', () => {
  let component: AsMainCardComponent;
  let fixture: ComponentFixture<AsMainCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AsMainCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsMainCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
