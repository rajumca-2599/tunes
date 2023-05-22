import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApidataService } from 'src/app/shared/apidata.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';

@Component({
  selector: 'app-paymentcallback',
  templateUrl: './paymentcallback.component.html',
  styleUrls: ['./paymentcallback.component.css'],
})
export class PaymentcallbackComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService, private router: Router,
    private imiapi:IMIapiService,
    private apidata:ApidataService) {}

  ngOnInit(): void {
    this.spinner.show();
    this.apidata.footerstateName.next('myaccount');
    this.imiapi.setStorageValue('footerstateName','myaccount');
    this.router.navigate(['/transhistory']);
    this.spinner.hide();
  }
}
