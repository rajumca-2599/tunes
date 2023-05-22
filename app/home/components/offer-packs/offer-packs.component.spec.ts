import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferPacksComponent } from './offer-packs.component';

describe('OfferPacksComponent', () => {
  let component: OfferPacksComponent;
  let fixture: ComponentFixture<OfferPacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferPacksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
