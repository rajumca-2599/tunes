import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerdetailsComponent } from './partnerdetails.component';

describe('PartnerdetailsComponent', () => {
  let component: PartnerdetailsComponent;
  let fixture: ComponentFixture<PartnerdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
