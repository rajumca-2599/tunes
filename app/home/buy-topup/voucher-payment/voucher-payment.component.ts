import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SharedService } from 'src/app/shared/SharedService';

@Component({
  selector: 'app-voucher-payment',
  templateUrl: './voucher-payment.component.html',
  styleUrls: ['./voucher-payment.component.css'],
})
export class VoucherPaymentComponent implements OnInit {
  voucherresp: any = {};
  msisdn = '';
  status;
  constructor(
    private imiapi: IMIapiService,
    private router: Router,
    private apidata: ApidataService,
    public env: EnvService,
    private sharedData: SharedService
  ) {}

  ngOnInit(): void {
    this.voucherresp = this.sharedData.getvoucherInfo('voucherresponse');
    if (this.voucherresp != '' && this.voucherresp != 'NA' && this.voucherresp !=undefined)
      this.voucherresp.msisdn = this.imiapi.formatMobileNo(
        this.voucherresp.msisdn
      );
  }
  gotoAccount() {
    this.apidata.footerstateName.next('myaccount');
    this.router.navigate(['/myaccount']);
  }
  gotoHome() {
    this.apidata.footerstateName.next('home');
    this.imiapi.setStorageValue('footerstateName', 'home');
    
    this.router.navigate(['/home']);
  }
  navigateToFeedback() {
    this.imiapi.setSession('transid', this.voucherresp.transid);
    this.imiapi.setSession('paymentchannel',"VOUCHER");
    this.imiapi.setSession('productid',this.voucherresp.vouchercode)
    this.router.navigate(['/paymentfeedback']);
  }
}
