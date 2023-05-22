import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddofferPackComponent } from './addoffer-pack.component';

describe('AddofferPackComponent', () => {
  let component: AddofferPackComponent;
  let fixture: ComponentFixture<AddofferPackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddofferPackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddofferPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
