import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopdrawerComponent } from './topdrawer.component';

describe('TopdrawerComponent', () => {
  let component: TopdrawerComponent;
  let fixture: ComponentFixture<TopdrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopdrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopdrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
