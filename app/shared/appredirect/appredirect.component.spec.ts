import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppredirectComponent } from './appredirect.component';

describe('AppredirectComponent', () => {
  let component: AppredirectComponent;
  let fixture: ComponentFixture<AppredirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppredirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppredirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
