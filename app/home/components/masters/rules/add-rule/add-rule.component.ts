import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
import { CommonService } from '../../../../../shared/services/common.service';
import { JsonPipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { ConfirmDialogComponent } from '../../../../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSpinner, fadeInContent, MatTableDataSource, ThemePalette, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-add-rule',
  templateUrl: './add-rule.component.html',
  styleUrls: ['./add-rule.component.css']
})
export class AddRuleComponent implements OnInit {
  subscriberTypeList = [{ "id": 1, "name": "Prepaid" }, { "id": 2, "name": "Postpaid" }, { "id": 3, "name": "Both" }];
  dropdownList = [];
  selectedItems: any = [];
  dropdownSettings = {};

  public statuslist: any[] = [{ id: "1", name: "Active" }, { id: "0", name: "Inactive" }];

  selectedItemssegment: any = [];
  dropdownSettingssegment = {};



  dropdownListWeek = [{ id: 1, week: 'Monday' }, { id: 2, week: 'Tuesday' }, { id: 3, week: 'Wednesday' },
  { id: 4, week: 'Thursday' }, { id: 5, week: 'Friday' }, { id: 6, week: 'Saturday' }, { id: 7, week: 'Sunday' }];
  selectedItemsWeek: any = [];
  dropdownSettingsWeek = {};

  dropdownListDays = [];
  selectedItemsDays: any = [];
  dropdownSettingsDays = {};

  dropdownListAppVer = [{ appver: '2.4' }, { appver: '3.8' }, { appver: '5.6' }, { appver: '7.8' }, { appver: '9.0' }];
  selectedItemsAppVer: any = [];
  dropdownSettingsAppVer = {};
  segmentlist: any[] = [];
  public title: string = "ADD RULE";
  public ruleobj: any;
  public mode: string = 'insert';

  d = new Date();
  year = this.d.getFullYear();
  month = this.d.getMonth();
  day = this.d.getDate();
  startdate: Date = new Date(this.year, this.month, this.day + 1, 0, 0, 0);
  enddate: Date = new Date(this.year + 1, this.month, this.day, 0, 0, 0);
  iosVersions = [];
  andriodVersions = [];
  public selectedtab: number = 0;
  starttime: Date = new Date();
  endtime: Date = new Date();

  constructor(private dialog: MatDialog, private comm: CommonService, private dialogRef: MatDialogRef<AddRuleComponent>, @Inject(MAT_DIALOG_DATA) data) {

    this.ruleobj = data;
    //console.log(this.ruleobj);
    // console.log(this.ruleobj.subscribertype);
    //this.ruleobj.appversioneligible = this.ruleobj.appversioneligible + "";
    this.starttime.setHours(0);
    this.starttime.setMinutes(0);
    this.endtime.setHours(23);
    this.endtime.setMinutes(59);
    this.mode = data.mode;
    if (data.mode == "update") {
      this.mode = "update";
      this.title = "EDIT RULE"
      //this.ruleobj.service_class = data.serviceclass.toString();
      //this.selectedItems = this.ruleobj.serviceclass;
      if (this.ruleobj.serviceclass != undefined && this.ruleobj.serviceclass != null && this.ruleobj.serviceclass.length > 0) {
        this.ruleobj.servicecls = this.ruleobj.serviceclass.toString();
      }
      this.selectedItemsDays = this.ruleobj.daysofmonth;
      this.selectedItemsWeek = this.getselectedobjects(this.ruleobj.daysofweek, this.dropdownListWeek);
      if (this.ruleobj.status == "") this.ruleobj.status = 1;
      this.ruleobj.status = this.ruleobj.status + "";
      if (this.ruleobj.startdate != '') {
        //this.startdate = new Date(parseInt(this.ruleobj.startdate.split('-')[0]), parseInt(this.ruleobj.startdate.split('-')[1]), parseInt(this.ruleobj.startdate.split('-')[2]), 0, 0, 0);
        let str = this.ruleobj.startdate.substring(0, this.ruleobj.startdate.length - 2);
        let sdate: Date = new Date(str.replace("-", "/").replace("-", "/"));
        this.startdate = sdate;

        let str1 = this.ruleobj.enddate.substring(0, this.ruleobj.enddate.length - 2);
        let edate: Date = new Date(str1.replace("-", "/").replace("-", "/"));
        this.enddate = edate;
      }
      let strttime = [];
      let edtime = []
      if (this.ruleobj.starttime != undefined && this.ruleobj.starttime != null && this.ruleobj.starttime != '') {
        strttime = this.ruleobj.starttime.split(':');
        if (strttime.length > 0) {
          this.starttime.setHours(strttime[0]);
          this.starttime.setMinutes(strttime[1]);
        }
      }
      if (this.ruleobj.endtime != undefined && this.ruleobj.endtime != null && this.ruleobj.endtime != '') {
        edtime = this.ruleobj.endtime.split(':');
        if (edtime.length > 0) {
          this.endtime.setHours(edtime[0]);
          this.endtime.setMinutes(edtime[1]);
        }
      }
    }
  }

