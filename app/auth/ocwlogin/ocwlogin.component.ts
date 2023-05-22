import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { filter } from 'rxjs/operators';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { Location } from '@angular/common';
import { AlertPromise } from 'selenium-webdriver';
@Component({
  selector: 'app-ocwlogin',
  templateUrl: './ocwlogin.component.html',
  styleUrls: ['./ocwlogin.component.css'],
})
export class OcwloginComponent implements OnInit {
  @ViewChild('HEPostForm', { static: true }) headerForm: ElementRef;

  data: string = '';
  tid: string = '';
  authid: string = '';
  channel: string = '';
  lang: string = '';
  tokenid: string = '';
  os: string = '';
  id = '';
  urldata = '';
  accesstoken = '';
  routeurl = '';
  pvrcode = '';
  webtoken: string = '';
  referalurl = '';
  constructor(
    private env: EnvService,
    private imiapi: IMIapiService,
    private _route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private activeRoute: ActivatedRoute,
    private apidata: ApidataService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // alert("In PWA OCW");
    this.tid = this.imiapi.current().toString();
    this.authid = this.env.hdrAuthorization;
    this.lang = this.imiapi.getSelectedLanguage();
    this.os = this.imiapi.getOS();
    this.channel = this.env.ioWebSiteChannel;
    this.tokenid = this.imiapi.getSession('token');
    this.tid = this.imiapi.RC4EncryptDecrypt(this.tid);
    this.authid = this.env.hdrAuthorization;
    this.lang = this.imiapi.RC4EncryptDecrypt(this.lang);
    this.os = this.imiapi.RC4EncryptDecrypt(this.os);
    this.channel = this.imiapi.RC4EncryptDecrypt(this.channel);
    this.tokenid = this.imiapi.getSession('token');
    this.webtoken = this.activeRoute.snapshot.params['webtoken'];
    if (
      this.webtoken == null ||
      this.webtoken == '' ||
      this.webtoken == undefined
    ) {
      this.router.navigate(['/error400']);
      return;
    }
    try {
      this.webtoken = this.imiapi.Decrypt(this.webtoken);
      if (
        this.webtoken == null ||
        this.webtoken == '' ||
        this.webtoken == undefined
      ) {
        this.router.navigate(['/error400']);
        return;
      }
    } catch (e) {
      this.router.navigate(['/error400']);
    }

    this.imiapi.setSessionValue('webtoken', this.webtoken);
    if (
      this.tokenid == null ||
      this.tokenid == 'undefined' ||
      this.tokenid == '' ||
      this.tokenid == 'NA'
    ) {
      this.tokenid = this.imiapi.current().toString();
    }
    this.tokenid = this.imiapi.RC4EncryptDecrypt(this.tokenid);
    this.imiapi.removeSession('isSSO');
    this.imiapi.removeSession('pvrcode');
    this.imiapi.removeSession('backurl');
    this.imiapi.removeSession('pwa_url');
    this.imiapi.removeSession('refererurl');
    this.id = this.activeRoute.snapshot.params['fid'];
    this.urldata = this.activeRoute.snapshot.params['data'];
    this.imiapi.setSession('websitedata', this.urldata);
    this.accesstoken = this.activeRoute.snapshot.params['accesstoken'];

    this.routeurl = this.activeRoute.snapshot.params['routeurl'];
    if (
      this.routeurl != undefined &&
      this.routeurl != 'NA' &&
      this.routeurl != ''
    ) {
      let url = this.imiapi.Decrypt(this.routeurl);
      this.imiapi.setSession('routeurl', url);
    }
    this.pvrcode = this.activeRoute.snapshot.params['pvrcode'];
    //redirect url to return to website when user clicks barefererurlck in header component on 17-nov-21
    this.referalurl = this.activeRoute.snapshot.params['refererurl'];
    if (
      this.referalurl != '' &&
      this.referalurl != undefined &&
      this.referalurl != 'NA'
    ) {
      this.referalurl = this.imiapi.Decrypt(this.referalurl);
      this.imiapi.setSession('refererurl', this.referalurl);
    }
    //this case before login refer url will be send in data parameter
    if (this.id != undefined && this.id != '' && this.id == '1') {
      this.referalurl = this.imiapi.Decrypt(this.urldata);
      this.imiapi.setSession('refererurl', this.referalurl);
    }
    //alert(this.referalurl);
    ///Case 1 Start
    try {
      this.accesstoken =
        this.accesstoken != 'NA' &&
        this.accesstoken != '' &&
        this.accesstoken != undefined
          ? this.imiapi.Decrypt(this.accesstoken)
          : '';
    } catch (e) {
      console.log(e);
      this.router.navigate(['/error400']);
    }
    this.imiapi.setSession('isSSO', true);
    let welcomemodal = this.imiapi.getSession('displaywelcomemodal');
    if (
      welcomemodal == undefined ||
      welcomemodal == '' ||
      welcomemodal == 'NA'
    ) {
      this.imiapi.setSession('displaywelcomemodal', 'Y');
    }
    //Check SSO token with PWA Token
    this.getCustomerProfile();
  }

