import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreesongpackComponent } from './freesongpack.component';

describe('FreesongpackComponent', () => {
  let component: FreesongpackComponent;
  let fixture: ComponentFixture<FreesongpackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreesongpackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreesongpackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
