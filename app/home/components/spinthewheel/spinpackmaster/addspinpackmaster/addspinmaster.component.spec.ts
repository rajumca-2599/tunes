import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddspinmasterComponent } from './addspinmaster.component';

describe('AddspinmasterComponent', () => {
  let component: AddspinmasterComponent;
  let fixture: ComponentFixture<AddspinmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddspinmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddspinmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