  ngOnInit() {
    this.getsegments();

    this.dropdownSettingssegment = {
      singleSelection: false,
      idField: 'id',
      textField: 'filename',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: "Segment(s) are not available."
    };



    this.dropdownSettings = {
      singleSelection: false,
      idField: 'ruleId',
      textField: 'ruleId',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 7,
      allowSearchFilter: true
    };
    this.dropdownSettingsWeek = {
      singleSelection: false,
      idField: 'id',
      textField: 'week',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };
    this.dropdownSettingsDays = {
      singleSelection: false,
      idField: 'day',
      textField: 'day',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };
    this.dropdownSettingsAppVer = {
      singleSelection: false,
      idField: 'versionId',
      textField: 'versionId',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };
    this.loadSubscribers();
    this.loadDays();
    this.loadAndriodVersions();
    this.loadIOSVersions();
    this.loadAppEligibleVersions();
    try {
      if (this.ruleobj.mode == "update") {
        this.ruleobj.status = this.ruleobj.status + "";
        this.mode = "update";
        this.title = "EDIT RULE"
        //this.ruleobj.service_class = data.serviceclass.toString();
        this.selectedItems = this.ruleobj.serviceclass;
        let _segmentsselected = []
        try {

          if (this.ruleobj.segments != null && this.ruleobj.segments.length == 1) {
            if (this.ruleobj.segments[0].indexOf(",") > 0) {
              let _tmp = this.ruleobj.segments[0];
              for (let b = 0; b < this.segmentlist.length; b++) {
                if (_tmp.split(',').indexOf(this.segmentlist[b].id + "") != -1) {
                  _segmentsselected.push(this.segmentlist[b]);
                }
              }
            }
          }
        } catch (e) { }
        this.selectedItemssegment = _segmentsselected;
        try {
          if (this.ruleobj.daysofmonth.length == 1) {
            if (this.ruleobj.daysofmonth[0].indexOf(",") > 0) {
              let _tmp = this.ruleobj.daysofmonth[0];
              this.ruleobj.daysofmonth = _tmp.split(',');
            }
          }
        } catch (e) { }

        try {
          if (this.ruleobj.daysofweek.length == 1) {
            if (this.ruleobj.daysofweek[0].indexOf(",") > 0) {
              let _tmp = this.ruleobj.daysofweek[0];
              this.ruleobj.daysofweek = _tmp.split(',');
            }
          }
        } catch (e) { }


        this.selectedItemsDays = this.ruleobj.daysofmonth;

        this.selectedItemsWeek = this.getselectedobjects(this.ruleobj.daysofweek, this.dropdownListWeek);
        if (this.ruleobj.status == "") this.ruleobj.status = 1;
        this.selectedItemsAppVer = this.formlistarray(this.ruleobj.specificversions);
        if (this.ruleobj.startdate != '') {
          //this.startdate = new Date(parseInt(this.ruleobj.startdate.split('-')[0]), parseInt(this.ruleobj.startdate.split('-')[1]), parseInt(this.ruleobj.startdate.split('-')[2]), 0, 0, 0);
          //this.enddate = new Date(parseInt(this.ruleobj.enddate.split('-')[0]), parseInt(this.ruleobj.enddate.split('-')[1]), parseInt(this.ruleobj.enddate.split('-')[2]), 0, 0, 0);
        }
      }
    }
    catch (e) { }
    setTimeout(() => {
      try {
        this.ruleobj.status = this.ruleobj.status + "";
      } catch (e) { }
    }, 2000)

  }
  loadAppEligibleVersions() {
    // let requesrParams = {
    //   search: '',
    //   start: 1,
    //   length: 100,
    //   orderDir: "desc"
    // }
    // this.dropdownListAppVer = [];
    // if (window.sessionStorage.getItem("eligibleversions") != null)
    //   this.dropdownListAppVer = JSON.parse(window.sessionStorage.getItem("eligibleversions"));
    // if (this.dropdownListAppVer.length == 0) {
    //   this.comm.postData('rules/eligibleversions', requesrParams).subscribe((response: any) => {
    //     if (response.data)
    //       this.dropdownListAppVer = response.data;
    //     window.sessionStorage.setItem("eligibleversions", JSON.stringify(this.dropdownListAppVer));
    //     //console.log(response);
    //   });
    // }
    try {
      let _applist = JSON.parse(this.comm.getSession("appversionlist"));
      this.dropdownListAppVer = [];
      let _arrlist = []
      for (let i = 0; i < _applist.length; i++) {
        _arrlist.push({ versionId: _applist[i] });
      }
      this.dropdownListAppVer = _arrlist;
    } catch (e) { }

  };
  loadAndriodVersions() {
    let requesrParams = {
      search: '',
      start: 1,
      length: 100,
      orderDir: "desc"
    }
    if (window.sessionStorage.getItem("andriodVersions") != null)
      this.andriodVersions = JSON.parse(window.sessionStorage.getItem("andriodVersions"));
    if (this.andriodVersions.length == 0) {
      this.comm.postData('rules/androidversions', requesrParams).subscribe((response: any) => {
        if (response.data)
          this.andriodVersions = response.data;
        window.sessionStorage.setItem("andriodVersions", JSON.stringify(this.andriodVersions));
        //console.log(response);
      });
    }
  };
  loadIOSVersions() {
    let requesrParams = {
      search: '',
      start: 1,
      length: 100,
      orderDir: "desc"
    }
    if (window.sessionStorage.getItem("iosversions") != null)
      this.iosVersions = JSON.parse(window.sessionStorage.getItem("iosversions"));
    if (this.iosVersions.length == 0) {
      this.comm.postData('rules/iosversions', requesrParams).subscribe((response: any) => {
        // console.log(response);
        if (response.data)
          this.iosVersions = response.data;
        window.sessionStorage.setItem("iosversions", JSON.stringify(this.iosVersions));
      });
    }
  };
  loadDays() {
    this.dropdownListDays = [];
    for (let i = 1; i <= 31; i++) {
      this.dropdownListDays.push({ day: i + "" });
    }
    if (this.mode == 'update') {
      this.selectedItemsDays = this.ruleobj.daysofmonth;
    }
  }
  loadSubscribers() {
    let requesrParams = {
      orderDir: "desc",
      search: "",
      start: 1,
      length: 100
    }
    this.dropdownList = [{ ruleId: "Blue" }, { ruleId: "Red" }, { ruleId: "Silver" }];

    let arr = this.dropdownList;
    this.selectedItems = [];
    this.dropdownList = arr;

    if (this.mode == 'update') {
      //console.log(this.ruleobj.serviceclass);
      this.selectedItems = this.ruleobj.serviceclass;
    }
    // if (this.dropdownList == null || this.dropdownList.length == 0) {
    //   // this.comm.postData('rules/SubscribersList', requesrParams).subscribe((response: any) => {
    //   //   if (response.code == "500" && response.status == "error") {
    //   //     this.comm.openDialog("warning", response.message);
    //   //     return;
    //   //   }
    //   //   else if (response.code == "200" && response.status.toLowerCase() == "success") {
    //   //     let arr = response.data;
    //   //     for (let i = 0; i < arr.length; i++) {
    //   //       arr[i].id = i;
    //   //     }
    //   //     this.selectedItems = [];
    //   //     this.dropdownList = arr;
    //   //     // console.log(this.dropdownList);
    //   //   }
    //   // });
    // }
  };
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  onSelectAllSegments(items: any) {
    console.log(items);
  }

