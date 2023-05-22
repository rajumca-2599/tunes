import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatSpinner, MatDialogRef, fadeInContent, MatTableDataSource, ThemePalette, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { Location } from '@angular/common';
import { EnvService } from '../../../../shared/services/env.service';

@Component({
  selector: 'app-ccare-index',
  templateUrl: './ccare-index.component.html',
  styleUrls: ['./ccare-index.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        display: 'block',
        opacity: 1,
      })),
      state('closed', style({
        display: 'none',
        opacity: 0,
      })),
      transition('open => closed', [
        animate('0.4s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
    ]),
  ]
})
export class CcareIndexComponent implements OnInit, OnDestroy {
  showchildnumbers: boolean = true;
  parentnumber: any = "";
  reportid: any = "";
  enabledreset: boolean = false;
  transactionrange: any;
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  reason: string = "";
  private _dialog1: Subscription;
  private _dialog2: Subscription;
  profileavailable: boolean = false;
  private _httpobj1: Subscription;
  private _httpobj2: Subscription;
  dashboardobj: any = {};
  childtransid: any = "";
  showotp: boolean = false;
  defaultotp: any = {
    enabled: "F", otp: ""
  };
  reportnameList: any[] = [];
  childobject: any = { transid: "", "childmsisdn": "", "relation": "friend", "title": "" }
  childnumberlist: any = [];
  userinfo: any = {};
  displayedColumnsGetLine: string[] = ["childmsisdn", "name", "serviceType", "portedin"];
  displayedColumnsPromoCode: string[] = ["transectiondate", "Promocode", "status", "Actions"];
  dataSource: any = new MatTableDataSource();
  dataSource1: any = new MatTableDataSource();
  currentmsisdn: any = "";
  isbsnl = false;
  _promocode: any = "";
  dataavilable = true;
  displayedColumnssummary: string[] = ["title", "initialquota", "usedquota", "remainingquota", "isunlimited"];
  dataSourcesummary: any = new MatTableDataSource();
  displayedColumnspack: string[] = ["ServiceType", "ServiceName", "ServiceDescription", "PackageCode", "PackageName", "StartDate"
    , "EndDate", "PackagePeriod", "PeriodUnit", "BuyExtra", "Unreg", "UnregKeyword", "UnregShortcode"];


  dataSourcepacks: any = new MatTableDataSource();
  selectedprodobj: any = {};

