import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeComponent } from './he.component';

describe('HeComponent', () => {
  let component: HeComponent;
  let fixture: ComponentFixture<HeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