  onItemSelectDays(item: any) {
    console.log(item);
  }
  onSelectAllDays(items: any) {
    console.log(items);
  }
  onItemSelectWeek(item: any) {
    console.log(item);
  }
  onSelectAllWeek(items: any) {
    console.log(items);
  }
  onItemSelectAppVer(item: any) {
    console.log(item);
  }
  onSelectAllAppVer(items: any) {
    console.log(items);
  }


  close() {
    this.dialogRef.close();
  }
  getselecteditems(itemlist) {
    try {
      var arr: any[] = [];
      for (var i = 0; i < itemlist.length; i++) {
        arr.push(itemlist[i].id + "");
      }
      return arr;

    } catch (e) {
      return null;
    }
  }
  getselectedobjects(itemlist, inputitems) {
    try {
      let arr: any[] = [];
      for (var i = 0; i < inputitems.length; i++) {
        var chkitem = itemlist.filter(function (element, index) {
          return (element == inputitems[i].id);
        });
        if (chkitem != null && chkitem != undefined && chkitem.length > 0) {
          arr.push(inputitems[i]);
        }

      }
      return arr;
    }
    catch (e) {
      return null;
    }

  }
  formtime(txt) {
    try {
      let _t1 = "";
      for (let a = 0; a < txt.split(':').length; a++) {
        if (_t1.length > 0) _t1 = _t1 + ":";
        if (txt.split(':')[a].toString().length == 1) {
          _t1 += "0" + txt.split(':')[a];
        }
        else {
          _t1 += txt.split(':')[a];
        }
      }
      return _t1;
    } catch (e) {

    }
    return txt;
  }
  submitRule() {
    let servicecls = [];
    if (this.ruleobj.servicecls != undefined && this.ruleobj.servicecls != null && this.ruleobj.servicecls != '') {
      if (this.ruleobj.servicecls.includes(',')) {
        servicecls = this.ruleobj.servicecls.split(',');
      } else {
        servicecls[0] = this.ruleobj.servicecls;
      }
    }
    let _starttime = this.formtime(this.starttime.getHours() + ':' + this.starttime.getMinutes() + ':00');
    let _endtime = this.formtime(this.endtime.getHours() + ':' + this.endtime.getMinutes() + ':00');
    try {

    } catch (e) { }
    let _lsegments = [];
    if (this.selectedItemssegment != null && this.selectedItemssegment != undefined && this.selectedItemssegment.length > 0) {
      for (let a = 0; a < this.selectedItemssegment.length; a++)
        _lsegments.push(this.selectedItemssegment[a].id + "");
    }
    let req = {
      "id": this.ruleobj.id,
      "ruleid": this.ruleobj.ruleid,
      "name": this.ruleobj.name,
      "description": this.ruleobj.description,
      "status": this.ruleobj.status,

      "subscribertype": this.ruleobj.subscribertype,
      //"serviceclass": this.selectedItems,
      "serviceclass": servicecls,

      "scheduling": this.ruleobj.scheduling,
      // "startdate": this.startdate,
      // "enddate": this.enddate,
      "startdate": formatDate(this.startdate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''),
      "enddate": formatDate(this.enddate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''),
      "segments": _lsegments,
      "recurring": this.ruleobj.recurring,
      "daysofweek": this.getselecteditems(this.selectedItemsWeek),
      "daysofmonth": this.selectedItemsDays,
      "appversioneligible": this.ruleobj.appversioneligible,
      "specificversions": this.selectedItemsAppVer,
      "targetedos": this.ruleobj.targetedos,
      "androidmin": this.ruleobj.androidmin,
      "androidmax": this.ruleobj.androidmax,
      "iosmin": this.ruleobj.iosmin,
      "iosmax": this.ruleobj.iosmax,
      "starttime": _starttime,
      "endtime": _endtime
      // "created_by": this.comm.getUserId(),
      // "modified_by": this.comm.getUserId()
    };

    if (this.validaterules(req)) {
      let url = "rules/createrules";
      if (this.ruleobj.mode == "update") {
        url = "rules/managerule";
      }
      //console.log(req);
      this.comm.postData(url, req).subscribe((resp: any) => {
        if (resp.code == "200") {
          if (this.mode == 'update') {
            // this.comm.openSnackBar(resp.message);
            this.showconfirm("approve")

          }
          else {
            this.comm.openDialog('success', "Rule Created successfully");
            this.dialogRef.close(resp);
          }
        }
        else {
          this.comm.openDialog('error', resp.message);
          this.dialogRef.close(resp);
        }
      }, (err => {
        console.log(err);
        this.comm.HandleHTTPError(err);
      }));
    }
  }

