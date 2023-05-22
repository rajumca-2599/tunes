import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccdashboardComponent } from './accdashboard.component';

describe('AccdashboardComponent', () => {
  let component: AccdashboardComponent;
  let fixture: ComponentFixture<AccdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
