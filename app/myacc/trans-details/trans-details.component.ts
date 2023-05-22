import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { SharedService } from '../../shared/SharedService';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { ApidataService } from 'src/app/shared/apidata.service';
import { TranslateService } from '@ngx-translate/core';
import { AmountConverterPipe } from 'src/app/shared/directives/amount-converter.pipe';
import { el } from 'date-fns/locale';
import { DatePipe, formatDate } from '@angular/common';
@Component({
  selector: 'app-trans-details',
  templateUrl: './trans-details.component.html',
  styleUrls: ['./trans-details.component.css'],
  providers: [AmountConverterPipe],
})
export class TransDetailsComponent implements OnInit {
  public transdetails: any = {};
  discountpercentage: any = 0;
  totalprice: any = 0;
  translateddecimal: any = "";
  orginalprice: any = 0;
  helpurl: string = '';
  selectedlanguage = 'ID';
  showpercentage = false;
  orginaldecimal: any = "";
  shopeepaytimer: boolean = false;
  shopeepaytimeLeft: any;
  interval;
  minutes: any;
  seconds: any;
  timer: boolean = true;
  secs: any;
  public timeZone: string = "";
  public dtformat: string = "yyyy-MM-dd  h:mm:ss";
  currentDate: Date;
  shopeePayApiDate: Date;
  totalHours: any;
  totalMinutes: any;
  totalDays: any;
  totalSeconds: any;
  constructor(
    private sharedService: SharedService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public env: EnvService,
    private imiapi: IMIapiService,
    private apidata: ApidataService,
    private translate: TranslateService,
    private convertor: AmountConverterPipe,
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit(): void {
    this.spinner.hide();
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.helpurl = this.imiapi.getglobalsettings();
    var _transdata = this.sharedService.getOption();
    if (_transdata && _transdata['details']) {
      this.transdetails = _transdata['details'];
      this.totalprice = this.convertor.transformAmount(this.transdetails.price);
      let originalmaount = this.convertor.transformAmount(
        this.transdetails.price
      );
      if (originalmaount != '0' && originalmaount != undefined) {
        if (typeof originalmaount === 'string') {
          if (originalmaount.includes(',')) {
            this.orginalprice = originalmaount.split(',')[0];
            this.orginaldecimal = '.' + originalmaount.split(',')[1];
          } else {
            this.orginalprice = originalmaount.split('.')[0];
            this.orginaldecimal = '.' + originalmaount.split('.')[1];
          }
        } else {
          this.orginalprice = originalmaount;
        }
      }
      if (
        this.transdetails.discountprice != '0' &&
        this.transdetails.price != '0.0'
      ) {
        if (Math.sign(this.transdetails.discountprice) == 1) {
          this.showpercentage = true;
          this.discountpercentage =
            (parseFloat(this.transdetails.discountprice) * 100) /
            parseFloat(this.transdetails.price);
          this.discountpercentage = parseFloat(this.discountpercentage).toFixed(
            0
          );
          this.totalprice =
            this.transdetails.price - this.transdetails.discountprice;
          let formatedamount = this.convertor.transformAmount(this.totalprice)
          this.formatAmount(formatedamount);
        } else {
          this.showpercentage = false;
          this.discountpercentage = this.transdetails.discountprice;
          this.totalprice = this.transdetails.price - this.transdetails.discountprice;
          let formatedamount = this.convertor.transformAmount(this.totalprice)
          this.formatAmount(formatedamount);
        }
      }
    }
    //Added by sinduja #Jira ID:DIGITAL-6747
    console.log(this.locale);
    if (this.transdetails.paymentchannel == 'ShopeePay') {
      var transactiontime = this.transform(this.transdetails.timestamp);
      this.currentDate = new Date();
      this.shopeePayApiDate = new Date(transactiontime);
      this.timeDiffCalc(this.shopeePayApiDate, this.currentDate);
    }
  }


  formatAmount(amount) {
    if (amount != '0' && amount != undefined) {
      if (typeof amount === 'string') {
        if (amount.includes(',')) {
          this.totalprice = amount.split(',')[0];
          this.translateddecimal = '.' + amount.split(',')[1];
        } else {
          this.totalprice = amount.split('.')[0];
          this.translateddecimal = '.' + amount.split('.')[1];
        }
      } else {
        this.totalprice = amount;
      }
    }
  }
  doitagain(): void {
    if (
      this.transdetails.operationtype === 'BUY' ||
      this.transdetails.operationtype === 'GIFT'
    ) {
      this.imiapi.setSession('pvrcode', this.transdetails.productid);
      this.imiapi.setSession('navigationfrom', 'transhistory');
      this.imiapi.setStorageValue('page', 'package');
      this.imiapi.setStorageValue('footerstateName', 'package');
      this.apidata.footerstateName.next('package');
      this.router.navigate(['/viewpackage']);
    }
    if (this.transdetails.operationtype === 'TOP UP') {
      this.imiapi.setSession('buyagainamount', this.transdetails.price);
      this.router.navigate(['topup']);
    }
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  paynow() {
    this.apidata.footerstateName.next('myaccount');
    this.imiapi.setStorageValue('footerstateName', 'myaccount');
    this.router.navigate(['/billinghistory']);
  }
  buypackage() {
    this.apidata.footerstateName.next('package');
    this.imiapi.setStorageValue('footerstateName', 'package');
    this.imiapi.setSession('pvrcode', this.transdetails.productid);
    this.imiapi.setSession('navigationfrom', 'transhistory');
    this.router.navigate(['/viewpackage']);
  }
  openshopeepayapp() {
    window.open(this.transdetails.aj_reference_id);
  }
  countdownTimer(remaining) {
    this.interval = setInterval(() => {
      if (remaining >= 0 && this.shopeepaytimer) {
        // this.minutes = this.shopeepaytimeLeft.split(':')[0];
        // this.seconds = this.shopeepaytimeLeft.split(':')[1];
        this.minutes = Math.floor(remaining / 60);
        this.seconds = remaining % 60;
        this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
        this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
        this.shopeepaytimeLeft = this.minutes + ':' + this.seconds;
        remaining -= 1;
      } else {
        this.shopeepaytimer = false;
      }
    }, 1000);
  }
  transform(date: string | Date): string | null {
    this.timeZone = this.env.timezone;
    if (this.timeZone === "" || this.timeZone === undefined)
      this.timeZone = "+0530"; //https://angular.io/api/common/formatDate
    if (typeof date === 'string') {
      const str = date.replace(/[^0-9]/g, '');
      const [year, month, day] =
        [str.substr(0, 4), str.substr(4, 2), str.substr(6, 2)];
      const [hour, min, sec] =
        [str.substr(8, 2), str.substr(10, 2), str.substr(12, 2)];
      date = new Date(+year, +month - 1, +day, +hour, +min, +sec);
    }
    //   const datePipe = new DatePipe(this.locale || 'en');
    //   return datePipe.transform(date, this.dtformat,this.timeZone,this.locale);
    return formatDate(date, this.dtformat, this.locale, this.timeZone);
  }
  timeDiffCalc(dateFuture, dateNow) {
    console.log("Txn Date:" + dateFuture);
    console.log("Current Date:" + dateNow);
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    this.totalDays = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= this.totalDays * 86400;
    console.log('calculated days', this.totalDays);

    // calculate hours
    this.totalHours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= this.totalHours * 3600;
    console.log('calculated hours', this.totalHours);

    // calculate minutes
    this.totalMinutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= this.totalMinutes * 60;
    console.log('minutes', this.totalMinutes);


    this.totalSeconds = Math.abs(dateFuture.getTime() - dateNow.getTime()) / (1000) % 60;

    if (this.totalHours == 0)
      this.countdownTimer(this.totalMinutes * 60);
  }
}

