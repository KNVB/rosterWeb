import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRosterComponent } from './show-roster.component';

describe('ShowRosterComponent', () => {
  let component: ShowRosterComponent;
  let fixture: ComponentFixture<ShowRosterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowRosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
