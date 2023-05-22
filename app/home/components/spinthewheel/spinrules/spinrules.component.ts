import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-spinrules',
  templateUrl: './spinrules.component.html',
  styleUrls: ['./spinrules.component.css']
})
export class SpinrulesComponent implements OnInit {
  public statuslist: any[] = [{ id: "1", name: "Active" }, { id: "0", name: "Inactive" }];
  searchtext: string = "";
  displayedColumns: string[] = ["offerdate", "offertype", "segmentid", "refid", "status", "actions"];
  packageslist: any = [];
  offertypelist: any[] = [{ "id": "1", "name": "DATA" }, { "id": "2", "name": "VOICE" },
  { "id": "3", "name": "COMBO" }, { "id": "4", "name": "PULSA" }, { "id": "5", "name": "MIX" }, { "id": "6", "name": "VOUCHERS" }]
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  status: string = "1";
  segmentselected: string = "";
  packselected: string = "";
  public isOpen: any = true;
  public isAddOpen: any = false;
  public offertype: any = "1";

  public attriObj: any;
  public searchString: any = "";
  public title: any = "";
  public resetVar: boolean = false;
  segmentslist: any[] = [];
  d = new Date();
  year = this.d.getFullYear();
  month = this.d.getMonth();
  day = this.d.getDate();
  ruledate: Date = new Date(this.year, this.month, this.day, 0, 0, 0);
  offerdate: Date = new Date(this.year, this.month, this.day, 0, 0, 0);
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog) {
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
  //@ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  minuplod: Date;
  maxupload: Date;
  ngOnInit() {
    this.minuplod = new Date(this.year, this.month, this.day - 45, 0, 0, 0);
    this.maxupload = new Date(this.year, this.month, this.day + 45, 0, 0, 0)
    this.d = new Date(this.year, this.month, this.day, 0, 0, 0);
    this.userpermissions = this.ccapi.getpermissions("");
    this.offertype = "1";
    this.segmentselected = "";
    this.packageslist = [];
    this.packselected = "";
    // this.d.setDate(this.d.getDate());
    this.d.setDate(this.d.getDate() + 1);
    this.ruledate.setDate(this.ruledate.getDate() + 1);
    this.dataSource = new MatTableDataSource([]);
    // this.dataSource.sort = this.sort;

    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0;


    this.pageObject.pageNo = 1;

    this.getrules();
    // this.getsegments();
    // this.getpackages();
    // this.ccapi.getspinthewheeldashboard();
  }
  getrulesList() {
    this.paginator.pageIndex = 0;
    this.pageObject.pageNo = 1;
    this.getrules();
  }
  getrules() {
    // this.segmentslist = [];
    //this.packageslist = [];
    this.segmentselected = "";
    this.packselected = "";
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      orderDir: "desc", offerdate: formatDate(this.offerdate, "yyyy-MM-dd", 'en-US', ""),
      start: start,
      length: this.pageObject.pageSize, status: this.status
    }
    this.ccapi.postData('spinwheel/getallrules', requesrParams).toPromise().then((response: any) => {
      this.ccapi.hidehttpspinner();
      if (response.code == "500") {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        //   this.dataSource.sort = this.sort;

        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.data && response.data.length > 0) {
          let _list = response.data;
          try {
            for (let i = 0; i < _list.length; i++) {
              let _ofdate = new Date(_list[i].offerdate.split(' ')[0]);
              if (_ofdate > this.d) {
                _list[i].allowedit = true;
              }
              else {
                _list[i].allowedit = false;
              }
            }
          } catch (e) { }
          this.dataSource = new MatTableDataSource(_list);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          //this.dataSource.sort = this.sort;

        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          //this.dataSource.sort = this.sort;
          this.ccapi.openSnackBar("No Records Found");
        }
      }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
  };

  toggle() {
    this.isOpen = !this.isOpen;
    this.isAddOpen = false;
    this.packselected = "";
    this.segmentselected = "";
  }
  toggleAdd() {
    this.isAddOpen = !this.isAddOpen;
    this.isOpen = false;
    this.packselected = "";
    this.segmentselected = "";
    if (this.isAddOpen) {
      this.getsegments();
      this.offertype = "1";
      this.getpackages();
    }
  }
  toggleCancel() {
    this.isAddOpen = false;
    this.isOpen = true;
    this.packselected = "";
    this.segmentselected = "";
  }

  addrule() {
    let _testdate: Date = new Date(this.year, this.month, this.day, 0, 0, 0);

    if (this.ruledate == null || this.ruledate == undefined || this.ruledate < _testdate) {
      this.ccapi.openDialog('warning', 'Offer Date Should be greater than current date'); return false;
    }

    if (this.segmentselected == null || this.segmentselected == undefined || this.segmentselected == "") {
      this.ccapi.openDialog('warning', 'Select Segment'); return false;
    }

    if (this.packselected == null || this.packselected == undefined || this.packselected == "") {
      this.ccapi.openDialog('warning', 'Select Product'); return false;
    }

    var req = {
      "offerdate": formatDate(this.ruledate, "yyyy-MM-dd", 'en-US', ""), "segmentid": this.segmentselected,
      offertype: this.offertype, offerrefid: this.packselected,
      status: 1
    }
    this.ccapi.postData("spinwheel/insertrule", req).toPromise().then((resp: any) => {
      if (resp.code == "200") {
        this.isOpen = true;
        this.isAddOpen = false;
        this.ccapi.openDialog('success', resp.message);
        this.resetVar = true; this.getrules();
      }
      else {
        this.ccapi.openDialog('error', resp.message);
      }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
  }
  getstatus(id) {
    if (id == null || id == undefined) return "Active";
    if (id == "1") return "Active";
    else if (id == "0") return "Inactive";
  }



  getsegments() {
    this.segmentslist = [];
    this.segmentselected = "";
    let start = 1;
    let requesrParams = {
      orderDir: "desc",
      offerdate: formatDate(this.ruledate, "yyyy-MM-dd", 'en-US', ""),
      startdate: formatDate(this.ruledate, "yyyy-MM-dd", 'en-US', ""),
      enddate: formatDate(this.ruledate, "yyyy-MM-dd", 'en-US', ""),
      start: start,
      length: 100, status: 2
    }
    let _tlist = null;/// this.ccapi.getSession("segmentlist_" + requesrParams.offerdate);
    if (_tlist != null && _tlist != undefined && _tlist.length > 10) {
      this.segmentslist = JSON.parse(_tlist);
    }
    else {
      this.ccapi.postData('spinwheel/getall', requesrParams).toPromise().then((response: any) => {
        this.ccapi.hidehttpspinner();
        if (response.code == "500") {
          this.ccapi.openDialog("warning", response.message);
          return;
        }
        else if (response.code == "200") {
          if (response.data != null && response.data.length > 0) {
            this.segmentslist = response.data;
            // this.ccapi.setSession("segmentlist_" + requesrParams.offerdate, JSON.stringify(this.segmentslist));
          }
          else {
            this.ccapi.openDialog("warning", "No segments found for " + formatDate(this.ruledate, "yyyy-MM-dd", 'en-US', ""));
          }
        }
      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
  };


  getpackages() {
    this.packageslist = [];
    this.packselected = "";
    let start = 1;
    let requesrParams = {
      orderDir: "desc",
      start: start, catagory: 2, category: 2,
      length: 100, status: 1, offertype: this.offertype, search: this.searchtext, flag: "1"
    }
    let _tlist = null;// this.ccapi.getSession("packoffers_" + this.offertype);
    if (_tlist != null && _tlist != undefined && _tlist.length > 10) {
      this.packageslist = JSON.parse(_tlist);
    }
    else {
      this.ccapi.postData('spinwheel/getmasterpacks', requesrParams).toPromise().then((response: any) => {
        this.ccapi.hidehttpspinner();
        if (response.code == "500") {
          this.ccapi.openDialog("warning", response.message);
          return;
        }
        else if (response.code == "200") {
          if (response.data != null && response.data.length > 0) {
            this.packageslist = response.data;
            this.ccapi.setSession("packoffers_" + this.offertype, JSON.stringify(this.packageslist));
          }
          else {
            this.ccapi.openDialog("warning", "No packages found ");
          }
        }
      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }
  };

  approveconfirm(row, sts) {
    let _txt = 'Please click "YES" to deactivate the rule.'
    if (sts == 1)
      _txt = 'Please click "YES" to activate the rule.'
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
        this.updaterule(row, sts);
      }
    });
  }


  updaterule(row, sts) {

    var req = {
      id: row.id,
      status: sts
    }
    this.ccapi.postData("spinwheel/updaterule", req).toPromise().then((resp: any) => {
      if (resp.code == "200") {
        this.isOpen = true;
        this.isAddOpen = false;
        this.ccapi.openDialog('success', resp.message);
        this.resetVar = true; this.getrules();
      }
      else {
        this.ccapi.openDialog('error', resp.message);
      }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
  }
  getoffertype(val) {
    try {
      let _tmp = this.offertypelist.filter(function (ele, id) {
        return ele.id == val;
      })
      if (_tmp != null && _tmp.length > 0) {
        return _tmp[0].name;
      }

    } catch (e) {

    }
    return "";
  }
}
