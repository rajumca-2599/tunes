import { Component, OnInit, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { MatSort } from '@angular/material/sort';

import { AddBannergroupComponent } from './add-bannergroup/add-bannergroup.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-bannergroup',
  templateUrl: './bannergroup.component.html',
  styleUrls: ['./bannergroup.component.css'],
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
})
export class BannergroupComponent implements OnInit, OnDestroy {
  userpermissions: any = this.ccapi.getpermissions("");
  displayedColumns: string[] = ["bannergroupid", "title", "name", "bannerType", "startDate", "endDate", "status", "wfstatus", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public bannerGrpObj: any;
  public searchString: any = "";
  public listData: any;
  public fbannertype: string = "";
  public fstatus: string = "";
  public bannertypes: any = [];
  private _dialog1: Subscription;
  private _dialog2: Subscription;
  private _httpobj1: Subscription;
  private _httpobj2: Subscription;
  private _httpobj3: Subscription;
  private _httpobj4: Subscription;

  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog) {
    this.bannertypes = [{ id: "0", text: "All" }, { id: "1", text: "Card" }, { id: "2", text: "Full" }, { id: "3", text: "Top Banner" }];
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
    this.getBannerGroups();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getBannerGroups();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getBannerGroups();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.fbannertype = "0";
    this.fstatus = "1";
    this.pageObject.pageNo = 1;
    this.getBannerGroups();
    this.dataSource.sort = this.sort;
  }
  getStatus(status: any): string {
    if (status == "1") {
      return "Active";
    } else {
      return "Inactive";
    }
  };
  getwfstatus(id) {
    if (id == "0")
      return "Live";
    else
      return "Pending";
  }
  getBannerType(bt: any): string {
    var chkbtypes = this.bannertypes.filter(function (element, index) {
      return (element.id == bt);
    });
    if (chkbtypes.length > 0) {
      return chkbtypes[0].text;
    }
    return "";
  };
  getBannerGroupsList() {
    this.paginator.pageIndex = 0;
    this.pageObject.pageNo = 1;
    this.getBannerGroups();
  }
  getBannerGroups() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      bannerType: parseInt(this.fbannertype),
      search: this.searchString,
      status: parseInt(this.fstatus),
      start: start,
      length: this.pageObject.pageSize,
      orderDir: "desc"
    }
    
    this._httpobj1 = this.ccapi.postData('banners/getbannergroups', requesrParams).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.data != null && response.data.length > 0) {
          this.dataSource = new MatTableDataSource(response.data);
          this.pageObject.totalRecords = response.recordsTotal;
          if (response.recordsTotal == 0) {
            this.pageObject.totalRecords = response.data.length;
          }
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
      else {

      }
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));

  };
  createBannerGroup(obj: any): void {
    if (obj == null && obj == undefined) {
      this.bannerGrpObj = {
        id: "",
        name: "",
        desc: "",
        startdate: "",
        enddate: "",
        status: 1,
        bannertype: "1",
        banners: [],
        mode: "insert"
      }
      const dialogRef = this.dialog.open(AddBannergroupComponent, {
        width: '1100px',
        height: '700px',
        data: this.bannerGrpObj
      });
      this._dialog1 = dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.getBannerGroups();
        }
        console.log('The dialog was closed');
      });
    }
    else {
      this.bannerGrpObj = {
        id: obj.bannergroupid,
        name: obj.name,
        title: obj.title,
        desc: obj.description,
        startdate: obj.startDate,
        enddate: obj.endDate,
        status: obj.status.toString(),
        bannertype: obj.bannerType,
        banners: [],
        mode: "update"
      }
    
      const dialogRef = this.dialog.open(AddBannergroupComponent, {
        width: '1100px',
        height: '700px',
        data: this.bannerGrpObj
      });
      this._dialog2 = dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.getBannerGroups();
        }
        console.log('The dialog was closed');
      });
    }
  }
  ManageBannerGroup(id) {
    this.router.navigate(['home/managebanners/' + id]);
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }

  ngOnDestroy() {
    console.log("destroypostdata");
    if (this._httpobj1 != null && this._httpobj1 != undefined)
      this._httpobj1.unsubscribe();
    if (this._httpobj2 != null && this._httpobj2 != undefined)
      this._httpobj2.unsubscribe();

    if (this._httpobj3 != null && this._httpobj3 != undefined)
      this._httpobj3.unsubscribe();
    if (this._httpobj4 != null && this._httpobj4 != undefined)
      this._httpobj4.unsubscribe();


    if (this._dialog1 != null && this._dialog1 != undefined)
      this._dialog1.unsubscribe();
    if (this._dialog2 != null && this._dialog2 != undefined)
      this._dialog2.unsubscribe();
  }

  refreshmsgs() {
    let requesrParams = {};
    this._httpobj1 = this.ccapi.postData('banners/generatedata', requesrParams).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        this.ccapi.openDialog("success", response.message);
      }
      else {
        this.ccapi.openDialog("warning", "Unable to process your requests");
      }
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));
  };
}


