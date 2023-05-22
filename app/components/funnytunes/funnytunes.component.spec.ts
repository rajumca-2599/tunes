import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnytunesComponent } from './funnytunes.component';

describe('FunnytunesComponent', () => {
  let component: FunnytunesComponent;
  let fixture: ComponentFixture<FunnytunesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunnytunesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunnytunesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
