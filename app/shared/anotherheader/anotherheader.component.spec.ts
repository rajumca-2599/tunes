import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnotherheaderComponent } from './anotherheader.component';

describe('AnotherheaderComponent', () => {
  let component: AnotherheaderComponent;
  let fixture: ComponentFixture<AnotherheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnotherheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnotherheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
