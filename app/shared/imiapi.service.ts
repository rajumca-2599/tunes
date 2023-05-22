import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from './env.service';
import * as sha512 from 'js-sha512';
import { Router } from '@angular/router';
// import { ApidataService } from './apidata.service';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { getMonth } from 'date-fns';
declare var dataLayer;
@Injectable({
  providedIn: 'root',
})
export class IMIapiService {
  public httpCounter: number = 0;
  constructor(
    private env: EnvService,
    private http: HttpClient,
    private router: Router,
    // private apidata: ApidataService,
    @Inject(DOCUMENT) private document: Document,
    private spinner: NgxSpinnerService
  ) {}
  public getUrl(curl,partnervalue): string {
    // this.log(this.env.apiUrl);
    if (this.env.envmode == 'dev') {
      return this.env.apiUrl;
    }
    else {
      if (partnervalue == "externalpartner") {
        return this.env.partnerapiUrl + curl
      }
      else if(partnervalue == "Externalpartner"){
        return this.env.partner_otpservice + curl
      }
      else  {
        return this.env.apiUrl + curl;
      }
    }
  }
  current() {
    try {
      this.httpCounter++;
      var _dd = new Date();
      return _dd.getTime() + '' + this.httpCounter;
    } catch (e) {}
    return this.httpCounter;
  }
  public setHeaders() {
    let isSSO = false;
    let ocwlogin = this.getSession('isSSO');
    isSSO =
      ocwlogin != undefined && ocwlogin != 'NA' && ocwlogin != ''
        ? true
        : false;
    var headersList = {
      Authorization: this.env.hdrAuthorization,
      'X-IMI-App-Model': this.getPhoneModel(),

      'X-IMI-App-OS': this.getOS(),
      'X-IMI-App-OSVersion': this.getOSVersion(),
      'X-IMI-VERSION': this.env.hdrVersion,
      'X-IMI-CHANNEL': isSSO ? this.env.ioWebSiteChannel : this.env.hdrChannel,
      'X-IMI-LANGUAGE': this.getSelectedLanguage(),

      'X-IMI-App-User-Agent': navigator.userAgent,
      'X-IMI-NETWORK': 'WIFI',
      // 'X-IMI-TOKENID':'',
      'X-IMI-UID': '11111',

      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-accesskey': '', //this.getAccessKey(),
      'x-csrftoken': '', // this.getCSRF()
    };
    return headersList;
  }
  public setallheaders(url, data, tokenid, uid) {
    let isSSO = false;
    var today = new Date();
    let ocwlogin = this.getSession('isSSO');
    isSSO =
      ocwlogin != undefined && ocwlogin != 'NA' && ocwlogin != ''
        ? true
        : false;
    let childno = '';
    if (
      this.getSession('childno') != undefined &&
      this.getSession('childno') != 'NA' &&
      url != 'v1/primary/lines'
    ) {
      if (this.getMSISDN() != JSON.parse(this.getSession('childno'))) {
        childno = this.EncryptDecrypt(JSON.parse(this.getSession('childno')));
      } else {
        childno = '';
      }
    }
   
    // var headersList = {
    //   'X-IMI-App-OS': this.getOS() + '$',
    //   'X-IMI-App-OSVersion': this.getOSVersion() + '$',
    //   'X-IMI-VERSION': this.env.hdrVersion + '$',
    //   'X-IMI-CHANNEL': isSSO
    //     ? this.env.ioWebSiteChannel + '$'
    //     : this.env.hdrChannel + '$',
    //   'X-IMI-LANGUAGE': this.getSelectedLanguage() + '$',
    //   'X-IMI-TOKENID': tokenid + '$',
    //   'X-IMI-CHILD-LINENO': childno,
    // };
    var headersList = {
      'X-IMI-App-OS': 'BROWSER' + '$',
      'X-IMI-App-OSVersion': 'BROWSER' + '$',
      'X-IMI-VERSION': '80.1.0' + '$',
      'X-IMI-CHANNEL': 'MYIM3' + '$',
      'X-IMI-LANGUAGE': 'ID' + '$',
      'X-IMI-TOKENID': '16534620678583' + '$',
      'X-IMI-CHILD-LINENO':""
    };
    return headersList;
  }
  getSHA512(s: any): string {
    try {
      return sha512.sha512(s);
    } catch (e) {
      return '';
    }
  }
  getReqToken(t) {
    try {
      var v = '';
      for (let i = 0; i < t.length; ) {
        v += t[i];
        i = i + 2;
      }
      return v;
    } catch (e) {
      return t;
    }
  }
  setStorage(k, d) {
    window.sessionStorage.setItem(k, btoa(JSON.stringify(d)));
  }
  setStorageValue(k, d) {
    window.sessionStorage.setItem(k, btoa(d));
  }
  getStorage(k) {
    if (window.sessionStorage.getItem(k)) {
      return atob(window.sessionStorage.getItem(k));
    }
    return '';
  }
  removeStorage(k) {
    try {
      if (window.sessionStorage.getItem(k)) {
        window.sessionStorage.removeItem(k);
      }
    } catch (e) {}
  }

