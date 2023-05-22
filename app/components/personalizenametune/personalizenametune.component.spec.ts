import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizenametuneComponent } from './personalizenametune.component';

describe('PersonalizenametuneComponent', () => {
  let component: PersonalizenametuneComponent;
  let fixture: ComponentFixture<PersonalizenametuneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalizenametuneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalizenametuneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
