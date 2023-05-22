import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularContentComponent } from './popular-content.component';

describe('PopularContentComponent', () => {
  let component: PopularContentComponent;
  let fixture: ComponentFixture<PopularContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
