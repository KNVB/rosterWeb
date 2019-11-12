import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterBodyComponent } from './roster-body.component';

describe('RosterBodyComponent', () => {
  let component: RosterBodyComponent;
  let fixture: ComponentFixture<RosterBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RosterBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RosterBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
