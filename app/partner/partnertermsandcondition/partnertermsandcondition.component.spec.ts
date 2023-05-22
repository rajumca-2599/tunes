import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnertermsandconditionComponent } from './partnertermsandcondition.component';

describe('PartnertermsandconditionComponent', () => {
  let component: PartnertermsandconditionComponent;
  let fixture: ComponentFixture<PartnertermsandconditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnertermsandconditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnertermsandconditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
