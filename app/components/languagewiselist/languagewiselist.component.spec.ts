import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagewiselistComponent } from './languagewiselist.component';

describe('LanguagewiselistComponent', () => {
  let component: LanguagewiselistComponent;
  let fixture: ComponentFixture<LanguagewiselistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguagewiselistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagewiselistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
