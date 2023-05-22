import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToptandingComponent } from './toptanding.component';

describe('ToptandingComponent', () => {
  let component: ToptandingComponent;
  let fixture: ComponentFixture<ToptandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToptandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToptandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