  postData(curl, data,partner="Digi") {
    var t = this.current();
    var today = new Date();
    var uid =
      today.getFullYear() +
      '' +
      today.getMonth() +
      1 +
      '' +
      today.getDate() +
      '' +
      today.getHours() +
      '' +
      today.getMinutes() +
      '' +
      today.getSeconds() +
      '' +
      today.getMilliseconds();
    let getTemplateParam = this.env.getTemplateParam;
    let headersList: any = this.setHeaders();
    let enableallheaders = this.env.enableallencryptedheaders;
    if (this.env.envmode == 'dev') {
      headersList['proxypath'] = curl;
    }
    if (curl.indexOf('profile/downloadphoto/v2') > 0) {
      headersList.Accept = 'text/plain';
    }
    if (curl.indexOf('template/get?type=' + getTemplateParam + '') > 0) {
      headersList.Accept = 'text/html';
    }
    if (
      (curl.indexOf('otp/validate') > -1 || curl.indexOf('otp/send') > -1) &&
      data.action != 'addnumber'
    ) {
      //if(this.getSession('transid') =='NA' )
      headersList['X-IMI-TOKENID'] = t; //this.getSession('transid');
    } else {
      headersList['X-IMI-TOKENID'] = this.getSession('token');
    }
    headersList['x-imi-oauth'] = sha512.sha512(
      'REQBODY=' +
        JSON.stringify(data) +
        '&SALT=' +
        this.getReqToken(headersList['X-IMI-TOKENID'])
    );
    headersList['x-current'] = t;
    headersList['Access-Control-Allow-Origin'] = '*';
    headersList['x-reqtoken'] = sha512.sha512(
      'REQBODY=' +
        JSON.stringify(data) +
        '&SALT=' +
        this.getReqToken(headersList['X-IMI-TOKENID'])
    );
    if (
      this.getSession('childno') != undefined &&
      this.getSession('childno') != 'NA' &&
      curl != 'v1/primary/lines'
    ) {
      if (this.getMSISDN() != JSON.parse(this.getSession('childno'))) {
        headersList['X-IMI-CHILD-LINENO'] = this.EncryptDecrypt(
          JSON.parse(this.getSession('childno'))
        );
      } else {
        headersList['X-IMI-CHILD-LINENO'] = '';
      }
    } else {
      headersList['X-IMI-CHILD-LINENO'] = '';
    }
    if (
      this.getSession('source') != undefined &&
      this.getSession('source') != 'NA' &&
      this.getSession('source') != ''
    ) {
      console.log(this.getSession('source'));
      headersList['X-IMI-REFERER'] = this.getSession('source');
    }
    if (
      this.getSession('facebooktid') != undefined &&
      this.getSession('facebooktid') != 'NA' &&
      this.getSession('facebooktid') != ''
    ) {
      console.log(this.getSession('facebooktid'));
      headersList['X-IMI-EXTERNALID'] = this.getSession('facebooktid');
    }
    headersList['X-IMI-UID'] = uid + '' + this.generaterandomString();
    if (enableallheaders) {
      headersList['allheaders'] = 'true';
      console.log('X-IMI-UID: ' + headersList['X-IMI-UID']);
      // var salt = this.getReqToken(headersList['X-IMI-UID']);
      // console.log(salt);
      var salt="224227500";
      var stringfedheaders = JSON.stringify(
        this.setallheaders(
          curl,
          data,
          headersList['X-IMI-TOKENID'],
          headersList['X-IMI-UID']
        )
      );
      console.log(stringfedheaders);
      headersList['allheadersenc'] = sha512.sha512(
        'REQBODY=' + stringfedheaders + '&SALT=' + salt
      );
      console.log(headersList['allheadersenc']);
    }
    if (curl.indexOf('profile/downloadphoto/v2') > 0) {
      return this.http.post(this.getUrl(curl,partner), JSON.stringify(data), {
        headers: headersList,
        responseType: 'text',
      });
    } else if (curl.indexOf('template/get?type=' + getTemplateParam + '') > 0) {
      return this.http.get(this.getUrl(curl,partner), {
        headers: headersList,
        responseType: 'text',
      });
    } else {
      return this.http.post(this.getUrl(curl,partner), JSON.stringify(data), {
        headers: headersList,
      });
    }
  }