  validaterules(req) {
    try {

      if (req.ruleid == "") {
        this.comm.openDialog('warning', "Please Enter Rule Title");
        return false;
      }
      // if (req.description == "") {
      //   this.comm.openDialog('warning', "Please Enter Rule Description");
      //   return false;
      // }
      if (req.id == "" && req.status == '0') {
        this.comm.openDialog('warning', "Status Should be Active");
        return false;
      }

    } catch (e) {

    }
    return true;
  }

  getsegments() {
    let start = 1;

    let requesrParams = {
      orderDir: "desc",
      search: "",
      start: start,
      length: 100,
      status: 1
    }
    let _segmentlist = this.comm.getSession("segmentlist");
    if (_segmentlist == null || _segmentlist == undefined || _segmentlist == "" || _segmentlist == "[]") {

      this.comm.postData('files/getuploadedfile', requesrParams).subscribe((response: any) => {
        this.comm.hidehttpspinner();
        if (response.code == "200") {
          if (response && response.filedata && response.filedata) {
            this.segmentlist = (response.filedata);
            this.comm.setSession("segmentlist", JSON.stringify(response.filedata));
          }
        }
      }, (err => {
        console.log(err);
        this.comm.HandleHTTPError(err);
      }));
    }
    else {
      this.segmentlist = JSON.parse(_segmentlist);
    }
  };

