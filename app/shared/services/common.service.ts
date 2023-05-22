import { Injectable } from "@angular/core";
import { Location, formatDate } from "@angular/common";
import { Router } from "@angular/router";
import { MsgdialogueboxComponent } from '../msgdialoguebox/msgdialoguebox.component'
import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
  HttpEvent,
} from "@angular/common/http";

import * as sha512 from "js-sha512";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable, throwError, Subscription } from "rxjs";

import { catchError, retry, map, tap, timeout } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";



@Injectable({
  providedIn: "root",
})
export class CommonService {
  modalRefs: BsModalRef[] = [];
  validatedata: any;
  domainname: boolean = false;
  durationInSeconds = 5;
  private statename: string = "";
  private _dialog1: any;
  private EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private EXCEL_EXTENSION = '.xlsx';
  public token: any;
  public client: any;
  public token_id: any;
  public lang: any;
  public subkey: any = "";
  public baseapiurl = "/ccareportal/";
  public httpCounter: number = 0;
  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,


  ) {
    if (this.getSession("lang") != null && this.getSession("lang") != undefined)
      this.lang = this.getSession("lang");

    this.setSession("lang", this.lang);
    // translate.setDefaultLang(this.lang);
    // console.log(this.getSession("lang"));
    // translate.use(this.lang);

  }
  // public getBannerUrl(id): string {
  //   let _url = "";
  //   if (window.locationpost.href.indexOf("://localhost") > 0)
  //     // _url = "http://10.0.9.79:9169/admin/api/v1/downloadbanner?bannerid=24&language=en";
  //     _url =
  //       this.env.domainurl +
  //       "/admin/api/v1/downloadbanner?bannerid=" +
  //       id +
  //       "&language=en";
  //   else _url = "/admin/api/v1/downloadbanner?bannerid=" + id + "&language=en";
  //   return _url;
  // }

  // public getBannerUrlByLang(id, lang): string {
  //   let _url = "";
  //   if (window.location.href.indexOf("://localhost") > 0)
  //     _url =
  //       this.env.domainurl +
  //       "/admin/api/v1/downloadbanner?bannerid=" +
  //       id +
  //       "&language=" +
  //       lang;
  //   else
  //     _url =
  //       "/admin/api/v1/downloadbanner?bannerid=" + id + "&language=" + lang;
  //   return _url;
  // }

  public getUrl(curl: any): string {
   return "https://stg-mybsnl.bsnl.co.in/api/v2" + curl;
    // if (curl == "/banners/getbyid" && this.domainname == true) {
    //   return "https://stg-mybsnl.bsnl.co.in/api/v2" + curl;
    // }
    // if (curl == "/pages/getmodules") {
    //   return "https://stg-mybsnl.bsnl.co.in/api/v2" + curl;
    // }
    // if (this.domainname && curl != "/banners/getbyid") {
    //   return "http://172.16.68.34:9102/api/v2" + curl;
    // }
    // else {
    //   // return " https://172.16.68.34:9101/api/v2/" + curl;
    //   return "https://stg-mybsnl.bsnl.co.in/api/v2" + curl;
    //   // return "http://location:9135/mockdata/postdata" ;
    // }
  }

  // public exportAsExcelFile(json: any[], excelFileName: string): void {
  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  //   const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  //   this.saveAsExcelFile(excelBuffer, excelFileName);
  // }

  // private saveAsExcelFile(buffer: any, fileName: string): void {
  //   const data: Blob = new Blob([buffer], {
  //     type: this.EXCEL_TYPE
  //   });
  //   FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + this.EXCEL_EXTENSION);
  // }
  private setHeaders() {
    let _rc4username_password = this.RC4EncryptDecrypt("admin|admin")

    var headersList = {


      "X-IMI-LANGUAGE": "EN",
      "X-IMI-CHANNEL": "MYBSNL",
      "X-IMI-TOKENID": this.currenttime(),
      "Authorization": _rc4username_password,
      "X-IMI-JWTTOKEN": "",
      "X-IMI-JWTCLIENT": "",
      "x-imi-oauth": "",
      "X-IMI-SERVICEKEY": ""

    };

    if (this.client == undefined || this.token == undefined) {
      headersList["X-IMI-CHANNEL"] = "WEB"
    }


    return headersList;
  }
  postData(curl: any, data: any) {



    var headersList: any = {}
    var tid = this.currenttime();
    this.showhttpspinner();
    try {
      if (data.search != null && data.search != undefined) {
        data.search = data.search.toString().trim();
      }
      // console.log(data);
      let _keys = [];
      for (let k in data) _keys.push(k);
      for (let i = 0; i < _keys.length; i++) {
        try {
          if (data[_keys[i]] == null || data[_keys[i]] == undefined) continue;
          if (Array.isArray(data[_keys[i]])) {
            // console.log("Array:" + _keys[i]);
          } else {
            let _p = data[_keys[i]];
            if (_p != null && _p != undefined && _p.indexOf(" ") >= 0) {
              _p = data[_keys[i]].toString().trim();
              data[_keys[i]] = _p;
            }
          }
        } catch (e) { }
      }
    } catch (e) { }
    if (curl.indexOf('/token/authenticate') > -1) {
      let _rc4username_password = this.RC4EncryptDecrypt("admin|admin")

      // headersList['X-IMI-JWTTOKEN'] = this.token;
      headersList['X-DIGI-JWTTOKEN'] = this.token;
      headersList['Authorization'] = _rc4username_password;
      // headersList['X-IMI-JWTCLIENT'] = this.client;
      headersList['X-DIGI-JWTCLIENT'] = this.client;
      // headersList['X-IMI-TOKENID'] = sessionStorage.getItem("token_id") //this.token_id
      headersList["X-IMI-CHANNEL"] = "MYBSNL",
        headersList["X-IMI-LANGUAGE"] = "EN"

    }
    else if (curl.indexOf('/otp/validate') > -1) {
      let _rc4username_password = this.RC4EncryptDecrypt("admin|admin")

      headersList['Authorization'] = _rc4username_password;
      headersList["X-IMI-CHANNEL"] = "WEB",
        headersList["X-IMI-LANGUAGE"] = "EN"
      headersList['X-IMI-TOKENID'] = sessionStorage.getItem("token_id")//this.token_id,
      headersList['SERVICEKEY'] = "12345678"

    }

    else if (curl.indexOf('/otp/send') > -1) {
      let _rc4username_password = this.RC4EncryptDecrypt("admin|admin")
      var id = sessionStorage.getItem("token_id")//this.token_id
      // console.log(id, "session")
      headersList['Authorization'] = _rc4username_password;
      headersList["X-IMI-CHANNEL"] = "WEB",
        headersList["X-IMI-LANGUAGE"] = "EN"
      headersList['X-IMI-TOKENID'] = sessionStorage.getItem("token_id")//this.token_id




    }
    // else if (curl.indexOf('/packages/eligibilitypromo') > -1) {
    //    let _rc4username_password = this.RC4EncryptDecrypt("admin|admin")
    //   headersList['Authorization'] = _rc4username_password;
    //   headersList['X-IMI-TOKENID'] = sessionStorage.getItem("token_id")//this.token_id




    // }
    else {
      var headersList: any = this.setHeaders();
    }
    if (curl.indexOf('/token/get') > -1) {

      headersList['X-IMI-TOKENID'] = this.currenttime();

    }
    else {
      headersList['X-IMI-TOKENID'] = sessionStorage.getItem("token_id")// this.token_id
    }
    if (headersList['X-IMI-TOKENID'] == null)
      headersList['X-IMI-TOKENID'] = ""
    // headersList['x-imi-oauth'] = sha512.sha512(
    //   'REQBODY=' +
    //     JSON.stringify(data) +
    //     '&SALT=' +
    //     this.getReqToken(headersList['X-IMI-TOKENID'])
    // );
    var t = this.currenttime();
    // console.log("this.token_id", this.token_id)
    // console.log("sessionStorage.getItem(token_id)", sessionStorage.getItem("token_id"))

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

    let _url = this.getUrl(curl);
    // console.log(window.location.href, "", window.location.href.indexOf("localhost"));
    if (window.location.href.indexOf("localhost") > 0) {
      // console.log("---------localhton greate");
      _url = "http://localhost:9135/mockdata/postdata";
      headersList.proxypath = this.getUrl(curl);
    }
    // console.log(_url, "url")

    return this.http
      .post(_url, data, { headers: headersList })
      .pipe(
        timeout(1200000),
        tap((data) => {

          // console.log(JSON.stringify(data))
          try {
            this.hidehttpspinner();
          } catch (e) { }

          try {
            let _jresp = JSON.parse(JSON.stringify(data));
            if (_jresp.code == "401") {
              this.openDialog("warning", "Session Timeout.");
              window.sessionStorage.clear();
              this.router.navigate(["/login"]);
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else if (_jresp.status == "401") {
              this.openDialog("warning", "Session Timeout.");
              window.sessionStorage.clear();
              this.router.navigate(["/login"]);
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          } catch (e) { }
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error)
    let data = {
      status: "500",
      message: "Internal Error Unable to process your request now.",
    };
    try {
      try {
        this.hidehttpspinner();
      } catch (e) { }
      if (error != null) {
        data = {
          status: error.status + "",
          message: error.error,
        };
        // console.log(error)
        if (error.error instanceof ErrorEvent) {
          data.message = error.error.message;
          console.error("An error occurred:", error.error.message);
        } else {
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`
          );
        }
      }
    } catch (e) { }
    return throwError(data);
  }
  getData(url: any) {
    let headersList: any = this.setHeaders();
    return this.http.get(this.getUrl(url), { headers: headersList });
  }
  getStaticData(url: any) {
    let headersList: any = this.setHeaders();
    return this.http.get(url, { headers: headersList });
  }
  postFormData(curl: any, data: any) {
    var t = this.currenttime();
    let headersList: any = {
      "Access-Control-Allow-Origin": "*",
      accesskey: this.getAccessKey(),
      csrftoken: this.getCsrfKey(),
      statename: this.getStateName(),
      subscriberkey: this.getSubKey(),
      useXDomain: "true",
    };
    headersList["current"] = t;
    headersList["reqtoken"] = sha512.sha512(
      JSON.stringify(data) + this.getReqToken(t)
    );
    return this.http.post<any>(this.getUrl(curl), data, {
      headers: headersList,
    });
  }
  getSHA512(s: any): string {
    try {
      return sha512.sha512(s);
    } catch (e) {
      return "";
    }
  }

  GetRoles() {
    let promise = new Promise((resolve, reject) => {
      this.getData("search/allroles")
        .toPromise()
        .then(
          (res) => {
            // Success
            resolve(res);
          },
          (msg) => {
            // Error
            reject(msg);
          }
        );
    });
    return promise;
  }

  langtranslate(key: string): any {
    //  return this.translate.get(key);
  }
  getSubKey() {
    if ("subkey" != undefined && this.getSession("subkey") != null) {
      this.subkey = this.getSession("subkey");
    }
    return this.subkey;
  }
  setsubkey(subkey: any) {
    this.setSession("subkey", subkey);
    this.subkey = subkey;
  }
  getReqToken(t: any) {
    try {
      var v = '';
      for (let i = 0; i < t.length;) {
        v += t[i];
        i = i + 2;
      }
      return v;
    } catch (e) {
      return t;
    }
  }
  getAccessKey(): string {
    try {
      return JSON.parse(this.getSession("oauth")).accessKey;
    } catch (e) {
      return "NA";
    }
  }
  getCsrfKey(): string {
    try {
      return JSON.parse(this.getSession("oauth")).csrftoken;
    } catch (e) {
      return "NA";
    }
  }
  getStateName(): string {
    this.statename = "";
    try {
      if (this.location.path()) {
        this.statename = this.location.path();
        if (this.statename.indexOf("/home/") == 0) {
          this.statename = this.statename.replace("/home/", "/");
        }
        this.statename =
          this.statename.indexOf("/") > 0
            ? this.statename.split("/")[0]
            : this.statename.split("/")[1];
      }
    } catch (e) { }
    if (this.statename != undefined)
      if (this.statename.trim().length == 0)
        this.statename = this.getAccessKey() != "NA" ? "login" : "dashbaord";
    //this.statename = this.statename.substring(1, this.statename.length);
    return this.statename;
  }

  GetCurrencyCode() {
    try {
      var _currency = JSON.parse(this.getSession("oauth")).countrycurrency;
      var _curr = !_currency && _currency == null ? "" : _currency;
      return _curr;
    } catch (e) {
      return "";
    }
  }

  getUserName(): string {
    try {
      return JSON.parse(this.getSession("oauth")).name;
    } catch (e) {
      return "NA";
    }
  }
  getRole() {
    try {
      return JSON.parse(this.getSession("oauth")).roleId;
    } catch (e) {
      return "NA";
    }
  }
  getOauth() {
    try {
      return JSON.parse(this.getSession("oauth"));
    } catch (e) {
      return null;
    }
  }
  getUserId() {
    try {
      return JSON.parse(this.getSession("oauth")).userId;
    } catch (e) {
      return "";
    }
  }
  getloginid() {
    try {
      return JSON.parse(this.getSession("oauth")).loginId;
    } catch (e) {
      return "";
    }
  }

  get7digitRole(roleid: any) {
    try {
      if (roleid == "101000") {
        return "1010000";
      } else if (roleid == "101001") {
        return "1010001";
      } else if (roleid == "101002") {
        return "1010002";
      } else if (roleid == "101003") {
        return "1010003";
      } else if (roleid == "101004") {
        return "1010004";
      } else if (roleid == "101005") {
        return "1010005";
      } else if (roleid == "101006") {
        return "1010006";
      }
    } catch (e) {
      return roleid;
    }
  }

  setSession(n: any, d: any) {
    if (d === undefined) {
      window.sessionStorage.removeItem(n);
    } else {
      window.sessionStorage.setItem(n, btoa(d));
    }
  }
  // getSession(n: any) {
  //   if (window.sessionStorage.getItem(n)) {
  //     return atob(window.sessionStorage.getItem(n));
  //   }
  //   return "";
  // }
  getSession(n: any): string {
    if (window.localStorage.getItem(n)) {
      // return atob(window.localStorage.getItem(n));
    }
    return 'NA';
  }
  clearSession() {
    window.sessionStorage.clear();
  }
  currenttime() {
    try {
      this.httpCounter++;
      var _dd = new Date();
      return _dd.getTime() + '' + this.httpCounter;
    } catch (e) { }
    return this.httpCounter;
  }
  // openDialog(alert: string, txt: string, html?: boolean) {
  //   try {
  //     if (txt == null || txt == undefined || txt.length < 3) {
  //       txt = "Unable to process your request";
  //     }
  //     if (txt == "success") {
  //       txt = "Request has been successfully processed.";
  //     }
  //     if (txt == "Internal Error") {
  //       txt = "Unable to process your request.";
  //     }
  //     if (txt == "Duplicate Entry") {
  //       txt = "Same record already exists.";
  //     }
  //   } catch (e) { }
  //   try {
  //     if (this._dialog1 != null) {
  //       console.log("Closing");
  //       this._dialog1.close();
  //     }
  //   } catch (e) { }
  //   let _wid = "400px";
  //   if (html) {
  //     _wid = "900px";
  //   }

  // }
  closeAllModals() {
    this.modalRefs.forEach(modal => modal.hide());
  }
  openDialog(alert: string, txt: string, html?: boolean) {
    try {
      if (!txt || txt.length < 3) {
        txt = 'Unable to process your request';
      }
      if (txt == 'success') {
        txt = 'Request has been successfully processed.';
      }
      if (txt == 'Internal Error') {
        txt = 'Unable to process your request.';
      }
      if (txt == 'Duplicate Entry') {
        txt = 'Same record already exists.';
      }
    } catch (e) { }
    try {
      if (this.modalRefs && this.modalRefs.length > 0) {
        console.log('Closing');
        this.modalRefs.forEach(modal => modal.hide());
        // this.bsModalRef.hide();
      }
    } catch (e) { }

    const initialState = {
      msgobj: {
        type: alert,
        message: txt,
        ishtml: html ? html : false
      }
    };
    // if (this.bsModalRef) {
    const modalRef = this.modalService.show(MsgdialogueboxComponent, { initialState });
    // modalRef.content.closeBtnName = 'Close';
    this.modalRefs.push(modalRef);
    return modalRef;
    // }

    // this.dialog.showModal(alert, txt, html);
    // this._dialog1 = this.dialog.open(MsgdialogueboxComponent, {
    //   disableClose: true,
    //   width: _wid,
    //   data: { type: alert, msg: txt, html },
    // });
  }


  ShowJsonErrorMessage(resp: any) {
    try {
      if (resp != null && resp.data.data.errorInfo) {
        return resp.data.data.errorInfo.errorDescription;
      } else {
        if (resp.data.message != null && resp.data.message.length > 10)
          return resp.data.message;
      }
    } catch (e) { }
    return "--Unable to process your request. Please try again later.--";
  }
  ApiUrl(url: any) {
    try {
      if (
        url.indexOf("/uploadfiles") > 0 ||
        url.indexOf("/UploadBulkUser") > 0
      ) {
        if (url.indexOf("?") > 0) {
          if (url.indexOf("&") > 0) {
            url = url + "&ticks=" + this.currenttime();
          } else {
            url = url + "ticks=" + this.currenttime();
          }
        } else {
          url = url + "?ticks=" + this.currenttime();
        }
      }
    } catch (e) { }
    return this.baseapiurl + "" + url;
  }
  // getAlertConfigurations(jsonfilename: any) {
  //   let url = "/adminui/simulator/" + jsonfilename.toLowerCase() + ".json";
  //   this.http.get(url).subscribe(
  //     (data) => {
  //       if (data != undefined) {
  //         // console.log(data);
  //         this.setSession("messageconfig", JSON.stringify(data));
  //       }
  //     },
  //     (error) => {
  //       this.setSession("messageconfig", []);
  //       // console.log(error);
  //     }
  //   );
  // }
  HandleHTTPError(response: any) {
    try {
      this.spinner.hide();
      // console.log(response);
      if (response.status == "0") {
        this.openDialog(
          "warning",
          "Unable to process your request. Please try again later."
        );
      } else if (response.status == "404") {
        this.openDialog(
          "warning",
          "Unable to process your request. Please try again later."
        );
      } else if (response.status == "401") {
        this.openDialog("warning", "Session Timeout.");
        window.sessionStorage.clear();
        this.router.navigate(["/login"]);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (response.code == "401") {
        this.openDialog("warning", response.message);
        window.sessionStorage.clear();
        this.router.navigate(["/login"]);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        this.openDialog(
          "warning",
          "Unable to process your request. Please try again later."
        );
      }
    } catch (e) { }
  }

  HandleHTTPDefaultError(response: any) {
    try {
      this.spinner.hide();
      // console.log(response);
      if (response.status == "0") {
        this.openDialog(
          "warning",
          "Unable to process your request. Please try again later."
        );
      } else if (response.status == "404") {
        this.openDialog(
          "warning",
          "Unable to process your request. Please try again later."
        );
      } else if (response.status == "401") {
        this.openDialog("warning", "Session Timeout.");
        window.sessionStorage.clear();
        this.router.navigate(["/login"]);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (response.code == "401") {
        this.openDialog("warning", response.message);
        window.sessionStorage.clear();
        this.router.navigate(["/login"]);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (e) { }
  }

  getContentJSON(url: any) {
    return this.http.get(url);
  }

  restrictspecialchars(event: any) {
    var k;
    k = event.charCode;
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }
  showhttpspinner() {
    this.spinner.show();
  }
  hidehttpspinner() {
    this.spinner.hide();
  }
  getJSON(url: any) {
    return this.http.get(url);
  }
  isvalidhttpurl(url: any) {
    // var pattern =
    //   /([a-zA-Z0-9\-\.\$]+):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    // if (pattern.test(url)) {
    //   return true;
    // }
    return true;
    // try {
    //   if (url == null || url == undefined || url.trim() == "") return false;
    //   if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1) return false;
    //   if (url.length < 10) return false;

    // } catch (e) {

    // }
    // return true;
  }
  isvalidtext(txt: any, errmsg: any): boolean {
    try {
      if (txt == null || txt == undefined || txt.trim() == "") {
        this.openDialog("warning", errmsg);
        // this.openSnackBar(errmsg);
        return false;
      }
    } catch (e) { }
    return true;
  }
  trimtext(txt: any): string {
    try {
      let txt1 = txt.trim();
      // txt1 = txt1.replace(" ", "").replace(" ", "");
      if (txt1 != null && txt1 != undefined) return txt1;
    } catch (e) { }
    return txt;
  }

  postDataNoLoader(curl: any, data: any) {
    try {
      if (data.search != null && data.search != undefined) {
        data.search = data.search.toString().trim();
      }
    } catch (e) { }
    var t = this.currenttime();
    let headersList: any = this.setHeaders();
    headersList["current"] = t;
    headersList["reqtoken"] = sha512.sha512(
      JSON.stringify(data) + this.getReqToken(t)
    );
    return this.http
      .post(this.getUrl(curl), data, { headers: headersList })
      .pipe(
        timeout(120000),
        tap((data) => {
          try {
            let _jresp = JSON.parse(JSON.stringify(data));
            if (_jresp.code == "401") {
              this.openDialog("warning", "Session Timeout.");
              window.sessionStorage.clear();
              this.router.navigate(["/login"]);
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else if (_jresp.status == "401") {
              this.openDialog("warning", "Session Timeout.");
              window.sessionStorage.clear();
              this.router.navigate(["/login"]);
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          } catch (e) { }
        }),
        catchError(this.handleError)
      );
  }

  postDataNoLoaderHeaders(curl: any, data: any, lstheaders: any) {
    try {
      if (data.search != null && data.search != undefined) {
        data.search = data.search.toString().trim();
      }
    } catch (e) { }

    var t = this.currenttime();
    let headersList: any = this.setHeaders();
    headersList["current"] = t;
    headersList["reqtoken"] = sha512.sha512(
      JSON.stringify(data) + this.getReqToken(t)
    );
    try {
      if (lstheaders != null && lstheaders.length > 0) {
        for (let i = 0; i < lstheaders.length; i++) {
          headersList[lstheaders[i].key] = lstheaders[i].value;
        }
      }
    } catch (e) { }
    return this.http
      .post(this.getUrl(curl), data, { headers: headersList })
      .pipe(
        timeout(1200000),
        tap((data) => {
          try {
            let _jresp = JSON.parse(JSON.stringify(data));
            if (_jresp.code == "401") {
              this.openDialog("warning", "Session Timeout.");
              window.sessionStorage.clear();
              this.router.navigate(["/login"]);
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else if (_jresp.status == "401") {
              this.openDialog("warning", "Session Timeout.");
              window.sessionStorage.clear();
              this.router.navigate(["/login"]);
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          } catch (e) { }
        }),
        catchError(this.handleError)
      );
  }
  validateEmails(mailids: any): boolean {
    let valid = false;
    if (mailids != null && mailids != undefined && mailids != "") {
      if (mailids.indexOf(",") > -1) {
        let nos = mailids.split(",");

        for (let i = 0; i < nos.length; i++) {
          if (nos[i] != "") {
            let re =
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            valid = re.test(nos[i]);
            if (!valid) {
              break;
            } else {
              valid = true;
            }
          }
        }
      } else {
        let re =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        valid = re.test(mailids);
      }
    } else {
      valid = true;
    }
    return valid;
  }
  getccaremsg(obj: any, def: any) {
    try {
      if (
        obj != null &&
        obj.message != null &&
        obj.message != undefined &&
        obj.message.length > 1
      )
        return obj.message;
    } catch (e) { }
    return def;
  }
  isvalidmsisdn(msisdn: any, allowedIndex: any) {
    try {
      // if (msisdn.indexOf("62") != 0) {
      //   return false;
      // }
      if (msisdn.indexOf(allowedIndex) != 0) {
        return false;
      }
      if (msisdn.length < 11) return false;
    } catch (e) { }
    return true;
  }
  validateproduct(event: KeyboardEvent, selectedpack: any) {
    let regex: RegExp = new RegExp(/[;'\\><(){}!@#$%^&*+=~?/\\[\]\{\}^%#`"]/g);
    let specialKeys: Array<string> = [
      "Backspace",
      "Tab",
      "End",
      "Home",
      "ArrowRight",
      "ArrowLeft",
    ];

    var keyCode = event.which || event.keyCode;

    if (
      keyCode == 9 ||
      keyCode == 38 ||
      keyCode == 39 ||
      keyCode == 37 ||
      keyCode == 40 ||
      keyCode == 8 ||
      keyCode == 46 ||
      keyCode == 118
    ) {
      return true;
    }
    if (keyCode == 32) return false;
    if (keyCode == 13) return false;
    if (event.ctrlKey) {
      // if (event.key.toLowerCase() != 'c' && event.key.toLowerCase() != 'v' && event.key.toLowerCase() != 'x') {
      //   // event.preventDefault();
      //   return false;
      // }
    } else {
      if (specialKeys.indexOf(event.key) !== -1) {
        return true;
      }
      let current: string = selectedpack;
      let next: string = current.concat(event.key);
      if (next && String(next).match(regex)) {
        return false;
      }
    }
    return true;
  }
  getpermissions(substate: any) {
    let _excludestates = "error403,error400,error405,myprofile";
    let perm = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
    let _cur = this.getStateName();
    if (_excludestates.split(",").indexOf(_cur) != -1) {
      perm = { view: 1, add: 1, edit: 1, delete: 1, export: 1 };
      return perm;
    }
    if (this.getRole() == "101003" || this.getRole() == "101004") {
      if (_cur == "dashboard") {
        this.router.navigate(["/home/ccare"]);
        return;
      }
    }
    if (this.getRole() == "101000") {
      perm = { view: 1, add: 1, edit: 1, delete: 1, export: 1 };
      return perm;
    }
    try {
      let _obj: any[];
      let _state: any;
      _obj = JSON.parse(this.getSession("perm"));
      if (substate != null && substate != undefined && substate.length > 0) {
        _state = _obj.filter(function (itm, idx) {
          return itm.statename == substate;
        });
      } else {
        substate = this.getStateName();
        _state = _obj.filter(function (itm, idx) {
          return itm.statename == substate;
        });
      }
      if (_state != null && _state.length > 0) {
        perm.add = _state[0].add;
        perm.delete = _state[0].delete;
        perm.edit = _state[0].edit;
        perm.export = _state[0].export;
        perm.view = _state[0].view;
      }
    } catch (e) { }
    // console.log(perm);
    if (perm.view == 0) {
      this.router.navigate(["/home/error405"]);
    }
    return perm;
  }

  validatepassword(txt: any) {
    try {
      txt = txt.trim();
      if (txt.length < 8) return false;
      if (
        txt.indexOf("@") == -1 &&
        txt.indexOf("%") == -1 &&
        txt.indexOf("$") == -1
      ) {
        return false;
      }
    } catch (e) { }
    return true;
  }

  PasswordPolicy() {
    let pwdPolicy = "";
    // this.postData('login/GetPasswordPolicy', {}).subscribe((response: any) => {
    //   var policy = response.data;
    //   if (policy.MaxCharsInName != undefined && policy.MaxCharsInName > 0) {
    //     pwdPolicy += "<p>Characters in LoginID should not be present in Password.</p>";
    //   }
    //   pwdPolicy += "<p>Password should contain atleast " + policy.MinLength + " characters.</p>";
    //   pwdPolicy += "<p>It has not been used in the past " + policy.RestrictNoOfPrevMatches + " Passwords.</p>";
    //   pwdPolicy += "<dl><dt> It Contains the following character groups - </dt>";
    //   if (policy.IsUpperCaseRequired == "True") {
    //     pwdPolicy += "<dd>English Uppercase Characters [A-Z], </dd>";
    //   }
    //   if (policy.IsLowerCaseRequired == "True") {
    //     pwdPolicy += "<dd>English Lower case Characters [a-z],</dd>";
    //   }
    //   if (policy.IsNumericsRequired == "True") {
    //     pwdPolicy += "<dd>Numerals[0-9],</dd>";
    //   }
    //   if (policy.IsSpecialCharsRequired == "True") {
    //     var strSplChars = policy.SpecialCharactersAllowed;
    //     pwdPolicy += "<dd> Non - alphabetic characters [" + strSplChars + "],</dd>";
    //   }
    //   pwdPolicy += "</dl>";

    //   return pwdPolicy;
    // });

    pwdPolicy = `<div class="col-md-12">
    <br />
    <mat-accordion>
      <mat-expansion-panel [expanded]="true">
        <mat-expansion-panel-header>
          <mat-panel-title>
            <strong aria-hidden="true"> Password Policy</strong>
          </mat-panel-title>
        </mat-expansion-panel-header>
        <div>
          <div>Password should contain atleast 8 characters.</div>
          <div>Allows following character groups - </div>
          <div>English Uppercase Characters [A-Z] </div>
          <div>English Lower case Characters [a-z]</div>
          <div>Numerals[0-9]</div>
          <div>Non - alphabetic characters @$%</div>
        </div>
      </mat-expansion-panel>
    </mat-accordion>
    <br />
  </div>`;
    return pwdPolicy;
  }
  // showloadingpopup() {
  //   try {
  //     console.log("Loading..");
  //     this._dialog1 = this.dialog.open(MsgdialogueboxComponent, {
  //       disableClose: true,
  //       width: '400px',
  //       data: { type: alert, msg: "Loading..", html: false }
  //     });
  //     setTimeout(() => {
  //       this.hideloadingpopup();
  //     }, 3000);
  //   } catch (e) { }
  // }
  hideloadingpopup() {
    try {
      if (this._dialog1 != null) {
        console.log("Closing");
        this._dialog1.close();
      }
    } catch (e) { }
  }
  handleHttpUploadFileError(result: any) {
    if (result.code == "401") {
      this.openDialog("warning", "Session Timeout.");
      window.sessionStorage.clear();
      this.router.navigate(["/login"]);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
  // openSnackBar(message:any) {
  //   this._snackBar.open(message, "close", {
  //     duration: 3000,
  //   });
  // }
  getspinthewheeldashboard() {
    try {
      if (
        JSON.parse(this.getSession("masterconfig")).showspindashboard != "T"
      ) {
        console.log("Return dashboard");
        return;
      }
      this.postData("spinwheel/summary", {})
        .toPromise()
        .then(
          (response: any) => {
            console.log(response);
            if (response.code == "200") {
              console.log(response);
              if (response.data != null && response.data.length > 0) {
                let _fillcnt = "0";
                let _wincnt = "0";
                let _tmp = response.data.filter((x: any) => {
                  return x.cnttype == "listing";
                });
                if (_tmp != null && _tmp.length > 0) {
                  _fillcnt = _tmp[0].cnt;
                }

                _tmp = response.data.filter((x: any) => {
                  return x.cnttype == "winning";
                });
                if (_tmp != null && _tmp.length > 0) {
                  _wincnt = _tmp[0].cnt;
                }

                let _html = "<div class='row'>";

                _html += "<div class='col-sm-12 brdrpopup'>";
                _html += "<div class='modhdrtxt'>SPIN THE WHEEL</div>";
                _html += "</div> ";

                _html += "<div class='col-sm-12 brdrpopup'>";
                _html += "<div class='col-sm-6 pop_fill'  > ";
                _html += "<div>OFFERS LIST : " + _fillcnt + "</div>";
                _html += "<div></div>";
                _html += "</div>";

                _html += "<div class='col-sm-6 pop_win'  > ";
                _html += "<div>WINNING OFFERS :" + _wincnt + "</div>";
                _html += "</div>";
                _html += "</div> ";

                let _tmpsegmiss = response.data.filter((x: any) => {
                  return x.cnttype == "missingsegments";
                });

                let _tmpseg = response.data.filter((x: any) => {
                  return x.cnttype == "segments";
                });

                let _tmprule = response.data.filter((x: any) => {
                  return x.cnttype == "rules";
                });

                let _today = new Date();
                let _obj: any = [];
                let _addnotify: boolean = true;
                let _tmpnotifications = this.getSession("notifications");
                let _objarraynotifications = [];
                if (
                  _tmpnotifications != null &&
                  _tmpnotifications != undefined &&
                  _tmpnotifications.length > 5
                ) {
                  _objarraynotifications = JSON.parse(_tmpnotifications);
                }
                if (_objarraynotifications.length > 0) {
                  let _cntspin = _objarraynotifications.filter((x: any) => {
                    x.type == "sping";
                  });
                  if (_cntspin != null && _cntspin.length > 0) {
                    _addnotify = false;
                  }
                }
                for (let i = 0; i < 7; i++) {
                  _today = new Date();
                  let _cur = _today.setDate(_today.getDate() + i);
                  let _itm = {
                    offerdate: _cur,
                    seg: 0,
                    rule: 0,
                    segments: "",
                  };
                  let _date = formatDate(
                    _cur,
                    "yyyy-MM-dd 00:00:00",
                    "en-US",
                    ""
                  );
                  if (_tmpseg != null && _tmpseg.length > 0) {
                    let _cntseg = _tmpseg.filter((x: any) => {
                      return x.date == _date;
                    });
                    if (_cntseg != null && _cntseg.length > 0) {
                      _itm.seg = _cntseg[0].cnt;
                    }
                  }
                  if (_tmprule != null && _tmprule.length > 0) {
                    let _cntrule = _tmprule.filter((x: any) => {
                      return x.date == _date;
                    });
                    if (_cntrule != null && _cntrule.length > 0) {
                      _itm.rule = _cntrule[0].cnt;
                    }
                  }

                  if (_tmpsegmiss != null && _tmpsegmiss.length > 0) {
                    let _cntrulemis = _tmpsegmiss.filter((x: any) => {
                      return x.date == _date;
                    });
                    if (_cntrulemis != null && _cntrulemis.length > 0) {
                      for (let a = 0; a < _cntrulemis.length; a++) {
                        _itm.segments += _cntrulemis[a].cnt + " ,  ";
                      }
                    }
                  }
                  _obj.push(_itm);
                }

                _html += "<div class='col-sm-12 brdrpopupinner'>";
                _html += "<div class='col-sm-2 fltleft modhdr'  > ";
                _html += "<div>Offer Date</div>";
                _html += "</div>";

                _html += "<div class='col-sm-2 fltleft modhdr'  > ";
                _html += "<div>Scheduled</div>";
                _html += "</div>";

                _html += "<div class='col-sm-2 fltleft modhdr'  > ";
                _html += "<div>Allocated</div>";
                _html += "</div>";

                _html += "<div class='col-sm-6 fltleft modhdr'  > ";
                _html += "<div>Not Configured</div>";
                _html += "</div>";

                _html += "</div>";

                for (let i = 0; i < _obj.length; i++) {
                  let _defcss = "";

                  _html += "<div class='col-sm-12 brdrpopupinner'>";

                  _html += "<div class='col-sm-2 fltleft '  > ";
                  _html +=
                    "<div  class='innetxt'>" +
                    formatDate(_obj[i].offerdate, "yyyy-MM-dd", "en-US", "") +
                    "</div>";
                  _html += "</div>";

                  if (_obj[i].seg == 0) _defcss = "bagred";
                  _html += "<div class='col-sm-2 fltleft " + _defcss + "'  > ";
                  _html += "<div  class='innetxt'>" + _obj[i].seg + "</div>";
                  _html += "</div>";
                  if (_obj[i].rule == 0) _defcss = "bagred";
                  if (_obj[i].seg > _obj[i].rule) _defcss = "bagred";

                  _html += "<div class='col-sm-2 fltleft " + _defcss + "'  > ";
                  _html += "<div class='innetxt'>" + _obj[i].rule + "</div>";
                  _html += "</div>";

                  _html += "<div class='col-sm-6 fltleft " + _defcss + "'  > ";
                  _html +=
                    "<div class='innetxt'>" + _obj[i].segments + "</div>";
                  _html += "</div>";

                  _html += "</div>";
                  if (i == 0 || i == 1) {
                    if (_defcss == "bagred" && _addnotify) {
                      let _tmp = this.getSession("notifications");
                      let _objarray = [];
                      if (
                        _tmp != null &&
                        _tmp != undefined &&
                        _tmp.length > 5
                      ) {
                        _objarray = JSON.parse(_tmp);
                      }
                      let _txt =
                        "Spin Rule Mapping Pending. Date: " +
                        formatDate(
                          _obj[i].offerdate,
                          "yyyy-MM-dd",
                          "en-US",
                          ""
                        ) +
                        ", Segments Missing: " +
                        _obj[i].segments;
                      if (_obj[i].segments == "") {
                        _txt =
                          "Spin Rule Mapping Pending. Date: " +
                          formatDate(
                            _obj[i].offerdate,
                            "yyyy-MM-dd",
                            "en-US",
                            ""
                          );
                      }
                      _objarray.push({
                        type: "spin",
                        msg: _txt,
                        redirect: "#/home/publish",
                      });

                      this.setSession(
                        "notifications",
                        JSON.stringify(_objarray)
                      );
                    }
                  }
                }

                _html += "</div>";

                this.openDialog("msg", _html, true);
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } catch (e) { }
  }

  approvalpending(approvaltype: any) {
    try {
      if (approvaltype == "1") {
        if (
          JSON.parse(this.getSession("masterconfig")).showbannerapproval != "T"
        ) {
          return;
        }
        let requesrParams = {
          start: 1,
          length: 2,
          orderDir: "desc",
          status: 1,
        };
        this.postDataNoLoader("banners/getworkflowitems", requesrParams)
          .toPromise()
          .then(
            (response: any) => {
              if (response.code == "200") {
                if (
                  response.banners != null &&
                  response.banners.banners != null &&
                  response.banners.banners.length > 0
                ) {
                  let _tmp = this.getSession("notifications");
                  let _objarray = [];
                  if (_tmp != null && _tmp != undefined && _tmp.length > 5) {
                    _objarray = JSON.parse(_tmp);
                  }
                  _objarray.push({
                    type: "banner",
                    msg:
                      "Banner Changes Pending for Approval. Count:" +
                      response.recordsTotal,
                    redirect: "#/home/publish",
                  });
                  this.setSession("notifications", JSON.stringify(_objarray));
                }
              }
            },
            (err) => {
              console.log(err);
            }
          );
      }
      if (approvaltype == "2") {
        if (
          JSON.parse(this.getSession("masterconfig")).showbannergroupapproval !=
          "T"
        ) {
          return;
        }
        let requesrParams = {
          start: 1,
          length: 2,
          orderDir: "desc",
          status: 1,
        };
        this.postDataNoLoader("banners/getbannergroupworkflow", requesrParams)
          .toPromise()
          .then(
            (response: any) => {
              if (response.code == "200") {
                if (
                  response.banners != null &&
                  response.banners.banners != null &&
                  response.banners.banners.length > 0
                ) {
                  let _tmp = this.getSession("notifications");
                  let _objarray = [];
                  if (_tmp != null && _tmp != undefined && _tmp.length > 5) {
                    _objarray = JSON.parse(_tmp);
                  }
                  _objarray.push({
                    type: "bannergroup",
                    msg:
                      "Banner Group Changes Pending for Approval. Count:" +
                      response.recordsTotal,
                    redirect: "#/home/publish",
                  });
                  this.setSession("notifications", JSON.stringify(_objarray));
                }
              }
            },
            (err) => {
              console.log(err);
            }
          );
      }
      if (approvaltype == "3") {
        if (
          JSON.parse(this.getSession("masterconfig")).showalertsapproval != "T"
        ) {
          return;
        }

        let requesrParams = {
          status: 1,
          type: 1,
          orderDir: "desc",
          start: 1,
          length: 2,
        };
        this.postDataNoLoader("alerts/getalertworkflow", requesrParams)
          .toPromise()
          .then(
            (response: any) => {
              if (response.code == "200") {
                if (
                  response.alertdata != null &&
                  response.alertdata.length > 0
                ) {
                  let _tmp = this.getSession("notifications");
                  let _objarray = [];
                  if (_tmp != null && _tmp != undefined && _tmp.length > 5) {
                    _objarray = JSON.parse(_tmp);
                  }
                  _objarray.push({
                    type: "alerts",
                    msg:
                      "User Alerts Changes Pending for Approval. Count:" +
                      response.recordsTotal,
                    redirect: "#/home/publish",
                  });

                  this.setSession("notifications", JSON.stringify(_objarray));
                }
              }
            },
            (err) => {
              console.log(err);
            }
          );
      }
      if (approvaltype == "4") {
        if (
          JSON.parse(this.getSession("masterconfig")).showrulesapproval != "T"
        ) {
          return;
        }

        let requesrParams = {
          type: 1,
          status: 1,
          name: "",
          start: 1,
          length: 2,
          orderDir: "desc",
        };
        this.postDataNoLoader("rules/getworkflowitems", requesrParams)
          .toPromise()
          .then(
            (response: any) => {
              if (response.code == "200") {
                if (response.rules != null && response.rules.length > 0) {
                  let _tmp = this.getSession("notifications");
                  let _objarray = [];
                  if (_tmp != null && _tmp != undefined && _tmp.length > 5) {
                    _objarray = JSON.parse(_tmp);
                  }
                  _objarray.push({
                    type: "rules",
                    msg:
                      "Banner Rule Changes Pending for Approval. Count:" +
                      response.recordsTotal,
                    redirect: "#/home/publish",
                  });
                  this.setSession("notifications", JSON.stringify(_objarray));
                  // this.openSnackBar("Banner Rule Changes Pending for Approval");
                }
              }
            },
            (err) => {
              console.log(err);
            }
          );
      }
      if (approvaltype == "5") {
        if (
          JSON.parse(this.getSession("masterconfig")).showpagesapproval != "T"
        ) {
          return;
        }
        let requestpage = {
          search: "",
          start: 0,
          length: 1,
          orderDir: "desc",
          status: 1,
        };
        this.postDataNoLoader("pages/getworkflows", requestpage)
          .toPromise()
          .then(
            (response: any) => {
              if (response.code == "200") {
                if (response.data != null && response.data.length > 0) {
                  let _tmp = this.getSession("notifications");
                  let _objarray = [];
                  if (_tmp != null && _tmp != undefined && _tmp.length > 5) {
                    _objarray = JSON.parse(_tmp);
                  }
                  _objarray.push({
                    type: "pages",
                    msg:
                      "App Pages Changes Pending for Approval. Count:" +
                      response.recordsTotal,
                    redirect: "#/home/publish",
                  });
                  this.setSession("notifications", JSON.stringify(_objarray));
                }
              }
            },
            (err) => {
              console.log(err);
            }
          );
      }
    } catch (e) { }
  }
  RC4EncryptDecryptph(text: string): string {
    let Password = '';
    Password = 'M72S912O2L';
    var cipherEnDeCrypt = '';
    var N = 256;
    var cipher = '';
    var a;
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
        let tempSwap: any = sbox[a];
        sbox[a] = sbox[b];
        sbox[b] = tempSwap;
      }

      var cipher = '';
      var i = 0,
        j = 0,
        k = 0;
      for (var a: any = 0; a < text.length; a++) {
        i = (i + 1) % N;
        j = (j + sbox[i]) % N;
        var tempSwap: any = sbox[i];
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
    } catch (e) { }
    return '';
  }
  RC4EncryptDecrypt(text: string): string {
    let Password = '';
    Password = '1234';
    var cipherEnDeCrypt = '';
    var N = 256;
    var cipher = '';
    var a;
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
        let tempSwap: any = sbox[a];
        sbox[a] = sbox[b];
        sbox[b] = tempSwap;
      }

      var cipher = '';
      var i = 0,
        j = 0,
        k = 0;
      for (var a: any = 0; a < text.length; a++) {
        i = (i + 1) % N;
        j = (j + sbox[i]) % N;
        var tempSwap: any = sbox[i];
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
    } catch (e) { }
    return '';
  }
  Decrypt(text: any) {
    var hex = text.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    text = str;
    let Password = '';
    Password = 'M72S912O2L';
    var cipherEnDeCrypt = '';
    var N = 256;
    var cipher = '';
    var a;
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
        let tempSwap: any = sbox[a];
        sbox[a] = sbox[b];
        sbox[b] = tempSwap;
      }

      var cipher = '';
      var i = 0,
        j = 0,
        k = 0;
      for (var a: any = 0; a < text.length; a++) {
        i = (i + 1) % N;
        j = (j + sbox[i]) % N;
        var tempSwap: any = sbox[i];
        sbox[i] = sbox[j];
        sbox[j] = tempSwap;

        k = sbox[(sbox[i] + sbox[j]) % N];

        var cipherBy = text[a].charCodeAt(0) ^ k;

        var _tmp1 = String.fromCharCode(cipherBy);
        cipher += _tmp1 + '';
      }
      return cipher;
    } catch (e) { }
    return '';
  }

}