  ngAfterViewInit() {
    //alert("In OCW ngAfterViewInit");
    let tokenId = this.imiapi.getSession('token');
    if (tokenId == undefined || tokenId == 'NA' || tokenId == '') {
      // Default Landing.

      this.imiapi.removeStorage('hetid');

      if (!navigator.onLine) {
        //alert("In OCW navigator.onLine");
        this.imiapi.log('Offline: Redirecting to Login');
        this.redirect2Login();
      } else if (this.imiapi.getOS().toUpperCase() == 'BROWSER') {
        //alert("In OCW BROWSER");
        this.imiapi.log('BROWSER -> Login');
        this.redirect2Login();
      } else {
        //alert("In OCW else");
        this.spinner.show();
        this.imiapi.log(this.imiapi.getOS().toUpperCase() + '-> doFormSubmit');
        setTimeout(() => {
          this.spinner.hide();
          this.doFormSubmit();
        }, 3000);
      }
    }
  }
  doFormSubmit() {
    //alert("In OCW doFormSubmit");
    this.imiapi.log('doFormSumbitCalled:' + this.env.heUrl);
    // this.tid = this.imiapi.current().toString();
    this.imiapi.setStorageValue('hetid', this.tid);
    // this.imiapi.log("HE URL:" + this.tid)
    //this.imiapi.log(this.tid + "|" + this.lang + "|" + this.os + "|" + this.tokenid + "|" + this.authid);
    /* --Start Post
    this.headerForm.nativeElement.method = "POST";

    this.headerForm.nativeElement.action = this.env.heUrl;//.replace("!TID!", btoa(this.tid));
    this.headerForm.nativeElement.submit();
    --End Post*/
    let _url = this.env.heUrl
      .replace('!CHANNEL!', this.channel)
      .replace('!LANGUAGE!', this.lang)
      .replace('!TOKENID!', this.tokenid)
      .replace('!TID!', this.tid);
    this.imiapi.log(_url);
    location.href = _url;
  }

