import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncryptdeeplinkComponent } from './encryptdeeplink.component';

describe('EncryptdeeplinkComponent', () => {
  let component: EncryptdeeplinkComponent;
  let fixture: ComponentFixture<EncryptdeeplinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncryptdeeplinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncryptdeeplinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
