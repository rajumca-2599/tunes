import { JsonPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SharedService } from 'src/app/shared/SharedService';

@Component({
  selector: 'app-top-up-failed',
  templateUrl: './top-up-failed.component.html',
  styleUrls: ['./top-up-failed.component.css'],
})
export class TopUpFailedComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private imiapi: IMIapiService,
    private translate: TranslateService,
    public env: EnvService,
    private apidata: ApidataService,
    private sharedservice: SharedService
  ) {}
  data: any = {};
  amount: string = '';
  sourcescreen: string = '';
  msisdn: string = '';
  helpurl: string = '';
  reqobj: any = {};
  sucessresp: any = {};
  gift = 'N';
  gotoHome() {
    this.imiapi.setStorageValue('page', 'home');
    this.imiapi.setStorageValue('footerstateName', 'home');
    this.apidata.footerstateName.next('home');
  
    this.router.navigate(['/home']);
  }
  ngOnInit() {
    this.helpurl = this.imiapi.getglobalsettings();
    let selectedamount = this.imiapi.getSession('selectedamount');
    if (
      selectedamount != 'NA' &&
      selectedamount != 'undefined' &&
      selectedamount != ''
    )
      this.amount = JSON.parse(selectedamount);
    this.sourcescreen = JSON.parse(this.imiapi.getSession('sourcescreen'));
    this.msisdn = this.imiapi.formatMobileNo(
      JSON.parse(this.imiapi.getSession('topupnumber'))
    );
    this.reqobj = JSON.parse(this.imiapi.getSession('topupreqobj'));
    let resp = this.sharedservice.getvoucherInfo('checkstatusresp');
    if (resp != undefined && resp != 'NA') this.sucessresp = resp;
    let gift = this.imiapi.getSession('gift');
    if (gift != undefined && gift != 'NA' && gift != '') {
      this.gift = JSON.parse(this.imiapi.getSession('gift'));
      if (this.gift == 'Y')
        this.msisdn = this.imiapi.formatMobileNo(this.reqobj.tomsisdn);
      // this.sucessresp.msisdn=
    }
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  ngOnDestroy(): void {
    this.imiapi.removeSession('paymentmethod');
    this.imiapi.removeSession('selectedamount');
    this.imiapi.removeSession('topupvouchercode');
    this.imiapi.removeSession('topupsucessresp');
    this.imiapi.removeSession('topupreqobj');
    this.imiapi.removeSession('topupnumber');
    this.imiapi.removeSession('catgId');
    this.imiapi.removeSession('pvrcode');
    this.imiapi.removeSession('denomresponse');
    this.imiapi.removeSession('sourcescreen');
    this.imiapi.removeSession('navigationfrom');
    this.imiapi.removeSession('shortcode');
    this.imiapi.removeSession('keyword');
    this.imiapi.removeSession('checkstatusresp');
    this.imiapi.removeSession('gift');
    this.imiapi.removeSession('offertype');
  }
  naviagtetoaccount() {
    this.apidata.footerstateName.next('myaccount');
    this.imiapi.setStorageValue('footerstateName', 'myaccount');
    this.router.navigate(['/myaccount']);
  }
  navigateToFeedback() {
    this.imiapi.setSession('transid', this.sucessresp.transid);
    this.imiapi.setSession('paymentchannel',this.reqobj.paymentchannel);
    this.imiapi.setSession('productid',this.reqobj.offerid)
    this.router.navigate(['/paymentfeedback']);
  }
}
