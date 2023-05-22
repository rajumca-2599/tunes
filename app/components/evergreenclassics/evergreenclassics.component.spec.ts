import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvergreenclassicsComponent } from './evergreenclassics.component';

describe('EvergreenclassicsComponent', () => {
  let component: EvergreenclassicsComponent;
  let fixture: ComponentFixture<EvergreenclassicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvergreenclassicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvergreenclassicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
