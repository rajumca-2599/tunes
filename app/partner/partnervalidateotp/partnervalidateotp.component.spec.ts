import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnervalidateotpComponent } from './partnervalidateotp.component';

describe('PartnervalidateotpComponent', () => {
  let component: PartnervalidateotpComponent;
  let fixture: ComponentFixture<PartnervalidateotpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnervalidateotpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnervalidateotpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
