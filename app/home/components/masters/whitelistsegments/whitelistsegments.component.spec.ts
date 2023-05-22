import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhitelistsegmentsComponent } from './whitelistsegments.component';

describe('WhitelistsegmentsComponent', () => {
  let component: WhitelistsegmentsComponent;
  let fixture: ComponentFixture<WhitelistsegmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhitelistsegmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhitelistsegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
