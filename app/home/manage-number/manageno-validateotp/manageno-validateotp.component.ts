import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
declare var $: any;
@Component({
  selector: 'app-manageno-validateotp',
  templateUrl: './manageno-validateotp.component.html',
  styleUrls: ['./manageno-validateotp.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ManagenoValidateotpComponent implements OnInit {
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
  @ViewChild('ngmanageOtpInput') ngOtpInput: any;
  data: any[] = [];
  parentdata: any[] = [];
  transId = '';
  desc: string = '';
  helpurl: string = '';
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    public translate: TranslateService
  ) {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    setTimeout(() => {
      //alert('Hidden3');
      document.body.style.overflow = 'hidden';
    }, 1000);
  }

  ngOnInit(): void {
    try {
      this.helpurl = this.imiapi.getglobalsettings();
      this.mobileNo = JSON.parse(this.imiapi.getSession('managenumber'));
      this.param.msisdn = this.imiapi.formatMobileNo(this.mobileNo);
      this.transId = JSON.parse(this.imiapi.getSession('transid'));
      this.startTimer(this.env.otpmaxtimelimit);
      document.getElementById('otp_1').focus();
    } catch (e) {}
  }
  manageconfig = {
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
      transid: this.transId,
      otp: this.otp,
    };
    this.spinner.show();
    this.errMsg = '';
    var temp = JSON.parse(JSON.stringify(requestObj));
    temp.otp = this.imiapi.msisdnEncrypt(requestObj.otp);
    this.imiapi.postData('v1/otp/validate/v3', temp).subscribe(
      (response: any) => {
        this.spinner.hide();
        try {
          this.imiapi.log(response.status);
          if (response.status == '0') {
            this.timerOn = false;
            this.addPrimaryLine();
          } else {
            this.errMsg = response.message;
            this.spinner.hide();
            this.manageconfig.inputStyles = {
              width: '40px',
              height: '40px',
              border: 'solid 1px #ee0000',
            };
          }
        } catch (e) {
          this.spinner.hide();
          this.errMsg =
            'Sorry, we could not process your request. Please try later.';
          // console.log(e);
        }
      },
      (error) => {
        this.spinner.hide();
        this.errMsg =
          'Sorry, we could not process your request. Please try later.';
        // console.log(error);
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
    this.imiapi.postData('v1/otp/send', requestObj).subscribe(
      (response: any) => {
        this.spinner.hide();
        try {
          if (response.status == '0' && response.data.status == 'true') {
            this.showResendPwd = false;
            this.timerOn = true;
            clearInterval(this.interval);
            this.startTimer(this.env.otpmaxtimelimit);
            this.errMsg = '';
            this.ngOtpInput.setValue('');
            this.otp = '';
            this.manageconfig.inputStyles = {
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
          // console.log(e);
        }
      },
      (error) => {
        this.spinner.hide();
        //  console.log(error);
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
    // console.log(this.otp);
  }
  backtomanagenumber() {
    this.router.navigate(['/managenumber']);
  }
  addPrimaryLine() {
    var requestObj = {
      transid: this.transId,
      childmsisdn: this.mobileNo,
      title: '',
    };
    this.spinner.show();
    this.imiapi.postData('v1/primary/addline', requestObj).subscribe(
      (response: any) => {
        try {
          this.imiapi.log(response.status);
          // this.desc = response.message;
          if (response.status == '0') {
            this.imiapi.removeSession('primarylines');
            this.imiapi.removeSession('parentinfo');
            this.imiapi.removeSession('managenumber');
            this.imiapi.removeSession('transid');
            this.imiapi.setSession('numberadded', true);
            this.imiapi.setSession('childno', this.mobileNo);
            this.router.navigate(['/managenumber']);
          }
          else  if (response.code == '10002' || response.code == '11111') {
            this.imiapi.clearSession();
            // this.router.navigate(['/login']);
            // Added on 27thjune to redirect to HE 
            this.router.navigate(['/pwa']);
          }
        } catch (e) {
          this.spinner.hide();
          this.errMsg =
            'Sorry, we could not process your request. Please try later.';
          // console.log(e);
        }
      },
      (error) => {
        this.spinner.hide();
        this.errMsg =
          'Sorry, we could not process your request. Please try later.';
        // console.log(error);
      }
    );
  }
  openNewtab() {
    window.open(this.helpurl);
  }
}
