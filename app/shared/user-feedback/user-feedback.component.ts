import { Component, OnInit } from '@angular/core';
import { EnvService } from '../env.service';
import { IMIapiService } from '../imiapi.service';

@Component({
  selector: 'app-user-feedback',
  templateUrl: './user-feedback.component.html',
  styleUrls: ['./user-feedback.component.css'],
})
export class UserFeedbackComponent implements OnInit {
  constructor(private imiapi: IMIapiService, public env: EnvService) {}
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number = 4;
  ngOnInit(): void {}
  navigateToPlayStore() {
    if (this.imiapi.getOS() == 'IOS') location.href = this.env.appStoreUrl;
    else location.href = this.env.playStoreUrl;
  }
  addClass(star) {
    console.log('star', star);
    console.log('selectedvalue', this.selectedValue);
    let ab = '';
    for (let i = 0; i < star; i++) {
      console.log('star i', star);
      ab = 'starId' + i;
      document.getElementById(ab).classList.add('selected');
    }
  }
  removeClass(star) {
    console.log('removestar', star);
    let ab = '';
    for (let i = star - 1; i >= this.selectedValue; i--) {
      console.log('star i', star);
      ab = 'starId' + i;
      document.getElementById(ab).classList.remove('selected');
    }
  }
  countStar(star) {
    this.selectedValue = star;
  }
}
