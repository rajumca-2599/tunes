import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { EnvService } from '../../shared/env.service';
import { IMIapiService } from '../../shared/imiapi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { ApidataService } from 'src/app/shared/apidata.service';
import { retry } from 'rxjs/operators';
declare const clevertap: any;

@Component({
  selector: 'app-partnervalidateotp',
  templateUrl: './partnervalidateotp.component.html',
  styleUrls: ['./partnervalidateotp.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PartnervalidateotpComponent implements OnInit {

  loginResp: any = {};
  // verifyMsg: string = "";
  errMsg: string = '';
  timeLeft: any;
  interval;
  profile:any;
  auth_code:any;
  showResendPwd = false;
  timerOn: boolean = true;
  minutes: any;
  seconds: any;
  hidetimer = true;
  otp: string = '';
  mobileNo: string = '';
  selectedlanguage = 'ID';
  param = { msisdn: '' };
  isSSOLogin = false;
  facebooktid = '';
  source = '';
  @ViewChild('ngOtpInput') ngOtpInput: any;
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private roue:ActivatedRoute,
    public translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private apidata: ApidataService
  ) {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    try {
      clevertap.event.push('OTP');
    } catch (e) {
      console.log('Clevertap:' + e);
    }
    setTimeout(() => {
      //alert('Hidden3');
      document.body.style.overflow = 'hidden';
    }, 1000);
  }

  ngOnInit(): void {

    this.profile = this.imiapi.getSession('profile');
    this.auth_code = this.imiapi.getSession('auth_code');
    try {
      //alert("In PWA ValidateOTP");
      let isSSO = this.imiapi.getSession('isSSO');
      if (isSSO != undefined && isSSO != 'NA' && isSSO != '')
        this.isSSOLogin = true;
      this.loginResp = JSON.parse(this.imiapi.getSession('LoginResp'));
      if (this.loginResp == undefined || this.loginResp == null) {
        this.router.navigate(['partnerlogin',this.profile,this.auth_code]);
        return;
      }
      this.facebooktid =
        this.imiapi.getSession('facebooktid') != '' &&
        this.imiapi.getSession('facebooktid') != 'NA'
          ? this.imiapi.getSession('facebooktid')
          : '';
      this.source =
        this.imiapi.getSession('source') != '' &&
        this.imiapi.getSession('source') != 'NA'
          ? this.imiapi.getSession('source')
          : '';
      this.mobileNo = JSON.parse(this.imiapi.getSession('number'));
      console.log(this.mobileNo);
      this.param.msisdn = this.imiapi.formatMobileNo(this.mobileNo);

      // this.verifyMsg = this.loginResp.message.replace(/!MSISDN!/g, this.mobileNo);
      this.startTimer(this.env.otpmaxtimelimit);
      document.getElementById('otp_1').focus();

      //Added for facebook integration
    } catch (e) {}
    window.scrollTo(0, 0);
  }
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '40px',
      height: '40px',
      border: 'solid 1px #ccc',
    },
  };
  startTimer(remaining) {
    this.interval = setInterval(() => {
      if (remaining >= 0 && this.timerOn) {
        this.minutes = Math.floor(remaining / 60);
        this.seconds = remaining % 60;
        this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
        this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
        this.timeLeft = this.minutes + ':' + this.seconds;
        remaining -= 1;
      } else {
        this.timerOn = false;
        this.showResendPwd = true;
      }
    }, 1000);
  }

  onOtpChange(otp: string) {
    this.otp = otp;
    //this.config =this.config;
    return false;
  }

  validateOTP() {
   
    //this.timerOn = false;

    if (this.otp.length < 6) {
      return;
    }
    if (this.otp == '') {
      this.errMsg = 'Otp Required';
      return;
    }

    var requestObj = {
      transid: this.loginResp.data.transid,
      otp: this.otp,
      profile:this.profile,
      auth_code:this.auth_code
    };
    this.imiapi.removeSession('token');
    this.spinner.show();
    this.errMsg = '';
    var temp = JSON.parse(JSON.stringify(requestObj));
    temp.otp = this.imiapi.msisdnEncrypt(temp.otp);
    this.imiapi.postData('v1/partner/validateotp', temp,"externalpartner").subscribe(
      (response: any) => {
        this.spinner.hide();
        try {
          if (response.status == "0") {
            this.timerOn = false;
            console.log("manageotp9200")
            this.imiapi.removeSession('LoginResp');
            this.imiapi.setSessionValue('token', response.data.auth_code);
            this.imiapi.setSessionValue('lang', this.selectedlanguage);
            this.imiapi.setSessionValue('consent', response.data.consent);
            this.imiapi.setSessionValue('userNavigateUrl', response.data.redirect_uri);
            this.router.navigate(['/partnerdashboard']); 
          } else {
            this.errMsg = response.message;
            this.spinner.hide();
            this.config.inputStyles = {
              width: '40px',
              height: '40px',

              border: 'solid 1px #ee0000',
            };
          }
        } catch (e) {
          this.spinner.hide();
          this.errMsg =
            'Sorry, we could not process your request. Please try later.';
          console.log(e);
        }
      },
      (error) => {
        this.spinner.hide();
        this.errMsg =
          'Sorry, we could not process your request. Please try later.';
        console.log(error);
      }
    );
  }
  resendOtp() {
    if (this.mobileNo == '') {
      return;
    }
    var requestObj = {
      msisdn: this.mobileNo.replace('"', ''),
      action: 'register',
      profile:this.profile,
      auth_code:this.auth_code
    };
    this.spinner.show();
    var temp = JSON.parse(JSON.stringify(requestObj));
    temp.msisdn = this.imiapi.msisdnEncrypt(temp.msisdn);
    this.imiapi.postData('v1/partner/sendsms', temp,"externalpartner").subscribe(
      (response: any) => {
        this.spinner.hide();
        try {
          if (response.status == '0' && response.data.status == 'true') {
            this.imiapi.setSessionValue('lang', this.selectedlanguage);
            this.imiapi.removeSession('LoginResp');
            this.imiapi.setSession('LoginResp', response);
            this.loginResp = JSON.parse(this.imiapi.getSession('LoginResp'));
            // this.imiapi.setSession("LoginResp", response);
            this.imiapi.setSession('tocken', requestObj.msisdn);
            this.router.navigate(['/validateotp']);
            // this.verifyMsg = this.loginResp.message.replace(/!MSISDN!/g, this.imiapi.getSession("number"))
            this.param.msisdn = this.imiapi.formatMobileNo(
              JSON.parse(this.imiapi.getSession('tocken'))
            );
            this.showResendPwd = false;
            this.timerOn = true;
            clearInterval(this.interval);
            this.startTimer(this.env.otpmaxtimelimit);
            this.errMsg = '';
            this.ngOtpInput.setValue('');
            this.otp = '';
            this.config.inputStyles = {
              width: '40px',
              height: '40px',
              border: 'solid 1px #ccc',
            };
          } else {
            this.errMsg = response.message;
          }
        } catch (e) {
          this.errMsg =
            'Sorry, we could not process your request. Please try later!';
          console.log(e);
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  switchLang(id: string) {
    if (navigator.onLine) {
      this.selectedlanguage = id;

      this.imiapi.setSessionValue('lang', id);
      this.translate.use(id);
    }
  }
  eventHandler(event, id) {
    if (event.keyCode != 8) {
      if (event.keyCode >= 48 && event.keyCode <= 57) {
        if (id < 6) {
          let _id = id + 1;
          document.getElementById('otp_' + _id).focus();
        }
      } else {
        event.preventDefault();
        return;
      }
      this.formotptext();
    }
  }
  downevent(event, id) {
    if (event.keyCode == 8) {
      if (id > 1) {
        setTimeout(() => {
          let _id = id - 1;
          document.getElementById('otp_' + _id).focus();
          this.formotptext();
        }, 1);
      } else {
        setTimeout(() => {
          this.formotptext();
        }, 1);
      }
    } else {
      if (event.keyCode >= 48 && event.keyCode <= 57) {
      } else {
        event.preventDefault();
        return;
      }
    }
  }
  formotptext() {
    try {
      this.otp = '';
      let _removenext = false;
      for (let a = 1; a <= 6; a++) {
        let _element = <HTMLInputElement>document.getElementById('otp_' + a);
        let otp1 = _element.value;
        if (_removenext) {
          otp1 = '';
          _element.value = '';
        } else {
          if (otp1 == '') {
            _removenext = true;
          }
        }
        this.otp += otp1;
      }
    } catch (e) {}
    console.log(this.otp);
  }

}
