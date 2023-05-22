import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunjabitrandingComponent } from './punjabitranding.component';

describe('PunjabitrandingComponent', () => {
  let component: PunjabitrandingComponent;
  let fixture: ComponentFixture<PunjabitrandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PunjabitrandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PunjabitrandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
