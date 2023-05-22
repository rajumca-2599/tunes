import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RBTportaldashboardComponent } from './rbtportaldashboard.component';

describe('RBTportaldashboardComponent', () => {
  let component: RBTportaldashboardComponent;
  let fixture: ComponentFixture<RBTportaldashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RBTportaldashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RBTportaldashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
