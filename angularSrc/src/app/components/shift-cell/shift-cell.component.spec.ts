import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftCellComponent } from './shift-cell.component';

describe('ShiftCellComponent', () => {
  let component: ShiftCellComponent;
  let fixture: ComponentFixture<ShiftCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
