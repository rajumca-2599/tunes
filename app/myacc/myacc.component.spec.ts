import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyaccComponent } from './myacc.component';

describe('MyaccComponent', () => {
  let component: MyaccComponent;
  let fixture: ComponentFixture<MyaccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyaccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyaccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
