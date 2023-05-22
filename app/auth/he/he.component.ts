import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnvService } from '../../shared/env.service';
import { IMIapiService } from '../../shared/imiapi.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-he',
  templateUrl: './he.component.html',
  styleUrls: ['./he.component.css'],
})
export class HeComponent implements OnInit, AfterViewInit {
  @ViewChild('HEPostForm', { static: true }) headerForm: ElementRef;

  data: string = '';
  tid: string = '';
  authid: string = '';
  channel: string = '';
  lang: string = '';
  tokenid: string = '';
  os: string = '';
  isSSOLogin = false;
  /*'Authorization': this.env.hdrAuthorization,
      'X-IMI-CHANNEL': this.env.hdrChannel,
    'X-IMI-LANGUAGE': this.getSelectedLanguage(),
    'X-IMI-App-OS': this.getOS(),
    X-IMI-TOKENID */
  //arrdata:string[]=[];
  constructor(
    private env: EnvService,
    private imiapi: IMIapiService,
    private _route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    let isSSO = this.imiapi.getSession('isSSO');
    if (isSSO != undefined && isSSO != 'NA' && isSSO != '') {
      this.isSSOLogin = true;
    }

    //alert('In PWA HE');
    //alert('HE SSO:' + isSSO);
    this.tid = this.imiapi.current().toString();
    this.authid = this.env.hdrAuthorization;
    this.lang = this.imiapi.getSelectedLanguage();
    this.os = this.imiapi.getOS();
    this.channel = this.env.hdrChannel;
    this.tokenid = this.imiapi.getSession('token');
    //this.imiapi.log(this.tid + "|" + this.lang + "|" + this.os + "|" + this.tokenid + "|" + this.authid);

    this.tid = this.imiapi.RC4EncryptDecrypt(this.tid);
    this.authid = this.env.hdrAuthorization;
    this.lang = this.imiapi.RC4EncryptDecrypt(this.lang);
    this.os = this.imiapi.RC4EncryptDecrypt(this.os);
    this.channel = this.imiapi.RC4EncryptDecrypt(this.channel);
    this.tokenid = this.imiapi.getSession('token');
    //alert("PWA Token:"+this.tokenid);
    if (
      this.tokenid == null ||
      this.tokenid == 'undefined' ||
      this.tokenid == '' ||
      this.tokenid == 'NA'
    ) {
      this.tokenid = this.imiapi.current().toString();
    }
    // this.imiapi.log("tokenid:" + this.tokenid)
    this.tokenid = this.imiapi.RC4EncryptDecrypt(this.tokenid);

    //this.imiapi.log(this.tid + "|" + this.lang + "|" + this.os + "|" + this.tokenid + "|" + this.authid);
  }

