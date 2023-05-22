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
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { ApidataService } from 'src/app/shared/apidata.service';
import { retry } from 'rxjs/operators';
declare const clevertap: any;
@Component({
  selector: 'app-validate-otp',
  templateUrl: './validate-otp.component.html',
  styleUrls: ['./validate-otp.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ValidateOtpComponent implements OnInit {
  loginResp: any = {};
  // verifyMsg: string = "";
  errMsg: string = '';
  timeLeft: any;
  interval;
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
    try {
      //alert("In PWA ValidateOTP");
      let isSSO = this.imiapi.getSession('isSSO');
      if (isSSO != undefined && isSSO != 'NA' && isSSO != '')
        this.isSSOLogin = true;
      this.loginResp = JSON.parse(this.imiapi.getSession('LoginResp'));
      if (this.loginResp == undefined || this.loginResp == null) {
        this.router.navigate(['/login']);
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
    };
    this.imiapi.removeSession('token');
    this.spinner.show();
    this.errMsg = '';
    var temp = JSON.parse(JSON.stringify(requestObj));
    temp.otp = this.imiapi.msisdnEncrypt(temp.otp);
    this.imiapi.postData('v1/otp/validate/v3', temp).subscribe(
      (response: any) => {
        this.spinner.hide();
        try {
          this.imiapi.log(response.status + '|' + response.data.newuser);
          if (response.status == '0') {
            this.timerOn = false;
            this.imiapi.removeSession('LoginResp');
            this.imiapi.setSessionValue('token', response.data.tokenid);
            this.imiapi.setSessionValue('lang', this.selectedlanguage);
            //End
            if (response.data != null && response.data.newuser == 'true') {
              this.getCustomerProfile(true);
              //this.router.navigate(["/updateprofile"]);
              return;
            } else {
              this.getCustomerProfile(false);
            }
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

  //

  getCustomerProfile(isNewUser: boolean) {
    this.spinner.show();
    this.imiapi.postData('v1/profile/get', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        try {
          if (response.status == '0') {
            this.imiapi.removeSession('number');
            response.data.msisdn = this.imiapi.formatMobileNo(
              response.data.msisdn
            );
            this.imiapi.setSession('oauth', response.data);
            this.imiapi.getglobalsettings();
            try {
              clevertap.profile.push({
                Site: {
                  Name: response.data.firstname,
                  Email: response.data.emailid,
                  Identity: this.imiapi.getValidMobileNumber(
                    response.data.msisdn
                  ),
                },
              });
            } catch (e) {
              console.log('Profile Push:' + e);
            }
          }
        } catch (e) {
          console.log(e);
        }
        //GTA4 Code #JIRA ID:DIGITAL-6854 on 25-Oct-21
        console.log(this.isSSOLogin);
        if (this.isSSOLogin) {
          this.imiapi.ga4EventLogging('Login', 'Verify');
        }
        let backurl = this.imiapi.getSession('backurl');
        console.log(backurl);
        if (backurl != undefined && backurl != 'NA' && backurl != '') {
          //Redirect to backUrl with sessionId
          let sessionId = this.imiapi.getSession('token');
          backurl = JSON.parse(backurl);
          //Redirect to backUrl with sessionId
          this.imiapi.redirectToBack(backurl, sessionId);
          return;
        }
        let pvrcode = this.imiapi.getSession('pvrcode');
        console.log(pvrcode);
        let tokenId = this.imiapi.getSession('token');
        if (pvrcode != undefined && pvrcode != 'NA' && pvrcode != '') {
          this.imiapi.setSession('navigationfrom', 'home');
          this.imiapi.OcwRedirection('viewpackage', tokenId, '2', false);
          return;
        }
        let pwa_url = this.imiapi.getSession('pwa_url');
        console.log(pwa_url);
        if (pwa_url != undefined && pwa_url != 'NA' && pwa_url != '') {
          pwa_url = JSON.parse(pwa_url);
          this.imiapi.OcwRedirection(pwa_url, tokenId, '3', false);
          return;
        }
        let catgId = this.imiapi.getSession('catgId');
        console.log(catgId);
        if (catgId != undefined && catgId != 'NA' && catgId != '') {
          this.imiapi.setSession('navigationfrom', 'home');
          this.imiapi.OcwRedirection('category', tokenId, '2', false);
          return;
        }
        if (!this.isSSOLogin) {
          this.imiapi.removeSession('backurl');
          this.imiapi.removeSession('pvrcode');
          //this.imiapi.removeSession('pwa_url');
          this.imiapi.removeSession('isSSO');
          if (isNewUser) this.router.navigate(['/updateprofile']);
          else {
            this.imiapi.setStorageValue('footerstateName', 'home');
           
            this.router.navigate(['/home']);
          }
          return;
        }
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
        if (isNewUser) this.router.navigate(['/updateprofile']);
        else {
          this.imiapi.setStorageValue('footerstateName', 'home');
        
          this.router.navigate(['/home']);
        }
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
    };
    this.spinner.show();
    var temp = JSON.parse(JSON.stringify(requestObj));
    temp.msisdn = this.imiapi.msisdnEncrypt(temp.msisdn);
    this.imiapi.postData('v1/otp/send/v2', temp).subscribe(
      (response: any) => {
        this.spinner.hide();
        try {
          if (response.status == '0' && response.data.status == 'true') {
            this.imiapi.setSessionValue('lang', this.selectedlanguage);
            this.imiapi.removeSession('LoginResp');
            this.imiapi.setSession('LoginResp', response);
            this.loginResp = JSON.parse(this.imiapi.getSession('LoginResp'));
            // this.imiapi.setSession("LoginResp", response);
            this.imiapi.setSession('number', requestObj.msisdn);
            this.router.navigate(['/validateotp']);
            // this.verifyMsg = this.loginResp.message.replace(/!MSISDN!/g, this.imiapi.getSession("number"))
            this.param.msisdn = this.imiapi.formatMobileNo(
              JSON.parse(this.imiapi.getSession('number'))
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
