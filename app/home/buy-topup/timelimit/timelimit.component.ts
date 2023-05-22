import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { interval, Subscription } from 'rxjs';
import { ApidataService } from 'src/app/shared/apidata.service';
import { de } from 'date-fns/locale';
import { SharedService } from 'src/app/shared/SharedService';
import { AmountConverterPipe } from 'src/app/shared/directives/amount-converter.pipe';
import { timeStamp } from 'console';
import { DatePipe, formatDate } from '@angular/common';
@Component({
  selector: 'app-timelimit',
  templateUrl: './timelimit.component.html',
  styleUrls: ['./timelimit.component.css'],
  providers: [AmountConverterPipe],
})
export class TimelimitComponent implements OnInit {
  data: any = {};
  reqobj: any = {};
  public otpmaxtimelimit: string = '';
  interval;
  minutes: any;
  seconds: any;
  timerOn: boolean = true;
  errMsg: string = '';
  timeLeft: any;
  alive: boolean = false;
  selectedlanguage = 'ID';
  todayDate = new Date();
  apicalls = this.env.maxapicalls;
  helpurl: string = '';
  locale = '';
  topupamount = '';
  topupdecimal = '';
  shopeepaytimeLeft: any;
  topupNumber = '';
  selecteddenom = '';
  shopeepayapicalls = this.env.shopeepaymaxapicalls;
  shopeepaytimer: boolean = true;
  shopeeminutes: any;
  shopeeseconds: any;
  timer: boolean = true;
  topupid = '';
  sourcescreen = '';
  shopeepayfrequencyapicalls: any;
  mySub: Subscription;
  gift: any = 'N';
  finaltransaction = true;
  paymentmode = '';
  constructor(
    private translate: TranslateService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    public imiapi: IMIapiService,
    public env: EnvService,
    private apidata: ApidataService,
    private sharedService: SharedService,
    private convertor: AmountConverterPipe
  ) {}

