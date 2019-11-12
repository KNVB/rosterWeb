import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ITORosterRowComponent } from './itoroster-row.component';

describe('ITORosterRowComponent', () => {
  let component: ITORosterRowComponent;
  let fixture: ComponentFixture<ITORosterRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ITORosterRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ITORosterRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
