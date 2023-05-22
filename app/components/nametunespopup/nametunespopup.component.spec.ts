import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NametunespopupComponent } from './nametunespopup.component';

describe('NametunespopupComponent', () => {
  let component: NametunespopupComponent;
  let fixture: ComponentFixture<NametunespopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NametunespopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NametunespopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
