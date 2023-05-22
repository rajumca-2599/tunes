import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';

@Component({
  selector: 'app-top-up-sucess',
  templateUrl: './top-up-sucess.component.html',
  styleUrls: ['./top-up-sucess.component.css'],
})
export class TopUpSucessComponent implements OnDestroy {
  data: any = {};
  checkstatusresp: any = {};
  helpurl: string = '';
  reqobj: any = {};
  constructor(
    private translate: TranslateService,
    private router: Router,
    public imiapi: IMIapiService,
    public env: EnvService,
    private apidata: ApidataService
  ) {}
  gotoHome() {
    this.imiapi.setStorageValue('footerstateName', 'home');
    this.apidata.footerstateName.next('home');
    
    this.router.navigate(['/home']);
  }
  ngOnInit(): void {
    this.helpurl = this.imiapi.getglobalsettings();
    this.data = JSON.parse(this.imiapi.getSession('topupsucessresp'));
    this.checkstatusresp = JSON.parse(
      this.imiapi.getSession('checkstatusresp')
    );
    this.reqobj = JSON.parse(this.imiapi.getSession('topupreqobj'));
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
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  naviagtetoaccount() {
    this.apidata.footerstateName.next('myaccount');
    this.imiapi.setStorageValue('footerstateName', 'myaccount');
    this.router.navigate(['/myaccount']);
  }
  navigateToFeedback() {
    this.imiapi.setSession('transid', this.data.transid);
    this.imiapi.setSession('paymentchannel',this.reqobj.paymentchannel);
    this.imiapi.setSession('productid',this.reqobj.offerid)
    this.router.navigate(['/paymentfeedback']);
  }
}
