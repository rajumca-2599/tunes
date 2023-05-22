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


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  allpacksinfo: any[] = [];
  showchildnumbers: boolean = false;
  profileinformation: any[];
  segementinformation: any[];
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
  displayedColumnsGetLine: string[] = ["childmsisdn", "actions"];
  dataSource: any = new MatTableDataSource();
  currentmsisdn: any = "";

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
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog) { }
  ngOnInit() {
    try {
      this.masterconfiglist = JSON.parse(this.ccapi.getSession("masterconfig"));
    } catch (e) { }

    this.showHeader = true;
    // this.msisdn = "6281585313637";
    this.dataSource = new MatTableDataSource();
    this.GetRulesInfo()
  }
  changenumber() {

    if (this.currentmsisdn != null && this.currentmsisdn.length > 0 && this.currentmsisdn != this.msisdn) {
      this.showconfirm("getprofile", "");
    }
    else {

      this.profileavailable = false;
      this.profileinformation = [];
      this.getccaredetails();

    }

  }

  showconfirm(reqtype, row) {
    let _txt = 'Please click "YES" to process this request.';

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
        this.getccaredetails();
      }
    });
  }



  getccaredetails() {
    this.selectedtab = 0;

    if (this.msisdn == "" || this.msisdn == undefined) {
      this.ccapi.openDialog("error", "Msisdn is requied.");
    }
    else if (this.msisdn.length < 9) {
      this.ccapi.openDialog("error", "Invalid msisdn.");
    }
    else {
      if (this.msisdn.indexOf("620") == 0) {
        this.ccapi.openDialog("error", "Invalid msisdn."); return;
      }
      if (this.msisdn.indexOf("0") == 0) {
        let _tmp = this.msisdn + "";
        _tmp = _tmp.substring(1);
        this.msisdn = "62" + _tmp;
      }
      else if (this.msisdn.indexOf("62") != 0) {
        let _tmp = "62" + this.msisdn;
        if (_tmp.length > 15) { this.ccapi.openDialog("error", "Invalid msisdn."); return; }
        this.msisdn = "62" + this.msisdn;
      }

      this.showHeader = false;
      this.dashboardobj = {};
      window.sessionStorage.removeItem("dashboardinfo");
      window.sessionStorage.removeItem("profileinfo");
      this.isProfileAvailable();

    }
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

  GetRulesInfo() {
    var _tmpRes = this.ccapi.getSession("allpacksinfo");
    if (_tmpRes == null || _tmpRes == undefined || _tmpRes.length < 10) {
      this.profileavailable = false;
      let sdate: Date = new Date(this.masterconfiglist.SPINSTART.replace("-", "/").replace("-", "/"));

      let edate = new Date(this.masterconfiglist.SPINSTART.replace("-", "/").replace("-", "/"));
      edate.setDate(edate.getDate() + 60);
      let requesrParams = {
        orderDir: "desc", startdate: formatDate(sdate, "yyyy-MM-dd", 'en-US', ""),
        enddate: formatDate(edate, "yyyy-MM-dd", 'en-US', ""),
        start: 1,
        length: 1000, status: 1
      }
      this.ccapi.postData('spinwheel/getmasterrules', requesrParams).toPromise().then((response: any) => {
        if (response != null && response.code == "200") {
          if (response && response.data != null)
            this.allpacksinfo = response.data
          this.ccapi.setSession("allpacksinfo", JSON.stringify(this.allpacksinfo));
        }
      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
    else {
      this.allpacksinfo = JSON.parse(_tmpRes);
    }
  }

  isProfileAvailable() {
    this.profileavailable = false;
    this.ccapi.postData('profile/getprofile', { msisdn: this.msisdn }).toPromise().then((response: any) => {
      if (response != null && response.code == "200") {
        if (response && response.data && response.data.msisdn != null && response.data.msisdn.length > 10) {
          let _infoobj = response.data;
          let _proarray = []
          this.profileavailable = true;
          for (let key in _infoobj) {
            if (_infoobj[key] == null || _infoobj[key] == undefined) continue;
            try {
              if (_infoobj[key].constructor == ({}).constructor) continue;
              if (_infoobj[key].constructor == [].constructor) continue;
            } catch (e) { }
            _proarray.push({ "key": key, value: _infoobj[key] });
          }
          this.profileinformation = _proarray;
          this.getSegmentInfo();
        }
        else {
          this.ccapi.openSnackBar("User Details not available.");
        }
      }
      else {
        this.ccapi.openSnackBar("User Details not available.");
      }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });

  }
  tabChangeEvent(tab) {
    this.selectedtab = tab;
  }

  getSegmentInfo() {
    this.segementinformation = [];
    this.ccapi.postData('profile/getsegmentprofile', { msisdn: this.msisdn }).toPromise().then((response: any) => {
      if (response != null && response.code == "200") {
        if (response && response.data && response.data.msisdn != null && response.data.msisdn.length > 10) {
          let _infoobj = response.data.days;
          let sdate: Date = new Date(this.masterconfiglist.SPINSTART.replace("-", "/").replace("-", "/"));
          let _proarray = []
          let iDays = 0;
          for (let iDays = 0; iDays < 50; iDays++) {

            if (_infoobj["d" + iDays] != null && _infoobj["d" + iDays] != undefined) {
              let key = "d" + iDays;
              let _id = iDays;
              let sdate: Date = new Date(this.masterconfiglist.SPINSTART.replace("-", "/").replace("-", "/"));
              sdate.setDate(sdate.getDate() + _id);
              let _packname = ""
              let _rule = this.allpacksinfo.filter((itm) => {
                return itm.segmentid + "" == _infoobj[key] + "";
              })
              if (_rule != null && _rule.length > 0) {
                _proarray.push({
                  "key": formatDate(sdate, 'yyyy-MM-dd', 'en-US', ''),
                  value: _rule[0].segmentname,
                  pack: _rule[0].packname
                });
              }
              else {
                _proarray.push({
                  "key": formatDate(sdate, 'yyyy-MM-dd', 'en-US', ''),
                  value: _infoobj[key],
                  pack: _packname
                });
              }
            }
          }
          this.segementinformation = _proarray;
        }
        else {
          this.ccapi.openSnackBar("Spin Segment not Configured.");
        }
      }
      else {
        this.ccapi.openSnackBar("Spin Segment not Configured.");
      }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });

  }
}

