import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftInfoTableComponent } from './shift-info-table.component';

describe('ShiftInfoTableComponent', () => {
  let component: ShiftInfoTableComponent;
  let fixture: ComponentFixture<ShiftInfoTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftInfoTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftInfoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