  replaceText(val: any): string {
    try {
      val = val.replace(/!BR!/g, '<br>');
      val = val.replace(/!LT!/g, '<');
      val = val.replace(/!GT!/g, '>');
    } catch (e) {}
    return val;
  }
  log(msg: any): void {
    if (this.env.enableDebug) {
      console.log(msg);
    }
  }
  setSession(n, d) {
    if (d === undefined) {
      window.localStorage.removeItem(n);
    } else {
      window.localStorage.setItem(n, btoa(JSON.stringify(d)));
    }
  }

  setSessionValue(n, d) {
    if (d === undefined) {
      window.localStorage.removeItem(n);
    } else {
      window.localStorage.setItem(n, btoa(d));
    }
  }
  getSession(n): string {
    if (window.localStorage.getItem(n)) {
      return atob(window.localStorage.getItem(n));
    }
    return 'NA';
  }
  removeSession(n) {
    if (window.localStorage.getItem(n)) {
      window.localStorage.removeItem(n);
    }
  }
  clearSession() {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  getUserName(): string {
    try {
      return JSON.parse(this.getSession('oauth')).custname;
    } catch (e) {
      return 'NA';
    }
  }
  getRole(): string {
    try {
      return JSON.parse(this.getSession('oauth')).rolename;
    } catch (e) {
      return 'NA';
    }
  }
  getAccessKey() {
    try {
      return JSON.parse(this.getSession('oauth')).accesskey;
    } catch (e) {
      return 'NA';
    }
  }
  getCSRF() {
    try {
      return JSON.parse(this.getSession('oauth')).csrftoken;
    } catch (e) {
      return 'NA';
    }
  }

  getMSISDN(): string {
    try {
      return JSON.parse(this.getSession('oauth')).msisdn;
    } catch (e) {
      return 'NA';
    }
  }
  getSubstype(): string {
    try {
      console;
      return JSON.parse(this.getSession('oauth')).usertype.split('|')[0];
    } catch (e) {
      return 'NA';
    }
  }

  getUserProfile(): any {
    try {
      return JSON.parse(this.getSession('oauth'));
    } catch (e) {
      return 'NA';
    }
  }
  getEnableManageNumber(): any {
    try {
      return JSON.parse(this.getSession('oauth')).managenumber;
    } catch (e) {
      return 'NA';
    }
  }
  getAlerts() {
    try {
      return JSON.parse(this.getSession('oauth')).alerts;
    } catch (e) {
      return 'NA';
    }
  }
  getCreatedOn() {
    try {
      return JSON.parse(this.getSession('oauth')).createdon;
    } catch (e) {
      return 'NA';
    }
  }
  getReferal() {
    try {
      return JSON.parse(this.getSession('oauth')).showreferral;
    } catch (e) {
      return 'NA';
    }
  }

  getOS() {
    var userAgent = navigator.userAgent || navigator.vendor;
    if (userAgent.indexOf('Android') != -1) {
      return 'ANDROID';
    }
    if (
      (userAgent.indexOf('iPad') != -1 ||
        userAgent.indexOf('iPhone') != -1 ||
        userAgent.indexOf('iPod/') != -1)
    ) {
      return 'IOS';
    }
    return 'BROWSER';
  }

  getOSVersion() {
    var userAgent = navigator.userAgent || navigator.vendor;

    var OSVerion = 'BROWSER';
    if (userAgent.indexOf('Android') != -1) {
      OSVerion = userAgent.substring(
        userAgent.indexOf('Android'),
        userAgent.indexOf(';', userAgent.indexOf('Android'))
      );

      if (OSVerion == '') OSVerion = 'ANDROID';
    }
    if (
      (userAgent.indexOf('iPad') != -1 ||
        userAgent.indexOf('iPhone') != -1 ||
        userAgent.indexOf('iPod/') != -1)
    ) {
      if (userAgent.indexOf(' OS ') != -1) {
        var indx = userAgent.toUpperCase().indexOf(' OS ');
        OSVerion = userAgent.substring(indx, userAgent.indexOf(' ', indx + 4));
        if (OSVerion == '') {
          return 'IOS';
        }
      }
    }

    return OSVerion;
  }

  getPhoneModel() {
    var userAgent = navigator.userAgent || navigator.vendor;
    var PhoneModel = '';
    if (userAgent.indexOf('Android') != -1) {
      var tindx = userAgent.indexOf(';', userAgent.indexOf('Android'));
      PhoneModel = userAgent.substring(tindx, userAgent.indexOf(')', tindx));
      if (PhoneModel == '') PhoneModel = 'ANDROID';
    }
    if (
      (userAgent.indexOf('iPad') != -1 ||
        userAgent.indexOf('iPhone') != -1 ||
        userAgent.indexOf('iPod/') != -1) 
    ) {
      PhoneModel = 'IOS';
    }
    return PhoneModel;
  }
  getDeviceId() {
    var userAgent = navigator.userAgent || navigator.vendor;
    console.log(userAgent);
    var PhoneModel = '';
    if (userAgent.indexOf('Android') != -1) {
      var tindx = userAgent.indexOf(';', userAgent.indexOf('Android'));
      PhoneModel = userAgent.substring(tindx, userAgent.indexOf(')', tindx));
      if (PhoneModel != '') PhoneModel = PhoneModel.split(' ')[2];
    }
    if (
      (userAgent.indexOf('iPad') != -1 ||
        userAgent.indexOf('iPhone') != -1 ||
        userAgent.indexOf('iPod/') != -1) 
    ) {
      var tindx = userAgent.indexOf(
        ';',
        userAgent.indexOf('iPad') ||
          userAgent.indexOf('iPhone') ||
          userAgent.indexOf('iPod/')
      );
      PhoneModel = userAgent.substring(tindx, userAgent.indexOf(')', tindx));
      if (PhoneModel != '') PhoneModel = PhoneModel.split(' ')[2];
    }
    return PhoneModel;
  }

  formatMobileNo(number: string): string {
    if (number.startsWith('62')) {
      number = '0' + number.substring(2, number.length);
    } else if (!number.startsWith('0')) number = '0' + number;

    return number;
  }

  getSelectedLanguage(): string {
    var selectedlanguage = 'ID';
    if (
      this.getSession('lang') == 'undefined' ||
      this.getSession('lang') == '' ||
      this.getSession('lang') == 'NA'
    )
      selectedlanguage = 'ID';
    else {
      if (this.getSession('lang').toUpperCase().trim() == 'EN')
        selectedlanguage = 'EN';
    }
    return selectedlanguage;
  }

  bytesToSize(bytes: number) {
    try {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes == 0) return '0 Byte';
      let _floor: number = Math.log(bytes) / Math.log(1024);
      var i = Math.floor(_floor);
      return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    } catch (e) {}
    return '';
  }

