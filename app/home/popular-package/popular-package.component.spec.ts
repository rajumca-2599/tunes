import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularPackageComponent } from './popular-package.component';

describe('PopularPackageComponent', () => {
  let component: PopularPackageComponent;
  let fixture: ComponentFixture<PopularPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