  ngOnInit(): void {
    if (this.selectedlanguage == 'ID') this.locale = 'hi';
    else this.locale = 'en';
    this.helpurl = this.imiapi.getglobalsettings();
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.data = JSON.parse(this.imiapi.getSession('topupsucessresp'));
    this.reqobj = JSON.parse(this.imiapi.getSession('topupreqobj'));
    this.reqobj.tomsisdn = this.imiapi.formatMobileNo(this.reqobj.tomsisdn);
    this.data.msisdn = this.imiapi.formatMobileNo(this.data.msisdn);
    this.paymentmode =
      this.reqobj.paymentchannel == 'SHOPEE_PAY'
        ? 'ShopeePay'
        : this.reqobj.paymentchannel;
    if (this.reqobj.paymentchannel == 'OVO') {
      this.otpmaxtimelimit = this.env.ovomaxtimelimit;
    } else if (this.reqobj.paymentchannel == 'GOPAY') {
      this.otpmaxtimelimit = this.env.gopaymaxtimelimit;
    } else if (this.reqobj.paymentchannel == 'SHOPEE_PAY') {
      this.shopeepayfrequencyapicalls = this.env.shopeepayapifreq;
      this.otpmaxtimelimit = this.env.shopeepaymaxtimelimit;
    } else if (this.reqobj.type == 'banking') {
      this.otpmaxtimelimit = this.env.bankmaxtimelimit;
    } else if (this.reqobj.type == 'card') {
      this.otpmaxtimelimit = this.env.cardmaxtimelimit;
    } else if (this.reqobj.type == 'balance') {
      this.otpmaxtimelimit = this.env.balancemaxtimelimit;
    }
    if (this.reqobj.transtype == 'content') {
      let price = this.reqobj.normalprice - this.reqobj.discountprice;
      let amount = this.convertor.transformAmount(price);
      if (amount != '0' && amount != undefined && typeof amount === 'string') {
        if (amount.includes(',')) {
          this.topupamount = amount.split(',')[0];
          this.topupdecimal = '.' + amount.split(',')[1];
        } else {
          this.topupamount = amount.split('.')[0];
          this.topupdecimal = '.' + amount.split('.')[1];
        }
      } else {
        this.topupamount = price.toString();
      }
    }
    if (this.reqobj.type == 'balance' || this.reqobj.type == 'card') {
      this.startTimer(this.otpmaxtimelimit);
      // interval(10000).subscribe((x) => {
      //   if (this.timerOn == true) {
      //     this.checkStatus();
      //   }
      // });
    }
    this.addMinutes();
    if (this.reqobj.transtype == 'reload') this.getDashboard();
    this.gift = this.imiapi.getSession('gift');
    if (this.gift != undefined && this.gift != 'NA' && this.gift != '')
      this.gift = JSON.parse(this.imiapi.getSession('gift'));
    this.topupNumber = JSON.parse(this.imiapi.getSession('topupnumber'));
    this.selecteddenom = JSON.parse(this.imiapi.getSession('selectedamount'));
    if (
      this.selecteddenom != 'NA' &&
      this.selecteddenom != undefined &&
      this.selecteddenom != ''
    ) {
      let amount = this.convertor.transformAmount(this.selecteddenom);
      if (amount != '0' && amount != undefined && typeof amount === 'string') {
        if (amount.includes(',')) {
          this.selecteddenom = amount.split(',')[0];
          this.topupdecimal = '.' + amount.split(',')[1];
        } else {
          this.selecteddenom = amount.split('.')[0];
          this.topupdecimal = '.' + amount.split('.')[1];
        }
      }
    }
    //this.getshopeePayApiFreq();
    if (this.reqobj.paymentchannel == 'SHOPEE_PAY') {
      try {
        let apihittedalready = this.imiapi.getSession('shopeepayapi');
        if (
          apihittedalready != 'NA' &&
          apihittedalready != null &&
          apihittedalready != ''
        )
          apihittedalready = JSON.parse(apihittedalready);
        if (apihittedalready == 'Y') {
          let txnid = this.imiapi.getSession('shopeepaytxnid');
          if (txnid != 'NA' && txnid != null && txnid != '')
            txnid = JSON.parse(txnid);
          if (txnid == this.data.transid) {
            let timeleft = this.imiapi.getSession('shopeepaytime');
            timeleft = JSON.parse(timeleft);
            let apicalls = this.imiapi.getSession('shopeepayapicalls');
            if (apicalls != 'NA' && apicalls != '' && apicalls != null)
              this.shopeepayapicalls = JSON.parse(apicalls);
            this.countdownTimer(timeleft);
          } else {
            this.countdownTimer(this.env.shopeepaymaxtimelimit);
          }
        } else {
          this.checkshopeepayfinal(false);
          this.countdownTimer(this.env.shopeepaymaxtimelimit);         
        }
      } catch (e) {
        console.log(e);
        this.countdownTimer(this.env.shopeepaymaxtimelimit);
      }
    }
    this.topupid = JSON.parse(this.imiapi.getSession('topupvouchercode'));
    this.sourcescreen = JSON.parse(this.imiapi.getSession('sourcescreen'));
    if (this.reqobj.paymentchannel == 'SHOPEE_PAY') {
     
      this.mySub = interval(this.shopeepayfrequencyapicalls).subscribe(
        (func) => {
          this.shopeepaycheckStatus();
        }
      );
    }
    this.reqobj.transtype = 'billpay';
  }
  addMinutes() {
    if (this.data.expirytime != null && this.data.expirytime != undefined)
      this.todayDate.setMinutes(
        this.todayDate.getMinutes() + this.data.expirytime
      );
  }
  startTimer(remaining) {
    this.interval = setInterval(() => {
      if (remaining >= 0 && this.timerOn) {
        this.minutes = Math.floor(remaining / 60);
        this.seconds = remaining % 60;
        this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
        this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
        this.timeLeft = this.minutes + ':' + this.seconds;
        remaining -= 1;
        this.checkStatus();
      } else {
        this.timerOn = false;
        clearInterval(this.interval);
        //this.router.navigate(['/failed']);
      }
    }, 2000);
  }
  gotoHome() {
    this.imiapi.setStorageValue('page', 'home');
    this.imiapi.setStorageValue('footerstateName', 'home');
    this.apidata.footerstateName.next('home');
   
    this.router.navigate(['/home']);
  }