  bytesToSizeData(bytes: number, conv: string): string {
    try {
      let _flor: number = 0;

      switch (conv.toUpperCase()) {
        case 'KB': {
          _flor = bytes / 1024;
          conv = 'MB';
          if (_flor >= 1024) {
            _flor = _flor / 1024;
            conv = 'GB';
          }
          break;
        }
        case 'MB': {
          _flor = bytes;
          if (_flor >= 1024) {
            _flor = bytes / 1024;
            conv = 'GB';
          }
          break;
        }
      }
      if (_flor.toString().indexOf('.') != -1) {
        return (_flor.toFixed(1) + ' ').toString().replace('.0', '') + conv;
      } else return _flor + ' ' + conv;
    } catch (e) {}
    return '';
  }

  gotoApp() {
    window.location.href = this.env.getappurl;

    /* if (this.getOS() == 'IOS')
      window.open(this.env.appStoreUrl);
    else
      window.open(this.env.playStoreUrl); */
  }

  RC4EncryptDecrypt(text: string): string {
    let Password = '';
    Password = 'Ind0s@t001!';
    var cipherEnDeCrypt = '';
    var N = 256;
    var cipher = '';
    a;
    var sbox;
    try {
      sbox = [];
      let key = [];
      let n11 = Password.length;
      for (let a = 0; a < N; a++) {
        let ac = Password[a % n11];
        key[a] = ac.charCodeAt(0);
        sbox[a] = a;
      }
      let b = 0;
      for (let a = 0; a < N; a++) {
        b = (b + sbox[a] + key[a]) % N;
        let tempSwap = sbox[a];
        sbox[a] = sbox[b];
        sbox[b] = tempSwap;
      }

      var cipher = '';
      var i = 0,
        j = 0,
        k = 0;
      for (var a = 0; a < text.length; a++) {
        i = (i + 1) % N;
        j = (j + sbox[i]) % N;
        var tempSwap = sbox[i];
        sbox[i] = sbox[j];
        sbox[j] = tempSwap;

        k = sbox[(sbox[i] + sbox[j]) % N];

        var cipherBy = text[a].charCodeAt(0) ^ k;

        var _tmp1 = String.fromCharCode(cipherBy);
        cipher += _tmp1 + '';
      }

      var enctxt = '';
      for (var i = 0; i < cipher.length; i++) {
        var v = cipher[i].charCodeAt(0);
        var _cc = v.toString(16);
        if (_cc.length == 1) _cc = '0' + _cc;
        enctxt += _cc;
      }

      return enctxt;
    } catch (e) {}
    return '';
  }
  Decrypt(text) {
    var hex = text.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    text = str;
    let Password = '';
    Password = 'Ind0s@t001!';
    var cipherEnDeCrypt = '';
    var N = 256;
    var cipher = '';
    a;
    var sbox;
    try {
      sbox = [];
      let key = [];
      let n11 = Password.length;
      for (let a = 0; a < N; a++) {
        let ac = Password[a % n11];
        key[a] = ac.charCodeAt(0);
        sbox[a] = a;
      }
      let b = 0;
      for (let a = 0; a < N; a++) {
        b = (b + sbox[a] + key[a]) % N;
        let tempSwap = sbox[a];
        sbox[a] = sbox[b];
        sbox[b] = tempSwap;
      }

      var cipher = '';
      var i = 0,
        j = 0,
        k = 0;
      for (var a = 0; a < text.length; a++) {
        i = (i + 1) % N;
        j = (j + sbox[i]) % N;
        var tempSwap = sbox[i];
        sbox[i] = sbox[j];
        sbox[j] = tempSwap;

        k = sbox[(sbox[i] + sbox[j]) % N];

        var cipherBy = text[a].charCodeAt(0) ^ k;

        var _tmp1 = String.fromCharCode(cipherBy);
        cipher += _tmp1 + '';
      }
      return cipher;
    } catch (e) {}
    return '';
  }

