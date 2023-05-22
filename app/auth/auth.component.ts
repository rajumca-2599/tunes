import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { EnvService } from '../shared/env.service';
import { IMIapiService } from '../shared/imiapi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
} from 'angularx-social-login';
import { DOCUMENT } from '@angular/common';
import { ApidataService } from '../shared/apidata.service';
declare const clevertap: any;
declare var $: any;
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  txtMobileNumber: string = '';
  showerror = false;
  msg: any;
  selectedlanguage = 'ID';
  isFragmentsExist: boolean = false;
  isSSOLogin = false;
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    public translate: TranslateService,
    private authService: SocialAuthService,
    @Inject(DOCUMENT) private document: Document,
    private apidata: ApidataService
  ) {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);

    try {
      clevertap.event.push('LOGIN');
    } catch (e) {
      console.log('Clevertap:' + e);
    }
  }

  ngOnInit(): void {
    //alert("In PWA Login");
    let isSSO = this.imiapi.getSession('isSSO');
    if (isSSO != undefined && isSSO != 'NA' && isSSO != '')
      this.isSSOLogin = true;
    if (this.env.envmode == 'dev') {
      this.txtMobileNumber = '85693124292';
    }
    window.scrollTo(0, 0);
  }

  Login() {
    // this.router.navigate(['partnerlogin',"12345","678910"]);
    if (this.txtMobileNumber == '') {
      return;
    }
    if (this.txtMobileNumber.length < 9) {
      return;
    }

    if (
      this.txtMobileNumber.length < this.env.mobileNo_MinLength ||
      this.txtMobileNumber.length > this.env.mobileNo_MaxLength
    ) {
      this.showerror = true;
      if (this.selectedlanguage.toUpperCase() == 'EN')
        this.msg = 'your IM3 Number is invalid';
      else this.msg = 'Nomor IM3 kamu salah';
      return;
    }
    var requestObj = {
      msisdn: this.txtMobileNumber,
      action: 'register',
    };

    requestObj.msisdn = this.imiapi.getValidMobileNumber(requestObj.msisdn);
    this.imiapi.log('MSISDN:' + requestObj.msisdn);
    this.isFragmentsExist = false;
    this.env.fragmentlist.forEach((element) => {
      if (
        requestObj.msisdn
          .substring(2, requestObj.msisdn.length)
          .startsWith(element)
      ) {
        this.isFragmentsExist = true;
      }
    });

    if (this.isFragmentsExist) {
      this.showerror = false;
      var temp = JSON.parse(JSON.stringify(requestObj));
      temp.msisdn = this.imiapi.msisdnEncrypt(temp.msisdn);
      this.spinner.show();
      this.imiapi.postData('v1/otp/send/v2', temp).subscribe(
        (response: any) => {
          this.spinner.hide();
          try {
            if (response.status == '0' && response.data.status == 'true') {
              this.imiapi.setSessionValue('lang', this.selectedlanguage);
              this.imiapi.setSession('LoginResp', response);
              this.imiapi.setSession('number', requestObj.msisdn);
              this.isFragmentsExist = false;
              //GTA4 Code #JIRA ID:DIGITAL-6854 on 25-Oct-21
              console.log(this.isSSOLogin);
              // this.imiapi.ga4EventLogging("Login","Continue");
              if (this.isSSOLogin) {
                this.imiapi.ga4EventLogging('Login', 'Continue');
              }
              //End
              this.router.navigate(['/validateotp']);
            } else {
              this.showerror = true;
              this.msg = response.message;
            }
          } catch (e) {
            this.showerror = true;
            this.msg =
              'Sorry, we could not process your request. Please try later!';
            console.log(e);
          }
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
    } else {
      this.showerror = true;
      if (this.selectedlanguage.toUpperCase() == 'EN')
        this.msg = 'your IM3 Number is invalid';
      else this.msg = 'Nomor IM3 kamu salah';
      return;
    }
  }
  switchLang(id: string) {
    if (navigator.onLine) {
      this.selectedlanguage = id;
      this.imiapi.setSessionValue('lang', id);
      this.translate.use(id);
      window.location.reload();
    }
  }

  clearMsg(event) {
    if (this.showerror) {
      this.showerror = false;
      this.msg = '';
    }
  }

  validatefragment(event) {
    //alert('HI');
    this.isFragmentsExist = false;
    if (this.txtMobileNumber.length >= 3) {
      this.env.fragmentlist.forEach((element) => {
        if (this.txtMobileNumber.startsWith(element)) {
          this.isFragmentsExist = true;
        }
      });
      if (!this.isFragmentsExist) {
        this.showerror = true;

        if (this.selectedlanguage.toUpperCase() == 'EN')
          this.msg = 'your IM3 Number is invalid';
        else this.msg = 'Nomor IM3 kamu salah';

        return;
      } else {
        this.imiapi.log('FragshowErr:' + this.showerror);
        if (this.showerror) {
          this.showerror = false;
          this.msg = '';
        }
      }
    } else {
      if (this.showerror && this.txtMobileNumber.length == 0) {
        this.showerror = false;
        this.msg = '';
      }
    }

    return;
  }
  signInWithSocialAcc(data) {
    let socialPlatformProvider;
    if (data === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (data === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    console.log(data);
    this.authService.signIn(socialPlatformProvider).then((socialusers) => {
      console.log('Inside authservice');
      console.log(socialusers);
      this.Savesresponse(socialusers, data);
    });
  }
  Savesresponse(socialusers: any, logintype: any) {
    console.log(socialusers);
    var obj = { socialtype: logintype, socialid: socialusers.id };
    this.spinner.show();
    this.imiapi.postData('v1/profile/sociallogin', obj).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.status == '0' && response.data != null) {
          this.imiapi.setSessionValue('token', response.data.tokenid);
          this.imiapi.setSessionValue('lang', this.selectedlanguage);

          if (response.data.newuser == 'true') {
            this.getCustomerProfile(true);
            //this.router.navigate(["/updateprofile"]);
            return;
          } else {
            this.getCustomerProfile(false);
          }
        } else {
          $('#emailverify').modal('show');
          return;
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
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

        let sessionId = this.imiapi.getSession('token');
        let backurl = this.imiapi.getSession('backurl');
        if (backurl != undefined && backurl != 'NA' && backurl != '') {
          //Redirect to backUrl with sessionId
          backurl = JSON.parse(backurl);
          this.imiapi.redirectToBack(backurl, sessionId);

          return;
        }

        let pvrcode = this.imiapi.getSession('pvrcode');
        if (pvrcode != undefined && pvrcode != 'NA' && pvrcode != '') {
          this.imiapi.setSession('navigationfrom', 'home');
          this.imiapi.OcwRedirection('viewpackage', sessionId, '2', false);
          return;
        }
        let pwa_url = this.imiapi.getSession('pwa_url');
        if (pwa_url != undefined && pwa_url != 'NA' && pwa_url != '') {
          pwa_url = JSON.parse(pwa_url);
          this.imiapi.OcwRedirection(pwa_url, sessionId, '3', false);
          return;
        }
        let catgId = this.imiapi.getSession('catgId');
        console.log(catgId);
        if (catgId != undefined && catgId != 'NA' && catgId != '') {
          this.imiapi.setSession('navigationfrom', 'home');
          this.imiapi.OcwRedirection('category', sessionId, '2', false);
          return;
        }
        if (!this.isSSOLogin) {
          this.imiapi.removeSession('backurl');
          this.imiapi.removeSession('pvrcode');
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
  navigateToIm3() {
    window.open(this.env.Im3PackUrl);
  }
}
