import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsMainComponent } from './as-main.component';

describe('AsMainComponent', () => {
  let component: AsMainComponent;
  let fixture: ComponentFixture<AsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AsMainComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
