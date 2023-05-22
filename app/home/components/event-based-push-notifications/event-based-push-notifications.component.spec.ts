import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBasedPushNotificationsComponent } from './event-based-push-notifications.component';

describe('EventBasedPushNotificationsComponent', () => {
  let component: EventBasedPushNotificationsComponent;
  let fixture: ComponentFixture<EventBasedPushNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventBasedPushNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventBasedPushNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
