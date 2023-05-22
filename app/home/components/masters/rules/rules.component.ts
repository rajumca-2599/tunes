import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
//import { MsgdialogueboxComponent } from '../../../../shared/msgdialoguebox/msgdialoguebox.component';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { AddRuleComponent } from './add-rule/add-rule.component';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
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
  ],
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {

  //displayedColumns: string[] = ["ruleId", "description", "subscriberType", "serviceClass", "targettedOs", "appVersionElgible", "specificversions", "androidmin", "androidmax", "iosmin", "iosmax", "scheduling", "startDate", "endDate", "recurring", "daysOfWeek", "daysOfMonth", "status", "siwfstatus", "actions"];
  displayedColumns = ["ruleId", "description", "subscriberType", "startdate", "enddate", "status", "siwfstatus", "actions"];

  public statuslist: any[] = [{ id: 1, name: "Active" }, { id: 0, name: "Inactive" }];

  segmentlist: any[] = [];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public fstatus: any = 1;
  public ruleObj: any;
  public searchString: any = "";
  masterconfiglist: any;
  noneditrules: any[] = [];
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog) {
    //this.displayedColumns = ["ruleId", "description", "subscriberType", "status", "siwfstatus", "actions"];
  }

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
    this.getrules();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getrules();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getrules();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.masterconfiglist = JSON.parse(this.ccapi.getSession("masterconfig"));
    try {
      this.noneditrules = JSON.parse(this.ccapi.getSession("default_rules_list"));

    } catch (e) { }
    this.pageObject.pageNo = 1;
    this.getsegments();
    this.getrules();
    this.getappversions();
    this.dataSource.sort = this.sort;

  }
  getruleslist() {
    this.paginator.pageIndex = 0;
    this.pageObject.pageNo = 1;
    this.getrules();
  }
  getrules() {
    this.dataSource = new MatTableDataSource([]);
    // this.pageObject.totalRecords = 0;
    // this.pageObject.totalPages = 0; this.dataSource.sort = this.sort;

    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      name: this.searchString,
      start: start,
      length: this.pageObject.pageSize,
      orderDir: "desc",
      status: this.fstatus
    }
    this.ccapi.postData('rules/listrules', requesrParams).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.rules != null && response.rules.length > 0) {
          let _tmpList = response.rules;
          if (this.noneditrules != null && this.noneditrules.length > 0) {
            for (let a = 0; a < _tmpList.length; a++) {
              _tmpList[a].iseditallowed = true;
              if (this.noneditrules.indexOf(_tmpList[a].id + "") != -1) {
                _tmpList[a].iseditallowed = false;
              }
            }
          }

          this.dataSource = new MatTableDataSource(_tmpList);
          if (response.recordsTotal == 0) {
            response.recordsTotal = response.rules.length;
          }
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          this.dataSource.sort = this.sort;

        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0; this.dataSource.sort = this.sort;
          this.ccapi.openSnackBar("No Records Found");
        }
      }
    });
  };

  createRuleDialog(obj: any): void {
    if (obj == null && obj == undefined) {
      this.ruleObj = {
        "id": 0,
        "ruleid": "",
        "subscribertype": 3,
        "serviceclass": [],
        "targetedos": 3,
        "specificversions": [],
        "segments": [],
        "androidmax": "",
        "androidmin": "",
        "iosmax": "",
        "iosmin": "",
        "appversioneligible": 1,
        "scheduling": 1,
        "startdate": "",
        "enddate": "",
        "description": "",
        "recurring": 0,
        "daysofweek": [],
        "daysofmonth": [],
        // "created_by": "",
        // "modified_by": "",
        // "created_at": "",
        // "modified_at": "",
        "status": 1,
        "mode": "insert",
        "name": "", "siwfstatus": 0
      }
      const dialogRef = this.dialog.open(AddRuleComponent, {
        width: '1200px',
        height: '1000px',
        data: this.ruleObj,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.getrules();
        }
        console.log('The dialog was closed');
      });
    }
    else {
      this.ruleObj = {
        "id": obj.id,
        "ruleid": obj.ruleid,
        "subscribertype": obj.subscribertype,
        "serviceclass": obj.serviceclass,
        "targetedos": obj.targetedos,
        "specificversions": obj.specificversions,
        "androidmax": obj.androidmax,
        "androidmin": obj.androidmin,
        "iosmax": obj.iosmax,
        "iosmin": obj.iosmin,
        "appversioneligible": obj.appversioneligible,
        "scheduling": obj.scheduling,
        "startdate": obj.startdate,
        "enddate": obj.enddate,
        "description": obj.description,
        "recurring": obj.recurring,
        "daysofweek": obj.daysofweek,
        "daysofmonth": obj.daysofmonth,
        "starttime": obj.starttime,
        "endtime": obj.endtime,
        "segments": obj.segments,
        // "created_by": obj.created_by,
        // "modified_by": obj.modified_by,
        // "created_at": obj.created_at,
        // "modified_at": obj.modified_at,
        "status": obj.status + "",
        "mode": "update",

      }

      const dialogRef = this.dialog.open(AddRuleComponent, {
        width: '1200px',
        height: '1000px',
        data: this.ruleObj,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {

        this.getrules();

        console.log('The dialog was closed');
      });
    }
  }

  deleteRule(obj: any): void {
    var id = obj.ruleid;


    if (id != undefined) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        width: '400px',
        data: {
          message: 'Are you sure want to delete rule (' + obj.description + ')?',
          confirmText: 'Yes',
          cancelText: 'No'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          let _test = JSON.parse(JSON.stringify(obj));
          try {
            if (_test.serviceclass.length == 1 && _test.serviceclass[0] == "") {
              _test.serviceclass = [];
            }
            if (_test.segments.length == 1 && _test.segments[0] == "") {
              _test.segments = [];
            }

            if (_test.daysofweek.length == 1 && _test.daysofweek[0] == "") {
              _test.daysofweek = [];
            }

            if (_test.daysofmonth.length == 1 && _test.daysofmonth[0] == "") {
              _test.daysofmonth = [];
            }
            if (_test.specificversions.length == 1 && _test.specificversions[0] == "") {
              _test.specificversions = [];
            }
          } catch (e) { }
          let req = {
            "id": _test.id,
            "ruleid": _test.ruleid,
            "description": _test.description,
            "status": 2,
            "subscribertype": _test.subscribertype,
            "serviceclass": _test.serviceclass,
            "scheduling": _test.scheduling,
            "startdate": _test.startdate,
            "enddate": _test.enddate,
            "segments": _test.segments,
            "recurring": _test.recurring,
            "daysofweek": _test.daysofweek,
            "daysofmonth": _test.daysofmonth,
            "appversioneligible": _test.appversioneligible,
            "specificversions": _test.specificversions,
            "targetedos": _test.targetedos,
            "androidmin": _test.androidmin,
            "androidmax": _test.androidmax,
            "iosmin": _test.iosmin,
            "iosmax": _test.iosmax,
            "starttime": _test.starttime,
            "endtime": _test.endtime
          }

          this.ccapi.postData("rules/managerule", req).subscribe((resp: any) => {
            if (resp.code == "200") {
              this.ccapi.openDialog('success', 'Rule has been sent for approval');
              this.getrules();
            }
            else {
              this.ccapi.openDialog('warning', resp.message);
            }
          });
        }
      });
    }
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  loadSubscribertype(item) {
    let subcribertypes: any[] = [{ id: "0", name: "All" }, { id: "1", name: "PREPAID" }, { id: "2", name: "POSTPAID" }, { id: "3", name: "BOTH" }];
    let result = "";
    for (let i = 0; i < subcribertypes.length; i++) {
      if (item == subcribertypes[i].id)
        result = subcribertypes[i].name;
    }
    return result;
  }
  loadTargetOs(item) {
    if (item == '1')
      return 'iOS';
    else if (item == '2')
      return 'Android';
    else
      return 'iOS,Android';
  }
  loadAppVerEligible(item) {
    if (item == '1')
      return 'True';
    else
      return 'False';
  }
  getstatustext(id) {
    // if (id == null || id == undefined || id == "") return "Active";
    if (id == "1") return "Active";
    else return "Inactive";
  }
  getwfstatus(id) {
    // if (id == null || id == undefined || id == "") return "Live";
    if (id == "0") return "Live";
    else
      return "Pending";
  }
  getsegments() {
    let start = 1;

    let requesrParams = {
      orderDir: "desc",
      search: "",
      start: start,
      length: 100, status: 2
    }
    let _segmentlist = null;//this.ccapi.getSession("segmentlist");
    if (_segmentlist == null || _segmentlist == undefined || _segmentlist == "") {

      this.ccapi.postData('files/getuploadedfile', requesrParams).subscribe((response: any) => {
        this.ccapi.hidehttpspinner();
        if (response.code == "200") {
          if (response && response.filedata && response.filedata) {
            this.segmentlist = (response.filedata);
            this.ccapi.setSession("segmentlist", JSON.stringify(response.filedata));
          }
        }
      }, (err => {
        console.log(err);
        this.ccapi.HandleHTTPError(err);
      }));
    }
    else {
      this.segmentlist = JSON.parse(_segmentlist);
    }
  };

  getappversions() {

    let requesrParams = {
      search: ("APP_VERSIONS_LIST"),
      filterBy: "",
      start: 1,
      length: 2,
      orderDir: "desc"
    }
    this.ccapi.postData('globalsettings/getall', requesrParams).toPromise().then((response: any) => {
      if (response.code == "200") {
        if (response && response.data) {
          if (response.data[0] != null && response.data[0].value.length > 0) {
            let _appvers = response.data[0].value.split(',');
            this.ccapi.setSession("appversionlist", JSON.stringify(_appvers));
          }
          else {
            this.ccapi.setSession("appversionlist", JSON.stringify(this.masterconfiglist.appversions));
          }
        }
        else {
          this.ccapi.setSession("appversionlist", JSON.stringify(this.masterconfiglist.appversions));
        }
      }
    }).catch((error) => {
      this.ccapi.HandleHTTPError(error);
    });
  }


}

