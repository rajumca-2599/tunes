import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialpackageComponent } from './specialpackage.component';

describe('SpecialpackageComponent', () => {
  let component: SpecialpackageComponent;
  let fixture: ComponentFixture<SpecialpackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialpackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialpackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
