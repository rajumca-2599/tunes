import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-otp-history',
  templateUrl: './otp-history.component.html',
  styleUrls: ['./otp-history.component.css']
})
export class OtpHistoryComponent implements OnInit {

  @Input()
  msisdn: string = "";
  startdate: Date = new Date();
  d = new Date();
  year = this.d.getFullYear();
  month = this.d.getMonth();
  day = this.d.getDate();
  enddate: Date = new Date(this.year + 2, this.month, this.day, 23, 59, 59);
  constructor() { }

  ngOnInit() {
    console.log(this.msisdn);
  }

}