  ngAfterViewInit() {
    this.data = this._route.snapshot.paramMap.get('id');
    //alert("Token from IndosatWebsite:"+this.data);
    // this.imiapi.log("heData:" + this.data);
    // this.imiapi.log(decodeURI(this.data));
    if (this.data == null || this.data == 'undefined' || this.data == '') {
      // this.imiapi.log("heTid:" + this.imiapi.getStorage("hetid"));
      if (
        this.imiapi.getStorage('hetid') == null ||
        this.imiapi.getStorage('hetid') == 'undefined' ||
        this.imiapi.getStorage('hetid') == ''
      ) {
        // Default Landing.

        this.imiapi.removeStorage('hetid');

        if (!navigator.onLine) {
          //alert("In onLine");
          this.imiapi.log('Offline: Redirecting to Login');
          this.redirect2Login();
        } else if (this.imiapi.getOS().toUpperCase() == 'BROWSER') {
         // alert("In Browser");
          this.imiapi.log('BROWSER -> Login');
          this.redirect2Login();
        } else {
          this.spinner.show();
          this.imiapi.log(
            this.imiapi.getOS().toUpperCase() + '-> doFormSubmit'
          );
          setTimeout(() => {
            this.spinner.hide();
            this.doFormSubmit();
          }, 3000);
        }
      } else {
        this.redirect2Login();
      }
    } else {
      try {
        // Setting Session and redirecting to Home Screen.
        this.data = atob(this.data);
        //this.imiapi.log(this.data);
        var arrdata = this.data.split('|');
        if (arrdata.length > 3) {
          this.tid = arrdata[0];
          //this.imiapi.log("HE:" + this.tid + "|" + this.imiapi.getStorage("hetid")+"|"+this.imiapi.RC4EncryptDecrypt(this.imiapi.getStorage("hetid")));
          if (this.tid == this.imiapi.getStorage('hetid')) {
            this.imiapi.removeStorage('hetid');
            var tokenId = arrdata[1];
            var newUser = arrdata[2];
            var clientId = arrdata[3];
            // alert(tokenId+'|'+newUser+'|'+clientId);
            //ClientId is false -> NO new Session Created. Redirecting to Login.
            if (tokenId != '' && clientId) {
              this.imiapi.removeSession('token');
              this.imiapi.setSessionValue('token', tokenId);
              this.imiapi.setSessionValue('lang', this.lang);
              if (newUser.toLowerCase() == 'true') {
                // this.router.navigate(["/updateprofile"]);
                this.getCustomerProfile(true);
              } else {
                this.getCustomerProfile(false);
              }
            } else {
              this.imiapi.removeSession('token');
              this.router.navigate(['/login']);
            }
          } else {
            this.imiapi.removeStorage('hetid');
            this.router.navigate(['/login']);
          }
        } else {
          this.imiapi.removeStorage('hetid');
          this.router.navigate(['/login']);
        }
      } catch (e) {
        console.log(e);
        this.imiapi.removeStorage('hetid');
        this.router.navigate(['/login']);
      }
    }
  }

  doFormSubmit() {
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
      this.router.navigate(['/login']);
    }, 2000);
  }

  getCustomerProfile(isNewUser: boolean) {
    this.spinner.show();
    this.imiapi.postData('v1/profile/get', {}).subscribe(
      (response: any) => {
        try {
          this.spinner.hide();
          if (response.status == '0') {
            this.imiapi.removeSession('number');
            response.data.msisdn = this.imiapi.formatMobileNo(
              response.data.msisdn
            );
            this.imiapi.setSession('oauth', response.data);
            this.imiapi.getglobalsettings();
          }
        } catch (e) {
          console.log(e);
        }
        let tokenId = this.imiapi.getSession('token');
        let backurl = this.imiapi.getSession('backurl');
        console.log(backurl);
       // alert("In getCustomerProfile");
        if (backurl != undefined && backurl != 'NA' && backurl != '') {
          //Redirect to backUrl with sessionId
          backurl = JSON.parse(backurl);
          //Redirect to backUrl with sessionId
          this.imiapi.redirectToBack(backurl, tokenId);
          return;
        }

        let pvrcode = this.imiapi.getSession('pvrcode');
        console.log(pvrcode);
        if (pvrcode != undefined && pvrcode != 'NA' && pvrcode != '') {
          this.imiapi.setSession('navigationfrom', 'home');
          this.imiapi.OcwRedirection('viewpackage', tokenId, '2', false);
          return;
        }
        let catgId = this.imiapi.getSession('catgId');
        console.log(catgId);
        if (catgId != undefined && catgId != 'NA' && catgId != '') {
          this.imiapi.setSession('navigationfrom', 'home');
          this.imiapi.OcwRedirection('category', tokenId, '2', false);
          return;
        }
        let pwa_url = this.imiapi.getSession('pwa_url');
        console.log(pwa_url);
        if (pwa_url != undefined && pwa_url != 'NA' && pwa_url != '') {
         // alert("In HE PWA with pwa_url:"+pwa_url);
          pwa_url = JSON.parse(pwa_url);
         // alert("In Trying to redirect from PWA HE");
          this.imiapi.OcwRedirection(pwa_url, tokenId, '3', false);
          return;
        }
        if (!this.isSSOLogin) {
          if (isNewUser) this.router.navigate(['/updateprofile']);
               
          else
         
          this.router.navigate(['/home']);
          return;
        }
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
        if (isNewUser) this.router.navigate(['/updateprofile']);
       
        else 
       
        this.router.navigate(['/home']);
      }
    );
  }
}
