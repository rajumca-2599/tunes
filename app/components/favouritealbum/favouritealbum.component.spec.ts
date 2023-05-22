import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouritealbumComponent } from './favouritealbum.component';

describe('FavouritealbumComponent', () => {
  let component: FavouritealbumComponent;
  let fixture: ComponentFixture<FavouritealbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouritealbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouritealbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
