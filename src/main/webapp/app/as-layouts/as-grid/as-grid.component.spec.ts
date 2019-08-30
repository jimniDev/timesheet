import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsGridComponent } from './as-grid.component';

describe('AsGridComponent', () => {
  let component: AsGridComponent;
  let fixture: ComponentFixture<AsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AsGridComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