  getValidMobileNumber(msisdn: string, countryCode = false) {
    if (msisdn.startsWith('0')) {
      msisdn = msisdn.substring(1, msisdn.length);
    } else if (
      msisdn.startsWith(this.env.countryCode) &&
      msisdn.length >= this.env.mobileNo_MinLength
    ) {
      msisdn = msisdn.substring(this.env.countryCode.length, msisdn.length);
    }
    if (countryCode == true) return msisdn;
    else msisdn = this.env.countryCode + msisdn;
    return msisdn;
  }
  EncryptDecrypt(text: string): string {
    let Password = this.env.childNumberEncryptionPwd;
    var cipherEnDeCrypt = '';
    var N = 256;
    var cipher = '';
    a;
    var sbox;
    try {
      sbox = [];
      let key = [];
      let n11 = Password.length;
      for (let a = 0; a < N; a++) {
        let ac = Password[a % n11];
        key[a] = ac.charCodeAt(0);
        sbox[a] = a;
      }
      let b = 0;
      for (let a = 0; a < N; a++) {
        b = (b + sbox[a] + key[a]) % N;
        let tempSwap = sbox[a];
        sbox[a] = sbox[b];
        sbox[b] = tempSwap;
      }

      var cipher = '';
      var i = 0,
        j = 0,
        k = 0;
      for (var a = 0; a < text.length; a++) {
        i = (i + 1) % N;
        j = (j + sbox[i]) % N;
        var tempSwap = sbox[i];
        sbox[i] = sbox[j];
        sbox[j] = tempSwap;

        k = sbox[(sbox[i] + sbox[j]) % N];

        var cipherBy = text[a].charCodeAt(0) ^ k;

        var _tmp1 = String.fromCharCode(cipherBy);
        cipher += _tmp1 + '';
      }

      var enctxt = '';
      for (var i = 0; i < cipher.length; i++) {
        var v = cipher[i].charCodeAt(0);
        var _cc = v.toString(16);
        if (_cc.length == 1) _cc = '0' + _cc;
        enctxt += _cc;
      }

      return enctxt;
    } catch (e) {
      // alert(e)
    }
    return '';
  }
  getglobalsettings() {
    let helpurl = this.getSession('enghelpurl');
    if (helpurl != '' && helpurl != 'NA' && helpurl != undefined) {
      if (this.getSelectedLanguage() == 'EN')
        helpurl = this.getSession('enghelpurl');
      else helpurl = this.getSession('idhelpurl');
      return JSON.parse(helpurl);
    } else {
      this.postData('v1/settings/getvalue', {
        module: 'MOBAPP_SETTINGS',
      }).subscribe((response: any) => {
        if (response.status != null && response.data != undefined) {
          if (response.status == '0') {
            let mgmengurl = response.data.MGM_TERMS_URL_EN;
            let mgmidurl = response.data.MGM_TERMS_URL_ID;
            this.setSession('mgmengurl', mgmengurl);
            this.setSession('mgmidurl', mgmidurl);
            let engurl = response.data.HELP_WEBVIEW_URL_EN;
            let idurl = response.data.HELP_WEBVIEW_URL_ID;
            engurl = engurl.replaceAll('!!MSISDN!!', this.getMSISDN());
            idurl = idurl.replaceAll('!!MSISDN!!', this.getMSISDN());
            this.setSession('enghelpurl', engurl);
            this.setSession('idhelpurl', idurl);
            if (this.getSelectedLanguage() == 'EN')
              helpurl = this.getSession('enghelpurl');
            else helpurl = this.getSession('idhelpurl');
            return JSON.parse(helpurl);
          }
        }
      });
    }
  }
  addDefaultName() {
    let name: string = '';
    if (this.getSelectedLanguage() == 'EN') name = 'No account name';
    else if (this.getSelectedLanguage() == 'ID') name = 'Belum ada nama';
    return name;
  }
  //type:3 Internal Redirection, type 2: redirect to package details screen
  OcwRedirection(
    redirect_url: string,
    tokenId: string,
    type: string,
    isLogined: boolean
  ) {
    var facebooktid = this.getSession('facebooktid');
    var source = this.getSession('source');
    // this.removeSession('isSSO');
    // this.removeSession('pvrcode');
    // this.removeSession('backurl');
    // this.removeSession('pwa_url');
    console.log('In OcwRedirection');
    if (isLogined) {
      if (type == '3') {
        let footerName = redirect_url;
        if (redirect_url == 'userprofile') footerName = 'more';
        else if (redirect_url == 'loyalty') {
          footerName = 'home';
          redirect_url = 'onlyforyou';
        }
        // this.apidata.footerstateName.next(redirect_url);
        this.setStorageValue('footerstateName', footerName);
        this.setSession('redirectfrom_webio', '1');
        this.router.navigate(['/' + redirect_url]);
        setTimeout(() => {
          this.removeSession('redirectfrom_webio');
          // this.removeSession("displaywelcomemodal");
          window.location.reload();
        }, 1);
        return;
      }
      if (type == '2') {
        // this.apidata.footerstateName.next('package');
        this.setStorageValue('footerstateName', 'package');
        this.setSession('navigationfrom', 'home');
        this.router.navigate(['/' + redirect_url]);
        setTimeout(() => {
          window.location.reload();
          // this.removeSession("displaywelcomemodal");
        }, 1);
        return;
      }
    } else if (
      facebooktid != undefined &&
      facebooktid != '' &&
      facebooktid != 'NA' &&
      source != undefined &&
      source != '' &&
      source != 'NA'
    ) {
      let footerName = redirect_url;
      if (redirect_url == 'userprofile') footerName = 'more';
      else if (redirect_url == 'loyalty') {
        footerName = 'home';
        redirect_url = 'onlyforyou';
      } else if (redirect_url == 'userprofile') {
        footerName = 'package';
        redirect_url = 'home';
      }
      this.setStorageValue('footerstateName', footerName);
      this.router.navigate(['/' + redirect_url]);
      setTimeout(() => {
        // this.removeSession("displaywelcomemodal");
        window.location.reload();
      }, 1);
      return;
    } else {
      // this.spinner.show();
      // setTimeout(() => {
      //   let url =
      //     this.env.backUrl +
      //     this.RC4EncryptDecrypt(this.env.appUrl + redirect_url) +
      //     '/' +
      //     this.RC4EncryptDecrypt(tokenId);
      //   location.href = url;
      // }, 1);
      // return;
      this.router.navigate(['/' + redirect_url]);
      setTimeout(() => {
        // this.removeSession("displaywelcomemodal");
        window.location.reload();
      }, 1);
      return;
    }
  }
  redirectToBack(data: string, tokenId: string) {
    // this.removeSession('isSSO');
    // this.removeSession('pvrcode');
    // this.removeSession('backurl');
    // this.removeSession('pwa_url');
    console.log('In redirectToBack' + tokenId);
    let _url = '';
    if (tokenId != 'NA' && tokenId != undefined && tokenId != '') {
      setTimeout(() => {
        //alert('Hidden3');
        this.spinner.show();
        try {
          let _webtoken = this.getSession('webtoken');
          let _url =
            this.env.backUrl +
            this.RC4EncryptDecrypt(data) +
            '/' +
            this.RC4EncryptDecrypt(_webtoken + '|' + tokenId);
          console.log(_url);

          location.href = _url;
        } catch (e) {
          console.log(e);
        }
      }, 1);
    } else {
      this.setSession('backurl', data);
    }
  }
  msisdnEncrypt(text: string): string {
    let Password = '!nd!gi2r*2otL';
    var cipherEnDeCrypt = '';
    var N = 256;
    var cipher = '';
    a;
    var sbox;
    try {
      sbox = [];
      let key = [];
      let n11 = Password.length;
      for (let a = 0; a < N; a++) {
        let ac = Password[a % n11];
        key[a] = ac.charCodeAt(0);
        sbox[a] = a;
      }
      let b = 0;
      for (let a = 0; a < N; a++) {
        b = (b + sbox[a] + key[a]) % N;
        let tempSwap = sbox[a];
        sbox[a] = sbox[b];
        sbox[b] = tempSwap;
      }

      var cipher = '';
      var i = 0,
        j = 0,
        k = 0;
      for (var a = 0; a < text.length; a++) {
        i = (i + 1) % N;
        j = (j + sbox[i]) % N;
        var tempSwap = sbox[i];
        sbox[i] = sbox[j];
        sbox[j] = tempSwap;

        k = sbox[(sbox[i] + sbox[j]) % N];

        var cipherBy = text[a].charCodeAt(0) ^ k;

        var _tmp1 = String.fromCharCode(cipherBy);
        cipher += _tmp1 + '';
      }

      var enctxt = '';
      for (var i = 0; i < cipher.length; i++) {
        var v = cipher[i].charCodeAt(0);
        var _cc = v.toString(16);
        if (_cc.length == 1) _cc = '0' + _cc;
        enctxt += _cc;
      }

      return enctxt;
    } catch (e) {
      // alert(e)
    }
    return '';
  }
  getState(url: string): string {
    if (url.trim().length > 0)
      url = url.indexOf('/') > 0 ? url.split('/')[0] : url.split('/')[1];
    if (url.trim().length == 0) url = 'login';
    return url.toLowerCase().trim();
  }
  //GTA4 Code #JIRA ID:DIGITAL-6854 on 25-Oct-21
  ga4EventLogging(category, action) {
    dataLayer.push({
      event: 'generalEvent',
      event_category: category,
      event_action: action,
      event_label: 'PWA',
      userId: this.generateBrowserToken(),
    });
  }
  generateBrowserToken() {
    let browsertoken = this.getSession('browsertoken');
    if (
      browsertoken == null ||
      browsertoken == undefined ||
      browsertoken == 'NA'
    ) {
      var len = 10;
      let token = Math.ceil((Math.random() * 9 + 1) * Math.pow(10, len - 1));
      this.setSession('browsertoken', token);
      return token;
    } else {
      browsertoken = JSON.parse(browsertoken);
      return browsertoken;
    }
  }
  generaterandomString() {
    const chars = '0123456789';
    const stringLength = 3;
    let randomstring = '';
    for (let i = 0; i < stringLength; i++) {
      const rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
  }
}