  public msisdn: string = "";
  public showHeader: boolean = true;
  public selectedtab: number = 0;
  public selectedtabchild: number = 0;
  startdate: Date = new Date();
  iscreateprofile: boolean = false;
  d = new Date();
  year = this.d.getFullYear();
  month = this.d.getMonth();
  day = this.d.getDate();
  enddate: Date = new Date(this.year + 2, this.month, this.day, 23, 59, 59);
  emailverifed: boolean = false;
  maxdob: Date = new Date(this.year - 10, this.month, this.day, 23, 59, 59);
  mindob: Date = new Date(this.year - 100, this.month, this.day, 23, 59, 59);
  currentdate: Date = new Date();
  mindays: Date = new Date(this.currentdate.getFullYear(), this.currentdate.getMonth() - 6, this.currentdate.getDay());
  displayedColumnsReports: any[] = [];
  userInfo: any = {};
  lastLoggedIn: any = '';
  loggedInAttempts: any = '';
  producttransinfo: any = {};
  public hasprodtransinfo: boolean = false
  masterconfiglist: any;
  enableOtp = false;
  userInfoLst: any = {};
  PromocodeData: any = {}
  showprofileinfo = true;
  portedin: boolean = false;
  deleteRecord: string = "";
  public statuslist: any;
  constructor(private location: Location, private ccapi: CommonService, private router: Router, private dialog: MatDialog,
    public env: EnvService) {
    this.statuslist = this.env.customerCareStaus;
  }
  ngOnInit() {
    this.dataavilable = true;
    try {
      this.masterconfiglist = JSON.parse(this.ccapi.getSession("masterconfig"));
      if (this.ccapi.getRole() == this.env.customercareroleid) {
        this.reportnameList = JSON.parse(this.ccapi.getSession("masterconfig")).customeragentreports;
      }
      else { this.reportnameList = JSON.parse(this.ccapi.getSession("masterconfig")).customercarereports; }
      this.reportid = this.reportnameList[0].reportid;
    } catch (e) { }

    this.displayedColumnspack = ["key", "value"];
    this.showHeader = true;
    // this.msisdn = "6281585313637";
    this.dataSource = new MatTableDataSource();
    this.dataSource1 = new MatTableDataSource();
    this.defaultotp = {
      enabled: "F", otp: formatDate(new Date(), "yyyyMMdd", 'en-US', "")
    };
    this.currentdate = new Date();
    this.mindays = new Date(this.currentdate.getFullYear(), this.currentdate.getMonth() - 6, this.currentdate.getDate());

    this.transactionrange = [
      new Date(this.currentdate.getFullYear(), this.currentdate.getMonth(), 1, 0, 0),
      new Date(this.currentdate.getFullYear(), this.currentdate.getMonth(), this.currentdate.getDate(), 23, 59)
    ];
    if ((this.ccapi.getRole() == "101003" || this.ccapi.getRole() == "101000") && this.env.isresetenable) { this.enabledreset = true; }
    //Disable for customer care agents
    if (this.ccapi.getRole() == "101004" || this.env.isbsnl) {
      this.enableOtp = true;
    }
    let _storednumber = this.ccapi.getSession("prefetch_msisdn");
    // console.log("stored :" + _storednumber)
    if (_storednumber != null && _storednumber != undefined && _storednumber.length > 10) {
      this.msisdn = _storednumber;
      window.sessionStorage.removeItem("dashboardinfo");
      window.sessionStorage.removeItem("profileinfo");
      this.ResetChangenumber();
      this.getccaredetails();
      window.sessionStorage.removeItem("prefetch_msisdn")
    }
  }
  changenumber() {
    this.dataavilable = true;
    if (this.currentmsisdn != null && this.currentmsisdn.length > 0 && this.currentmsisdn != this.msisdn) {
      // this.showconfirm("getprofile", "");
      if (!this.env.enableccareprofilecreatepopup) {
        this.userInfo = null;

        window.sessionStorage.removeItem("dashboardinfo");
        window.sessionStorage.removeItem("profileinfo");
        this.ResetChangenumber();
        this.getccaredetails();
        return;
      }
      else {
        this.showHeader = false;
        this.iscreateprofile = true;
        this.ccapi.openSnackBar("User Details not available.");
        this.showconfirm("getprofile", "");
      }
    }
    else {
      window.sessionStorage.removeItem("dashboardinfo");
      window.sessionStorage.removeItem("profileinfo");
      this.ResetChangenumber();
      this.getccaredetails();
    }

  }
  getlastloginedin() {
    let req = { "msisdn": this.msisdn };
    let headerlist = this.getheaderlist();
    this.ccapi.showhttpspinner();
    this.ccapi.postDataNoLoaderHeaders('user/lastloggedin', req, headerlist).toPromise().then((resp: any) => {
      this.ccapi.hidehttpspinner();
      // console.log(resp);
      try {
        if (resp.code == "200" && resp.data != null) {
          this.lastLoggedIn = resp.data.lastLoggedIn;
        }
      } catch (e) { }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
  }
  getloginattempts() {
    let req = { "msisdn": this.msisdn };
    let headerlist = this.getheaderlist();
    this.ccapi.showhttpspinner();
    this.ccapi.postDataNoLoaderHeaders('user/loggedinattempts', req, headerlist).toPromise().then((resp: any) => {
      this.ccapi.hidehttpspinner();
      // console.log("hsfvjs", resp);
      try {
        if (resp.code == "200" && resp.data != null) {
          this.loggedInAttempts = resp.data.loggedInAttempts;
        }
      } catch (e) { }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
  }
  getpursedtrasactions() {
    let dt = new Date();
    let mon = dt.getMonth() + 1;
    let today = dt.getFullYear() + '-' + mon + '-' + dt.getDate();
    let str = dt.getDate() - 1;
    let yesterday: any = dt.getFullYear() + '-' + mon + '-' + str;
    let req = {
      "fromdate": yesterday,
      "todate": today,
      "pagination": {
        "start": 0,
        "end": 1
      },
      "category": "",
      "status": ""
    };


    let headerlist = this.getheaderlist();
    this.ccapi.showhttpspinner();
    this.ccapi.postDataNoLoaderHeaders('transaction/history', req, headerlist).toPromise().then((resp: any) => {
      this.ccapi.hidehttpspinner();
      // console.log("- transaction/history", resp);
      this.hasprodtransinfo = false;
      let transdata: any;
      try {
        if (resp.code == "200" && resp.data != null) {
          transdata = JSON.parse(resp.data);
          if (transdata.status == '0') {
            if (transdata.data.transactions.length > 0) {
              this.producttransinfo = transdata.data.transactions[0];
              this.hasprodtransinfo = true;
            }
            else
              this.producttransinfo = { productname: '', paymenttype: '', timestamp: '', price: '' };
          } else {
            this.producttransinfo = { productname: '', paymenttype: '', timestamp: '', price: '' };
            // this.ccapi.openDialog("error", this.ccapi.getccaremsg(transdata, "Unable to Fetch Product Transactions"));
          }
        }
      } catch (e) { }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
  }
  getccaredetails() {
    this.selectedtab = 0;

    if (this.msisdn == "" || this.msisdn == undefined) {
      this.ccapi.openDialog("error", "Msisdn is requied.");
    }
    else if (this.msisdn.length < this.env.msisdnminlength) {
      this.ccapi.openDialog("error", "Mobile number should be greater than. " + this.env.msisdnminlength);
    }
    else {
      if (this.msisdn.indexOf("620") == 0) {
        this.ccapi.openDialog("error", "Invalid msisdn."); return;
      }
      if (this.msisdn.indexOf("0") == 0) {
        let _tmp = this.msisdn + "";
        _tmp = _tmp.substring(1);
        this.msisdn = this.env.countrycode + _tmp;
      }
      else if (this.msisdn.indexOf(this.env.countrycode) != 0) {
        let _tmp = this.env.countrycode + this.msisdn;
        if (_tmp.length > this.env.msisdnmaxlength) { this.ccapi.openDialog("error", "Mobile number should be less than. " + this.env.msisdnmaxlength); return; }
        this.msisdn = this.env.countrycode + this.msisdn;
      }

      this.showHeader = false;
      this.dashboardobj = {};
      window.sessionStorage.removeItem("dashboardinfo");
      window.sessionStorage.removeItem("profileinfo");
      this.isProfileAvailable();

    }
  }
  createtoken() {
    this.profileavailable = false;
    var _token = this.ccapi.getSession("token_" + this.msisdn);
    if (_token == null || _token == "") {
      let req = {};
      let headerlist = this.getheaderlist();
      this.ccapi.postDataNoLoaderHeaders('token/get', req, headerlist).toPromise().then((resp: any) => {
        // console.log(resp);
        let _tokenobj = null;
        try {
          if (resp.code == "200" && resp.data != null) {
            _tokenobj = JSON.parse(resp.data);
          }
        } catch (e) { }
        if (_tokenobj != null && _tokenobj != undefined && _tokenobj.status == "0" && _tokenobj.data != null && _tokenobj.data.tokenid != null
          && _tokenobj.data.tokenid != undefined) {
          this.ccapi.setSession("msisdn", this.msisdn);
          this.ccapi.setSession("token_" + this.msisdn, _tokenobj.data.tokenid);

          // this.showHeader = false;
          this.selectedtab = 0;
          this.getprofile(1);
        }
        else {
          this.ccapi.openDialog("error", this.ccapi.getccaremsg(_tokenobj, "Unable to Fetch Token"));
        }

      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
    else {
      this.ccapi.setSession("msisdn", this.msisdn);
      this.ccapi.setSession("token_" + this.msisdn, _token);
      this.selectedtab = 0;
      this.getprofile(1);
    }
  }
  tabChangeEvent(tab) {
    this.selectedtab = tab;
    // if (this.env.isenablesecondarysendotp) { this.displayedColumnsGetLine = ["childmsisdn", "actions"]; }
    // else { this.displayedColumnsGetLine = ["childmsisdn"]; }
    if (this.selectedtab == 2) {
      this.getchildnumber();
    }
    else if (this.selectedtab == 1 && this.dataavilable) {
      this.getdashboard();
    }
    this.loadReportsdata()
    // else if (this.selectedtab == 3) { this.gettranshistory(); }

  }

  tabChangeEventchild(tab) {
    this.selectedtabchild = tab;
  }

  ngOnDestroy() {
    // console.log("destroypostdata");
    if (this._httpobj1 != null && this._httpobj1 != undefined)
      this._httpobj1.unsubscribe();
    if (this._httpobj2 != null && this._httpobj2 != undefined)
      this._httpobj2.unsubscribe();
    if (this._dialog1 != null && this._dialog1 != undefined)
      this._dialog1.unsubscribe();
    if (this._dialog2 != null && this._dialog2 != undefined)
      this._dialog2.unsubscribe();
  }


  getprofile(reqtype) {
    try {
      if (this.ccapi.getRole() == this.env.customercareroleid) {
        this.reportnameList = JSON.parse(this.ccapi.getSession("masterconfig")).customeragentreports;
      }
      else { this.reportnameList = JSON.parse(this.ccapi.getSession("masterconfig")).customercarereports; }
      this.reportid = this.reportnameList[0].reportid;
    } catch (e) { }
    var _prof = ""
    {
      var __profileInfo = this.ccapi.getSession("profileinfo");
      if (__profileInfo != null && __profileInfo != undefined && __profileInfo.length > 10) {
        if (reqtype != "2") {
          this.validateprofiledata(JSON.parse(__profileInfo));
          return;
        }
      }
      let req = {};

      //this.getlastloginedin();
      // this.getloginattempts();      
      // this.getpursedtrasactions();
      this.getparentnumber();
      let headerlist = this.getheaderlist();
      this.ccapi.showhttpspinner();
      this.ccapi.postDataNoLoaderHeaders('profile/get', req, headerlist).toPromise().then((resp: any) => {
        this.ccapi.hidehttpspinner();
        // console.log(resp);
        let _tokenobj = null;
        try {
          if (resp.code == "200" && resp.data != null) {
            _tokenobj = JSON.parse(resp.data);
          }
        } catch (e) { }
        this.validateprofiledata(_tokenobj);
      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
  }
  validateprofiledata(_tokenobj) {
    if (_tokenobj != null && _tokenobj != undefined && _tokenobj.status == "0") {
      // this.ccapi.setSession("profileinfo", JSON.stringify(_tokenobj));
      this.ccapi.setSession("profileinfo", _tokenobj);
      this.currentmsisdn = this.msisdn + "";
      this.profileavailable = true;
      this.showHeader = false;
      try {
        let _year = _tokenobj.data.dob.split('/')[2];
        let _month = parseInt(_tokenobj.data.dob.split('/')[1]) - 1;
        let _day = _tokenobj.data.dob.split('/')[0];
        _tokenobj.data.dob = new Date(_year, _month, _day);

      } catch (r) { _tokenobj.data.dob = this.d; }
      _tokenobj.data.emailverified = _tokenobj.data.emailverified + "";
      if (_tokenobj.data.emailverified == "0" || _tokenobj.data.emailverified == "0.0" || _tokenobj.data.emailverified == "false") this.emailverifed = false; else this.emailverifed = true;
      this.userinfo = _tokenobj.data;
      this.showchildnumbers = _tokenobj.data.managenumber;
      this.getotpsettings();
    }
    else {
      if (_tokenobj != null && _tokenobj.code != null && _tokenobj.code == "300001") {
        this.showHeader = false;
        this.iscreateprofile = true;
        this.ccapi.openDialog("error", this.ccapi.getccaremsg(_tokenobj, "User Does not Exist"));
      }
      else {
        this.showHeader = true;
        this.ccapi.openDialog("error", this.ccapi.getccaremsg(_tokenobj, "Unable to Fetch Profile Information"));
      }
    }
  }
  updateprofile() {
    var _prof = ""
    {

      if (!this.ccapi.isvalidtext(this.userinfo.dob, "Please select DOB")) return;
      let req = {
        "name": this.userinfo.firstname,
        "dob": formatDate(this.userinfo.dob, "dd/MM/yyyy", 'en-US', ""),
        "email": this.userinfo.emailid
      };
      if (!this.ccapi.isvalidtext(this.userinfo.firstname, "Name is Mandatory")) return;
      if (!this.ccapi.isvalidtext(this.userinfo.emailid, "Email ID is Mandatory")) return;
      if (!this.ccapi.validateEmails(this.userinfo.emailid)) {
        this.ccapi.openDialog("error", "Enter valid Email"); return;
      }
      let headerlist = this.getheaderlist();
      var _url = 'profile/update';
      if (this.iscreateprofile)
        _url = "profile/create";
      this.ccapi.showhttpspinner();
      this.ccapi.postDataNoLoaderHeaders(_url, req, headerlist).toPromise().then((resp: any) => {
        this.ccapi.hidehttpspinner();
        // console.log(resp);
        let _tokenobj = null;
        window.sessionStorage.removeItem("profileinfo");
        try {
          if (resp.code == "200" && resp.data != null) {
            _tokenobj = JSON.parse(resp.data);
          }
        } catch (e) { }
        if (_tokenobj != null && _tokenobj != undefined && _tokenobj.status == "0") {
          this.ccapi.openDialog("success", "Profile Updated Successfully");

          setTimeout(() => {
            this.getprofile(2);
          }, 3000);
        }
        else {
          this.ccapi.openDialog("error", this.ccapi.getccaremsg(_tokenobj, "Unable to update profile information"));
        }

      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
  }

  createprofile() {
    var _prof = ""
    {

      let headerlist = this.getheaderlist();
      var _url = "profile/create";
      this.ccapi.showhttpspinner();
      this.ccapi.postDataNoLoaderHeaders(_url, {}, headerlist).toPromise().then((resp: any) => {
        this.ccapi.hidehttpspinner();
        // console.log(resp);
        let _tokenobj = null;
        window.sessionStorage.removeItem("profileinfo");
        try {
          if (resp.code == "200" && resp.data != null) {
            _tokenobj = JSON.parse(resp.data);
          }
        } catch (e) { }
        if (_tokenobj != null && _tokenobj != undefined && _tokenobj.status == "0") {
          this.ccapi.openSnackBar("Profile Created Successfully");
          this.getprofile(2);
        }
        else {
          if (_tokenobj.code == "10032") {
            this.getprofile(2);
          }
          else
            this.ccapi.openDialog("error", this.ccapi.getccaremsg(_tokenobj, "Unable to Create profile"));
        }

      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
  }
  showconfirm(reqtype, row) {
    let _txt = 'Please click "YES"  to fetch profile details. (' + this.msisdn + ')';
    if (reqtype == "profile") {
      _txt = 'Please click "YES" to update profile details.';
    }
    else if (reqtype == "resetprofile")
      _txt = 'Please click "YES" to reset profile. Once reset all data will be removed.';
    else if (reqtype == "create")
      _txt = 'Please click "YES" to create profile.';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      width: '400px',
      data: {
        message: _txt,
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });
    this._dialog2 = dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        if (reqtype == "profile") {
          this.updateprofile();
        }
        else if (reqtype == "removeline") {
          this.reomovechildnumber(row);
        }
        else if (reqtype == "disconnect") {
          this.disconnectsocial(row);
        }
        else if (reqtype == "getprofile") {
          ///For chaging mobile number..
          this.ccapi.setSession("prefetch_msisdn", this.msisdn);
          location.reload();
          // this.getccaredetails();
        }
        else if (reqtype == "updateotp") {
          this.updateotp();
        }
        else if (reqtype == "resetprofile") {
          this.resetprofile();
        }
        else if (reqtype == "unblockotp") {
          this.unblockotp();
        }
        else if (reqtype == "create") {
          this.createtoken();
        }
      }
      else {
        if (reqtype == "getprofile") {
          window.location.reload();
        }
      }
    });
  }
  unblockotp() {

    let obj = {
      "msisdn": this.msisdn
    }
    var _url = "otp/unlock";
    this.ccapi.showhttpspinner();
    this.ccapi.postData(_url, obj).toPromise().then((resp: any) => {
      this.ccapi.hidehttpspinner();
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
      }
      else
        this.ccapi.openDialog('warning', resp.message);
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
  }
  getchildnumber() {
    var _prof = ""
    {
      let req = {};
      this.dataSource = new MatTableDataSource();
      let headerlist = this.getheaderlist();
      this.ccapi.showhttpspinner();
      // this.ccapi.postDataNoLoaderHeaders('primary/lines', req, headerlist).toPromise().then((resp: any) => {
      this.ccapi.postDataNoLoaderHeaders('account/info', req, headerlist).toPromise().then((resp: any) => {
        this.ccapi.hidehttpspinner();
        // console.log(resp);
        let _tokenobj = null;
        try {
          if (resp.code == "200" && resp.data != null) {
            _tokenobj = resp.data;
            let _list = [];
            if (resp.data.lines != null && resp.data.lines.length > 0) {
              for (let i = 0; i < resp.data.lines.length; i++) {
                try {
                  if (resp.data.lines[i].parent == true) continue;
                  //_list.push({ "childmsisdn": _tokenobj.data.lines[i].msisdn, "relation": _tokenobj.data.lines[i].relation })
                  _list.push({ "childmsisdn": resp.data.lines[i].msisdn, "serviceType": resp.data.lines[i].serviceType, "portedin": resp.data.lines[i].isportedin, "name": resp.data.lines[i].name })
                }
                catch (e) { console.log(e); }
              }
              this.dataSource = new MatTableDataSource(_list);
            }
            // else {
            //   this.ccapi.openDialog("error", this.ccapi.getccaremsg(_tokenobj, "Unable to Fetch Child Numbers"));
            // }
          }
        } catch (e) { }
      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
  }

  addchildnumber() {
    var _prof = ""
    {
      if (!this.ccapi.isvalidmsisdn(this.childobject.childmsisdn, this.env.countrycode)) {
        this.ccapi.openDialog("error", "Enter Valid MSISDN"); return false;
      }
      if (!this.ccapi.isvalidtext(this.childobject.relation, "Enter Relation")) {
        return false;
      }
      let req = {
        "transid": this.childtransid, "childmsisdn": this.childobject.childmsisdn, "relation": this.childobject.relation,
        "title": this.childobject.title
      };
      let headerlist = this.getheaderlist();
      this.ccapi.showhttpspinner();
      this.ccapi.postDataNoLoaderHeaders('primary/addline', req, headerlist).toPromise().then((resp: any) => {
        this.ccapi.hidehttpspinner();
        // console.log(resp);
        let _tokenobj = null;
        try {
          if (resp.code == "200" && resp.data != null) {
            _tokenobj = JSON.parse(resp.data);
          }
        } catch (e) { }
        if (_tokenobj != null && _tokenobj != undefined && _tokenobj.status == "0") {
          this.restaddnumber();
          this.ccapi.openDialog("success", "Child Number Added successfully"); this.getchildnumber();
        }
        else {
          this.ccapi.openDialog("error", this.ccapi.getccaremsg(_tokenobj, "Unable to Add Child Numbers"));
        }
      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
  }

  reomovechildnumber(row) {
    var _prof = ""
    {
      let req = {
        "childmsisdn": this.env.countrycode + row.childmsisdn
      };
      let headerlist = this.getheaderlist();
      this.ccapi.showhttpspinner();

      this.ccapi.postDataNoLoaderHeaders('primary/removeline', req, headerlist).toPromise().then((resp: any) => {
        // console.log(resp);
        this.ccapi.hidehttpspinner();

        let _tokenobj = null;
        try {
          if (resp.code == "200" && resp.data != null) {
            _tokenobj = JSON.parse(resp.data);
          }
        } catch (e) { }
        if (_tokenobj != null && _tokenobj != undefined && _tokenobj.status == "0") {
          this.ccapi.openDialog("success", "Child Number Removed Successfully");
          setTimeout(() => {
            this.getchildnumber();
          }, 3000)

        }
        else {
          this.ccapi.openDialog("error", this.ccapi.getccaremsg(_tokenobj, "Unable to Remove Child Numbers"));
        }
      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
  }
  getheaderlist() {
    let _list = [];
    _list.push({ "key": "X-IMI-CHANNEL", value: "CCARE" });
    _list.push({ "key": "X-IMI-LANGUAGE", value: "EN" });
    _list.push({ "key": "X_USER_MSISDN", value: this.msisdn });
    _list.push({ "key": "X-IMI-MSISDN", value: this.msisdn });
    // _list.push({ "key": "X-IMI-CHILD-LINENO", value: this.msisdn });
    // _list.push({ "key": "X-IMI-CHILD-LINENO", value: "65C287B7D34D37CA175731B34F" });
    var _token = this.ccapi.getSession("token_" + this.msisdn);
    if (_token == "") _token = formatDate(this.d, "yyyyMMddHHmmss", 'en-US', "");
    // _list.push({ "key": "X-IMI-TOKENID", value: "12345678" });
    _list.push({ "key": "X-IMI-TOKENID", value: _token });
    return _list;
  }
  sendotpaddline() {
    var _prof = ""
    {
      if (!this.ccapi.isvalidtext(this.childobject.childmsisdn, "Invalid MSISDN")) return;
      if (!this.ccapi.isvalidmsisdn(this.childobject.childmsisdn, this.env.countrycode)) {
        this.ccapi.openDialog("error", "Invalid MSISDN. MSISDN should start with Country Code.");
        return;
      }
      let req = {
        "msisdn": this.childobject.childmsisdn, "action": "addnumber"
      };
      let headerlist = this.getheaderlist();
      this.ccapi.showhttpspinner();

      this.ccapi.postDataNoLoaderHeaders('otp/send', req, headerlist).toPromise().then((resp: any) => {
        this.ccapi.hidehttpspinner();

        // console.log(resp);
        let _tokenobj = null;
        try {
          if (resp.code == "200" && resp.data != null) {
            _tokenobj = JSON.parse(resp.data);
          }
        } catch (e) { }
        if (_tokenobj != null && _tokenobj != undefined && _tokenobj.status == "0") {
          this.childtransid = _tokenobj.data.transid + "";
          this.childobject.transid = _tokenobj.data.transid + "";
          // console.log(this.childobject.transid);
          this.showotp = true;
          this.ccapi.openDialog("success", this.ccapi.getccaremsg(_tokenobj, "OTP Sent to Mobile Number"));
        }
        else {
          this.ccapi.openDialog("error", this.ccapi.getccaremsg(_tokenobj, "Unable to send OTP"));
        }
      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
  }


  validateotp() {
    var _prof = ""
    {
      if (!this.ccapi.isvalidtext(this.childobject.transid, "Invalid Transacton ID")) return;
      if (!this.ccapi.isvalidtext(this.childobject.otp, "Invalid OTP")) return;
      if (this.childobject.otp.length < 6) {
        this.ccapi.openDialog("error", ("Invalid OTP")); return;
      }
      let req = {
        "transid": this.childobject.transid, "otp": this.childobject.otp
      };
      let headerlist = this.getheaderlist();
      this.ccapi.showhttpspinner();

      this.ccapi.postDataNoLoaderHeaders('otp/validate', req, headerlist).toPromise().then((resp: any) => {
        this.ccapi.hidehttpspinner();

        // console.log(resp);
        let _tokenobj = null;
        try {
          if (resp.code == "200" && resp.data != null) {
            _tokenobj = JSON.parse(resp.data);
          }
        } catch (e) { }
        if (_tokenobj != null && _tokenobj != undefined && _tokenobj.status == "0") {
          this.showotp = true;
          this.addchildnumber();
        }
        else {
          this.ccapi.openDialog("error", this.ccapi.getccaremsg(_tokenobj, "Invalid OTP"));
        }
      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
  }
  restaddnumber() {
    this.childobject = { transid: "", "childmsisdn": "", "relation": "friend", "title": "" };
    this.showotp = false; this.childtransid = "";
  }



  disconnectsocial(stype) {
    var _prof = ""
    {
      let req = { "socialtype": stype };
      let headerlist = this.getheaderlist();
      this.ccapi.showhttpspinner();

      this.ccapi.postDataNoLoaderHeaders('profile/disconnect', req, headerlist).toPromise().then((resp: any) => {
        this.ccapi.hidehttpspinner();

        // console.log(resp);
        let _tokenobj = null;
        try {
          if (resp.code == "200" && resp.data != null) {
            _tokenobj = JSON.parse(resp.data);
          }
        } catch (e) { }
        if (_tokenobj != null && _tokenobj != undefined && _tokenobj.status == "0") {
          this.restaddnumber();
          this.ccapi.openDialog("success", "Successfully Disconnected");
          setTimeout(() => {
            this.getprofile(2);
          }, 3000);
        }
        else {
          this.ccapi.openDialog("error", this.ccapi.getccaremsg(_tokenobj, "Unable to disconnect"));
        }
      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
  }


  getdashboard() {
    var _prof = ""
    {
      var __dashboardinfo = this.ccapi.getSession("dashboardinfo");
      if (__dashboardinfo != null && __dashboardinfo != undefined && __dashboardinfo.length > 10) {
        this.formdashboarddata(JSON.parse(__dashboardinfo));
        return;
      }

      let req = {};
      let headerlist = this.getheaderlist();
      this.dataSourcesummary = new MatTableDataSource();
      this.ccapi.showhttpspinner();

      this.ccapi.postDataNoLoaderHeaders('dashboard/get', req, headerlist).toPromise().then((resp: any) => {
        this.ccapi.hidehttpspinner();

        // console.log(resp);
        let _tokenobj = null;
        try {
          if (resp.code == "200" && resp.data != null) {
            _tokenobj = JSON.parse(resp.data);
          }
        } catch (e) { }
        this.formdashboarddata(_tokenobj);
      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
  }
  formdashboarddata(_tokenobj) {
    if (_tokenobj != null && _tokenobj != undefined && _tokenobj.status == "0") {
      this.ccapi.setSession("dashboardinfo", JSON.stringify(_tokenobj));
      let _list = [];
      this.dashboardobj = _tokenobj.data;
      if (_tokenobj.data.summary.data != null && _tokenobj.data.summary.data != undefined) {
        _list.push(_tokenobj.data.summary.data);
      }
      if (_tokenobj.data.summary.voice != null && _tokenobj.data.summary.voice != undefined) {
        _list.push(_tokenobj.data.summary.voice);
      }
      if (_tokenobj.data.summary.sms != null && _tokenobj.data.summary.sms != undefined) {
        _list.push(_tokenobj.data.summary.sms);
      }
      if (_tokenobj.data.summary.credits != null && _tokenobj.data.summary.credits != undefined) {
        _list.push(_tokenobj.data.summary.credits);
      }
      try {
        this.dashboardobj.packdata.expireddate = this.dashboardobj.packdata.expireddate.substring(0, 4) + "-"
          + this.dashboardobj.packdata.expireddate.substring(4, 6) + "-" + this.dashboardobj.packdata.expireddate.substring(6, 8);
      } catch (e) { }
      this.dashboardobj.summarylist = _list;
      // this.dataSourcesummary = new MatTableDataSource(this.dashboardobj.summarylist);
      // this.dataSourcepacks = new MatTableDataSource(this.formproducts(this.dashboardobj.packdata.packageslist));
      if (this.dashboardobj.packdata != null && this.dashboardobj.packdata.packageslist != null &&
        this.dashboardobj.packdata.packageslist.length > 0)
        this.serviceselected(this.dashboardobj.packdata.packageslist[0]);
    }
    else {
      this.showHeader = false;
      this.ccapi.openDialog("error", this.ccapi.getccaremsg(_tokenobj, "Unable to Fetch Profile Information"));
    }

  }

  serviceselected(selpack) {
    this.selectedprodobj = selpack;
    let _list = [];
    try {
      _list.push({ key: "Service Type", value: selpack.ServiceType });
      // _list.push({ key: "Name", value: selpack.ServiceName });
      _list.push({ key: "Description", value: selpack.ServiceDescription });
      _list.push({ key: "PackageCode", value: selpack.PackageCode });
      _list.push({ key: "PackageName", value: selpack.PackageName });
      _list.push({ key: "StartDate", value: selpack.StartDate });
      _list.push({ key: "EndDate", value: selpack.EndDate });
    } catch (e) { }
    this.dataSourcepacks = new MatTableDataSource(_list);
    return _list;
  }
  updateotp() {
    var _otp = this.defaultotp.otp; //formatDate(new Date(), "yyyyMMdd", 'en-US', "");
    if (_otp.length != 6) {
      if (this.defaultotp.enabled != "F") {
        this.ccapi.openDialog("error", "OTP Should be numeric with 6 digits"); return;
      }
    }
    let obj = {
      "keyword": this.ccapi.trimtext(this.msisdn + "_otp"),
      "value": _otp,
      "description": "Default OTP",
      "group_name": "DEFAULT_OTP"
    }
    var _url = "globalsettings/update";
    if (this.defaultotp.enabled == "F")
      _url = _url = "globalsettings/delete";
    this.ccapi.showhttpspinner();
    this.ccapi.postData(_url, obj).toPromise().then((resp: any) => {
      this.ccapi.hidehttpspinner();
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
        this.getotpsettings();
      }
      else
        this.ccapi.openDialog('warning', resp.message);
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
  }
  getotpsettings() {
    let requesrParams = {
      search: (this.msisdn + "_otp"),
      filterBy: "",
      start: 1,
      length: 2,
      orderDir: "desc"
    }
    this.ccapi.postData('globalsettings/getall', requesrParams).toPromise().then((response: any) => {
      if (response.code == "200") {
        if (response && response.data) {
          this.defaultotp.enabled = "T";
          this.defaultotp.otp = response.data[0].value + "";
        }
        else {
          this.defaultotp.enabled = "F";
          this.defaultotp.otp = formatDate(new Date(), "yyMMdd", 'en-US', "");
        }
      }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
  }
  bytesToSize(bytes: number) {
    try {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes == 0) return '0 Byte';
      let _floor: number = Math.log(bytes) / Math.log(1024);
      var i = (Math.floor(_floor));
      return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    } catch (e) { }
    return "";
  }

  bytesToSizeData(bytes: number, conv: string) {
    try {
      let _flor: number = 0;

      switch (conv) {
        case "KB": {
          _flor = bytes * 0.000001;
          conv = "GB";
          break;
        }
        case "MB": {
          _flor = bytes * 0.001; conv = "GB";
          break;
        }
      }
      return Math.ceil(_flor) + " " + conv;
    } catch (e) { }
    return "";
  }
  gettranshistory() {
    let name = "msisdn";
    let start = 0;
    let _datecolumn = "datetime";
    try {
      let _rpid = this.reportid;
      let _tmp = this.reportnameList.filter(function (ele, idx) {
        return ele.reportid == _rpid;
      });
      if (_tmp != null && _tmp.length > 0) {
        _datecolumn = _tmp[0].datecolumn;
      }
    } catch (e) { }
    if (this.pageObject.pageNo > 1)
      start = ((this.pageObject.pageNo - 1) * this.pageObject.pageSize);

    if (this.reportid == "1" && this.env.isbsnl)
      name = "loginid"
    var reqObject = {
      reportId: this.reportid,
      dateFilter:
      {
        "dateStart": formatDate(this.transactionrange[0], 'yyyy-MM-dd', 'en-US', ''),
        "dateEnd": formatDate(this.transactionrange[1], 'yyyy-MM-dd', 'en-US', '')
      },
      paginationInfo:
      {
        "start": start,
        end: this.pageObject.pageSize
      },
      orderByInfo:
      {
        fieldName: _datecolumn,
        order: "DESC"
      },

      // fulltextsearch: "",
      filter: [{ "fieldName": name, "fieldValue": this.msisdn },
      { fieldName: "tomsisdn", fieldValue: this.msisdn }]
    }
    this.displayedColumnsReports = [];
    this.datacolumns = [];
    this.ccapi.postData('esreports/generateReport', reqObject).toPromise().then((response: any) => {
      // console.log(response);
      // console.log(response);
      if (response != null && response.code != null && response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response != null && response.code != null && response.code == "200") {
        try {
          var _json = JSON.parse(response.data);
          response.transactionInfo = _json;
        } catch (e) { }
        if (response.transactionInfo != null && response.transactionInfo.transactions != null &&
          response.transactionInfo.transactions.length > 0) {
          let _reportdispfiled = null;

          for (let a = 0; a < this.reportnameList.length; a++) {
            if (this.reportnameList[a].reportid == this.reportid) {
              _reportdispfiled = this.reportnameList[a]; break;
            }
          }
          if (_reportdispfiled != null) {
            this.datacolumns = [];
            for (let i = 0; i < _reportdispfiled.displayfields.length; i++) {
              let obj: any = _reportdispfiled.displayfields[i];
              let field = obj.key;
              if (this.displayedColumnsReports.indexOf(field) == -1) {
                this.displayedColumnsReports.push(field);
                this.datacolumns.push(obj);
              }
            }
            this.dataSource = new MatTableDataSource(response.transactionInfo.transactions);
            this.pageObject.totalRecords = response.transactionInfo.numFound;
            this.pageObject.totalPages = response.transactionInfo.transactions.length;


          }
        }
        else {
          this.ccapi.openDialog("warning", "No Records Found");
        }
      }

    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
  }
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  changePage(page: number) {
    if (page) {
      this.pageObject.pageNo = page;
      this.paginator.pageIndex = (page - 1);
      this.getPage({ pageIndex: (this.pageObject.pageNo) });
    }
  }

  changePageSize(obj) {
    this.pageObject.pageNo = 0;
    this.pageObject.pageSize = obj.pageSize;
    this.gettranshistory();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.gettranshistory();
  }
  datacolumns: any = [];
  getdatafromrow(row, idx) {
    try {
      let _datacol = this.datacolumns[idx];
      if (_datacol != null && _datacol.key != "status") {
        return row[_datacol.key];
      }
      else {
        var status = this.statuslist.filter(x => x.key == row[_datacol.key])[0].value;
        return status;
      }
    } catch (e) { }
    return "";
  }
  loadReportsdata() {
    this.displayedColumnsReports = [];
    this.datacolumns = [];
    this.dataSource = new MatTableDataSource([]);
    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0;

  }

  ResetChangenumber() {
    this.showchildnumbers = false;
    this.userinfo = {}
    this.dataSource = new MatTableDataSource();
    this.childobject = { transid: "", "childmsisdn": "", "relation": "friend", "title": "" };
    this.showotp = false; this.childtransid = "";
    this.dataSourcesummary = new MatTableDataSource();

    this.dataSourcepacks = new MatTableDataSource();
    this.dataSource = new MatTableDataSource();
    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0;
    this.dashboardobj = {};
    this.childtransid = "";
    this.showotp = false;
    this.defaultotp = {
      enabled: "F", otp: ""
    };
    this.childnumberlist = [];
    this.selectedprodobj = {};
    this.selectedtab = 0;
    this.selectedtabchild = 0;
    this.iscreateprofile = false;
    this.emailverifed = false;
    this.displayedColumnsReports = [];
    this.reason = "";
  }


  resetprofile() {
    var _prof = ""
    {
      if (!this.ccapi.isvalidtext(this.reason, "Please Enter Reason")) return;
      let headerlist = this.getheaderlist();
      var _url = 'reset/user';
      this.ccapi.showhttpspinner();
      let obj = { msisdn: this.msisdn, "reason": this.reason };
      this.ccapi.postDataNoLoaderHeaders(_url, obj, headerlist).toPromise().then((resp: any) => {
        this.ccapi.hidehttpspinner();
        // console.log(resp);
        let _tokenobj = null;
        window.sessionStorage.removeItem("dashboardinfo");
        window.sessionStorage.removeItem("profileinfo");
        try {
          if (resp.code == "200" && resp.data != null) {
            _tokenobj = JSON.parse(resp.data);
          }
        } catch (e) { }
        if (_tokenobj != null && _tokenobj != undefined && _tokenobj.status == "0") {
          this.ccapi.openDialog("success", "Request has been successfully Initiated"); this.ResetChangenumber();
          window.sessionStorage.removeItem("token_" + this.msisdn);
          window.location.reload();
        }
        else {
          this.ccapi.openDialog("error", this.ccapi.getccaremsg(_tokenobj, "Unable to reset profile"));
        }

      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
  }

  isProfileAvailable() {
    // if (this.masterconfiglist.checkprofileexists == "T") {
    this.ccapi.postData('profile/getprofile', { msisdn: this.msisdn }).toPromise().then((response: any) => {
      if (response != null && response.code == "200") {
        if (response && response.data && response.data.msisdn != null && response.data.msisdn.length > 10) {
          this.dataSource1 = new MatTableDataSource(response.data.data);
          this.userInfoLst = response.data;
          this.portedin = response.data.isportedin;
          this.isbsnl = response.data.isbsnl;
          this.createtoken();
        }
        else {
          if (!this.env.enableccareprofilecreatepopup) {
            this.dataavilable = false;
            this.userInfo = null;
            this.userInfoLst = {};
            this.profileavailable = true;
            this.showchildnumbers = false;
            this.portedin = false;
            this.isbsnl = false;
            this.parentnumber = "";
            return;
          }
          this.showHeader = false;
          this.iscreateprofile = true;
          this.ccapi.openSnackBar("User Details not available.");
          this.showconfirm("create", "");
        }
      }
      else {
        if (!this.env.enableccareprofilecreatepopup) {
          this.userInfo = null;
          this.userInfoLst = {};
          this.profileavailable = true;
          this.showchildnumbers = false;
          this.portedin = false;
          this.isbsnl = false;
          this.parentnumber = "";
          return;
        }
        this.showHeader = false;
        this.iscreateprofile = true;
        this.ccapi.openSnackBar("User Details not available.");
        this.showconfirm("create", "");
      }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
    // }
    // else {
    //   this.createtoken();
    // }
  }
  getparentnumber() {
    let req = { "msisdn": this.msisdn };
    let headerlist = this.getheaderlist();
    this.ccapi.showhttpspinner();
    this.parentnumber = this.msisdn + "";
    this.ccapi.postDataNoLoaderHeaders('profile/checkparent', req, headerlist).toPromise().then((resp: any) => {
      this.ccapi.hidehttpspinner();
      try {
        if (resp.code == "200") {
          this.parentnumber = resp.data != null && resp.data.length > 0 ? resp.data[0].parentnumber : this.msisdn;
        }

      } catch (e) { }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
  }
  deleteRule(obj: any): void {
    this._promocode = obj.promocode
  }
  deleteMsisdn() {
    if (this.deleteRecord.length < 200 && this.deleteRecord != "") {
      let _msisdn = this.ccapi.RC4EncryptDecrypt(this.msisdn)
      let req = { "msisdn": _msisdn, "promocode": this._promocode, "reason": this.deleteRecord };
      this.ccapi.showhttpspinner();
      this.ccapi.postData('promotions/remove', req).toPromise().then((response: any) => {
        this.ccapi.hidehttpspinner();
        if (response != null && response.code == "200" && response.status == "success") {
          this.PromocodeData = response.data;
          document.getElementById("modaltemplate").click()
          this.ccapi.openDialog('success', "your request successfully processed ");
        }
        else {
          document.getElementById("modaltemplate").click()
          this.ccapi.openDialog('warning', response.message);
        }
      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
    else {
      document.getElementById("modaltemplate").click()
      this.ccapi.openDialog("error", "Please Enter The Reason")
    }
    this.deleteRecord = ""
  }



}