  checkStatus() {
    if (this.apicalls != 0 && this.apicalls != -1 && this.timerOn == true) {
      var obj = {
        paymenttid: this.data.transid,
      };
      this.spinner.show();
      this.imiapi.postData('v1/payment/chkstatus/v2', obj).subscribe(
        (response: any) => {
          this.spinner.hide();
          this.apicalls = this.apicalls - 1;
          if (this.apicalls == 0 || this.apicalls == -1) this.timerOn = false;
          if (response.code == '10002' || response.code == '11111') {
            this.imiapi.clearSession();
            // this.router.navigate(['/login']);
            // Added on 27thjune to redirect to HE 
              this.router.navigate(['/pwa']);
          }
          if (response.status != null && response.data != undefined) {
            if (response.status == '0') {
              if (
                response.data.checkStatusResp.statusTransaction == 'SUCCESS'
              ) {
                this.imiapi.setSession(
                  'checkstatusresp',
                  response.data.checkStatusResp
                );
                this.router.navigate(['/sucess']);
                this.timerOn = false;
              } else if (
                response.data.checkStatusResp.statusTransaction == 'FAILED'
              ) {
                var obj = {
                  protip: response.data.checkStatusResp.protip,
                };
                this.sharedService.setOption('checkstatusresp', obj);
                this.router.navigate(['/failed']);
                this.timerOn = false;
              }
            } else if (response.code == '10002' || response.code == '11111') {
              this.imiapi.clearSession();
              // this.router.navigate(['/login']);
              // Added on 27thjune to redirect to HE 
                 this.router.navigate(['/pwa']);
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else this.router.navigate(['/failed']);
  }
  ngOnDestroy(): void {
    if (this.reqobj.paymentchannel != 'BALANCE') {
      this.imiapi.removeSession('paymentmethod');
      this.imiapi.removeSession('selectedamount');
      //this.imiapi.removeSession('topupvouchercode');
      this.imiapi.removeSession('topupsucessresp');
      // this.imiapi.removeSession('topupreqobj');
      //this.imiapi.removeSession('topupnumber');
      this.imiapi.removeSession('catgId');
      this.imiapi.removeSession('pvrcode');
      this.imiapi.removeSession('denomresponse');
      //this.imiapi.removeSession('sourcescreen');
      //this.imiapi.removeSession('navigationfrom');
      this.imiapi.removeSession('shortcode');
      this.imiapi.removeSession('keyword');
      this.imiapi.removeSession('offertype');
    }
    if (this.reqobj.paymentchannel == 'SHOPEE_PAY') this.mySub.unsubscribe();
  }
  navigatetoTransaction() {
    this.imiapi.setStorageValue('footerstateName', 'myaccount');
    this.apidata.footerstateName.next('myaccount');
    this.router.navigate(['/transhistory']);
  }

  openNewtab() {
    window.open(this.helpurl);
  }
  navigatetoGopay() {
    window.open(this.data.actionData);
  }
  getDashboard() {
    this.imiapi.postData('v1/dashboard/get/v2', {}).subscribe(
      (response: any) => {
        if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
        }
        if (response.status != null && response.data != undefined) {
          if (response.status == '0') {
            this.imiapi.removeStorage('dashboard');
            this.imiapi.setStorage('dashboard', response.data);
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  navigateToFeedback() {
    this.imiapi.setSession('transid', this.data.transid);
    this.imiapi.setSession('paymentchannel', this.reqobj.paymentchannel);
    this.imiapi.setSession('productid', this.reqobj.offerid);
    this.imiapi.setSession('feedbackscreen', this.reqobj.transtype);
    this.router.navigate(['/paymentfeedback']);
  }
  openshopeepayapp() {
    window.open(this.data.actionData);
  }
  //Added by sinduja #Jira ID:DIGITAL-6747
  shopeepaycheckStatus() {
    console.log(this.shopeepayapicalls);
    if (this.shopeepayapicalls > 0) {
      var obj = {
        paymenttid: this.data.transid,
      };
      this.spinner.show();
      this.imiapi.postData('v1/payment/chkstatus/v2', obj).subscribe(
        (response: any) => {
          this.spinner.hide();
          this.imiapi.setSession('shopeepayapi', 'Y');
          this.shopeepayapicalls = this.shopeepayapicalls - 1;
          this.imiapi.setSession('shopeepayapicalls', this.shopeepayapicalls);
          if (response.code == '10002' || response.code == '11111') {
            this.imiapi.clearSession();
            this.router.navigate(['/login']);
          }
          this.imiapi.setSession('shopeepaytxnid', this.data.transid);
          if (response.status != null && response.data != undefined) {
            if (response.status == '0') {
              if (
                response.data.checkStatusResp.statusTransaction == 'SUCCESS'
              ) {
                this.imiapi.setSession(
                  'checkstatusresp',
                  response.data.checkStatusResp
                );
                this.router.navigate(['/sucess']);
                this.timerOn = false;
                this.shopeepaytimer = false;
              } else if (
                response.data.checkStatusResp.statusTransaction == 'FAILED'
              ) {
                var obj = {
                  protip: response.data.checkStatusResp.protip,
                };
                this.sharedService.setOption('checkstatusresp', obj);
                this.router.navigate(['/failed']);
                this.timerOn = false;
                this.shopeepaytimer = false;
              }
            } else if (response.code == '10002' || response.code == '11111') {
              this.imiapi.clearSession();
              // this.router.navigate(['/login']);
              // Added on 27thjune to redirect to HE 
              this.router.navigate(['/pwa']);
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
    // else if (this.shopeepayapicalls < 0) {
    //   this.router.navigate(['/failed']);
    // }
  }
  countdownTimer(remaining) {
    this.interval = setInterval(() => {
      if (remaining >= 0 && this.shopeepaytimer) {
        this.shopeeminutes = Math.floor(remaining / 60);
        this.shopeeseconds = remaining % 60;
        this.shopeeminutes =
          this.shopeeminutes < 10
            ? '0' + this.shopeeminutes
            : this.shopeeminutes;
        this.shopeeseconds =
          this.shopeeseconds < 10
            ? '0' + this.shopeeseconds
            : this.shopeeseconds;
        this.shopeepaytimeLeft = this.shopeeminutes + ':' + this.shopeeseconds;
        this.imiapi.setSession('shopeepaytimer', true);
        this.imiapi.setSession('shopeepaytime', remaining);
        remaining -= 1;
      } else {
        this.imiapi.setSession('shopeepaytimer', false);
        this.shopeepaytimer = false;
        // this.router.navigate(['/failed']);
        this.checkshopeepayfinal(true);
      }
    }, 1000);
  }
  opensnack(text: string): void {
    console.log(text);
  }
  checkshopeepayfinal(isFinal) {
    if (this.finaltransaction) {
      var obj = {
        paymenttid: this.data.transid,
      };
      this.spinner.show();
      this.imiapi.postData('v1/payment/chkstatus/v2', obj).subscribe(
        (response: any) => {
          this.spinner.hide();
          if (isFinal) this.finaltransaction = false;
          else {
            this.imiapi.setSession('shopeepayapi', 'Y');
            this.imiapi.setSession('shopeepaytxnid', this.data.transid);
            this.shopeepayapicalls = this.shopeepayapicalls - 1;
          }
          if (response.code == '10002' || response.code == '11111') {
            this.imiapi.clearSession();
            // this.router.navigate(['/login']);
            // Added on 27thjune to redirect to HE 
            this.router.navigate(['/pwa']);
          }
          if (response.status != null && response.data != undefined) {
            if (response.status == '0') {
              if (
                response.data.checkStatusResp.statusTransaction == 'SUCCESS'
              ) {
                this.imiapi.setSession(
                  'checkstatusresp',
                  response.data.checkStatusResp
                );
                this.router.navigate(['/sucess']);
                this.timerOn = false;
                this.shopeepaytimer = false;
              } else if (
                response.data.checkStatusResp.statusTransaction == 'FAILED'
              ) {
                var obj = {
                  protip: response.data.checkStatusResp.protip,
                };
                this.sharedService.setOption('checkstatusresp', obj);
                this.router.navigate(['/failed']);
                this.timerOn = false;
                this.shopeepaytimer = false;
              }
            } else if (response.code == '10002' || response.code == '11111') {
              this.imiapi.clearSession();
              // this.router.navigate(['/login']);
              // Added on 27thjune to redirect to HE 
              this.router.navigate(['/pwa']);
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
