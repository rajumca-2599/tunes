import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
declare const clevertap: any;
declare var $: any;
@Component({
  selector: 'app-partnerdashboard',
  templateUrl: './partnerdashboard.component.html',
  styleUrls: ['./partnerdashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PartnerdashboardComponent implements OnInit {

  selectedlanguage = 'ID';
  consent: any;
  profile: any;
  auth_code: any;
  errMsg: string = '';
  isSSOLogin = false;
  ProfilesData: any = {};
  access_token: any;
  userType:any;
  btnDisabled: boolean = false;
  thirdPartyUrl: any;
  new_tmp:any;
  isChecked:boolean=false;
  constructor(private router: Router, private imiapi: IMIapiService,
    public translate: TranslateService, private rout: ActivatedRoute,
    private spinner: NgxSpinnerService, public env: EnvService) {
    try {
      clevertap.event.push('LOGIN');
    } catch (e) {
      console.log('Clevertap:' + e);
    }
    setTimeout(() => {
      //alert('Hidden3');
      document.body.style.overflow = 'auto';
    }, 1000);
  }

  ngOnInit(): void {

    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.access_token = this.imiapi.getSession('token');
    this.consent = this.imiapi.getSession('consent');
    this.profile = this.imiapi.getSession('profile');
    this.thirdPartyUrl = this.imiapi.getSession('userNavigateUrl');
    this.new_tmp = this.translate.instant("agree");
    console.log(this.new_tmp)

    this.auth_code = this.imiapi.getSession('auth_code');
    console.log(this.auth_code, this.profile)
    if (this.consent == false) {
      this.btnDisabled = false;
    }
    else {
      this.btnDisabled = true;
    }
    console.log(this.consent)
    this.getCustomerProfile();
    let isSSO = this.imiapi.getSession('isSSO');
    if (isSSO != undefined && isSSO != 'NA' && isSSO != '')
      this.isSSOLogin = true;
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

  Savesresponse() {
    var obj = {
      consent: this.consent,
      profile: this.profile,
      auth_code: this.auth_code
    };
    // this.spinner.show();
    this.imiapi.postData('v1/partner/updateconsent', obj, "externalpartner").subscribe(
      (response: any) => {
        // this.spinner.hide();
        if (response.status == "0") {
          // this.imiapi.setSessionValue('token', response.data.tokenid);
          // this.imiapi.setSessionValue('lang', this.selectedlanguage);

          this.userNavigate();
        } else {
          this.errMsg = response.message;
          // this.spinner.hide();
          this.config.inputStyles = {
            width: '40px',
            height: '40px',

            border: 'solid 1px #ee0000',
          };
        }
      },
      (error) => {
        // this.spinner.hide();
      }
    );

  }
  getCustomerProfile() {
    // this.spinner.show();
    this.imiapi.postData('v1/partner/profile', { auth_code: this.auth_code, profile: this.profile, access_token: this.access_token }, "externalpartner").subscribe(
      (response: any) => {
        // this.spinner.hide();
        try {
          if (response.status == '0') {
            this.ProfilesData = response.data
            this.userType=this.ProfilesData.myim3.usertype.toLowerCase();
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


        }
      },
      (error) => {
        console.log(error);
        // this.spinner.hide();

      }
    );
  }
  switchLang(id: string) {
    if (navigator.onLine) {
      this.selectedlanguage = id;
      this.imiapi.setSessionValue('lang', id);
      this.translate.use(id);
      window.location.reload();
    }
  }

  enablebutton() {
    this.btnDisabled = !this.btnDisabled
  }
  userNavigate() {
    window.location.href = this.thirdPartyUrl + "?access_token=" + this.access_token;

  }
  checkValue(event: any){
   if(event=="A"){
    this.isChecked=true
   }
   else{
    this.isChecked=false;
   }
 }

}