  redirect2Login() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      // this.router.navigate(['/login']);
      // Added on 27thjune to redirect to HE 
      this.router.navigate(['/pwa']);
    }, 2000);
  }
  getCustomerProfile() {
    console.log('In getCustomerProfile:');
    this.spinner.show();
    this.imiapi.postData('v1/profile/get', {}).subscribe(
      (response: any) => {
        try {
          this.spinner.hide();
          console.log('getCustomerProfile:' + response);
          if (response.status == '0') {
            console.log('response status:' + response.status);
            this.imiapi.removeSession('number');
            response.data.msisdn = this.imiapi.formatMobileNo(
              response.data.msisdn
            );
            this.imiapi.setSession('oauth', response.data);
            this.imiapi.getglobalsettings();
            this.ssoRedirection();
          } else {
            console.log('In else case of getCustomerProfile:');
            this.loginFail();
          }
        } catch (e) {
          console.log(e);
          this.loginFail();
        }
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
        this.loginFail();
      }
    );
  }
  logout() {
    this.spinner.show();
    this.imiapi.postData('v1/profile/logout', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        let displaymodal = this.imiapi.getSession('displaywelcomemodal');
        window.localStorage.clear();
        window.sessionStorage.clear();
        window.location.reload();
        this.imiapi.setSession('displaywelcomemodal', displaymodal);
      },
      (error) => {
        this.spinner.hide();
        window.location.reload();
      }
    );
  }
  //Logined false
  loginFail() {
    window.sessionStorage.clear();
    window.localStorage.clear();
    this.imiapi.setSession('isSSO', true);
    this.imiapi.setSessionValue('webtoken', this.webtoken);
    this.imiapi.setSession('refererurl', this.referalurl);
    console.log('In loginFail :id' + this.id);
    try {
      if (this.id != undefined && this.id != '' && this.id == '1') {
        this.urldata = this.imiapi.Decrypt(this.urldata);
        this.imiapi.setSession('backurl', this.urldata);
        this.imiapi.setSession('refererurl', this.referalurl);
      } else if (
        this.routeurl != '' &&
        this.routeurl != 'NA' &&
        this.routeurl != undefined
      ) {
        this.imiapi.setSession('pwa_url', this.routeurl);
      } else if (
        this.pvrcode != '' &&
        this.pvrcode != undefined &&
        this.pvrcode != 'NA'
      ) {
        this.pvrcode = this.imiapi.Decrypt(this.pvrcode);
        this.imiapi.setSession('pvrcode', this.pvrcode);
      }
      // this.router.navigate(['/login']);
      // Added on 27thjune to redirect to HE 
      this.router.navigate(['/pwa']);
      return;
    } catch (e) {
      console.log('In loginFail');
      console.log(e);
    }
  }
  ssoRedirection() {
    let tokenId = this.imiapi.getSession('token');
    let isLogined = false;
    try {
      if (tokenId != undefined && tokenId != 'NA' && tokenId != '') {
        // if (this.accesstoken == '' || this.accesstoken != tokenId)
        //   isLogined = false;
        // else
        isLogined = true;

        //Case 1
        if (this.id != undefined && this.id != '' && this.id == '1') {
          //if logined
          if (isLogined) {
            this.urldata = this.imiapi.Decrypt(this.urldata);
            this.imiapi.redirectToBack(this.urldata, tokenId);
            return;
          } else {
            //remove session in PWA and redirect to login
            /// this.logout();
          }
        }
        //Case 1 End
        //SSO Start
        if (
          this.routeurl != '' &&
          this.routeurl != 'NA' &&
          this.routeurl != undefined
        ) {
          this.routeurl =
            this.routeurl == 'loyalty' ? 'onlyforyou' : this.routeurl;
          this.imiapi.setSession('pwa_url', this.routeurl);
          this.imiapi.OcwRedirection(this.routeurl, tokenId, '3', isLogined);
          console.log('pwa_url:' + this.routeurl);
          return;
        }
        //SSO End
        if (
          this.pvrcode != '' &&
          this.pvrcode != undefined &&
          this.pvrcode != 'NA'
        ) {
          this.pvrcode = this.imiapi.Decrypt(this.pvrcode);
          this.imiapi.setSession('pvrcode', this.pvrcode);
          console.log(this.pvrcode);
          console.log(isLogined);
          this.imiapi.OcwRedirection('viewpackage', tokenId, '2', isLogined);
          return;
        }
      }
    } catch (e) {
      console.log('In ssoRedirection');
      console.log(e);
    }
  }
}