  tabChangeEvent(tab) {
    this.selectedtab = tab;
    if (this.selectedtab == 2) {
      //this.getchildnumber();
    }
    else if (this.selectedtab == 1) {
      //this.getdashboard();
    }
    //this.loadReportsdata()
    // else if (this.selectedtab == 3) { this.gettranshistory(); }

  }
  formlistarray(lstdata) {
    let _lstdata = []
    try {

      for (let a = 0; a < lstdata.length; a++) {
        let _tval = lstdata[a];
        if (_tval != "" && _tval.length > 0) {
          if (_tval.indexOf(',') > 0) {
            let _tmpcnt = _tval.split(',');
            for (let b = 0; b < _tmpcnt.length; b++) {
              if (_tmpcnt[b] != null && _tmpcnt[b].length > 0) {
                _lstdata.push(_tmpcnt[b]);
              }
            }
          }
          else {
            _lstdata.push(_tval);
          }
        }
      }
    } catch (e) { }
    return _lstdata;
  }
  showconfirm(reqtype) {
    let _txt = 'Please click "YES" to approve the changes.  ';
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      width: '400px',
      data: {
        message: _txt,
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.approvechanges();
      }
      else {
        this.close();
      }
    });
  }
  approvechanges() {
    var reqrule = {
      ruleid: this.ruleobj.ruleid
    }
    this.comm.postData('rules/approveworkflow', reqrule).subscribe((response: any) => {
      if (response.code == "500") {
        this.comm.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200" && response.status.toLowerCase() == "success") {
        this.comm.openDialog("success", "Approved Successfully");
        this.close();
      }
    }, (err => {
      console.log(err);
      this.comm.HandleHTTPError(err);
    }));
  }

  reject() {
    var reqrule = {
      ruleid: this.ruleobj.ruleid
    }
    this.comm.postData('rules/rejectchanges', reqrule).subscribe((response: any) => {
      if (response.code == "500") {
        this.comm.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200" && response.status.toLowerCase() == "success") {
        this.comm.openDialog("success", "Changes have successfully rejected");
        this.close();
      }
    }, (err => {
      console.log(err);
      this.comm.HandleHTTPError(err);
    }));
  }
}
