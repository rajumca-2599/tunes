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
import { HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'app-apprating',
  templateUrl: './apprating.component.html',
  styleUrls: ['./apprating.component.css']
})
export class AppratingComponent implements OnInit {

  displayedColumns: string[] = ["author_name", "user_comment", "rating", "createdOn", "replyText", "replyUpdatedTime",
    "appVersionName",
    "device", "actions"];

  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  status: string = "1";

  public isOpen: any = true;
  public isAddOpen: any = false;
  public offertype: any = "1";

  public title: any = "";
  public resetVar: boolean = false;

  d = new Date();
  year = this.d.getFullYear();
  month = this.d.getMonth();
  day = this.d.getDate();
  masterconfiglist: any;
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  replytext: any = "";
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog) {
    this.masterconfiglist = JSON.parse(this.ccapi.getSession("masterconfig"));

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
    this.getRatings();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getRatings();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getRatings();
  }
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //@ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  ngOnInit() {
    this.d = new Date(this.year, this.month, this.day, 0, 0, 0);
    this.userpermissions = this.ccapi.getpermissions("");
    this.offertype = "1";

    this.d.setDate(this.d.getDate());

    this.dataSource = new MatTableDataSource([]);


    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0;


    this.pageObject.pageNo = 1;
    this.FetchToken();
    this.getRatings();
  }


  toggle() {
    this.isOpen = true;
    this.isAddOpen = false;
    if (this.isOpen) this.getRatings();
  }
  toggleAdd() {
    this.isAddOpen = !this.isAddOpen;
    this.isOpen = false;

  }
  toggleCancel() {
    this.isAddOpen = false;
    this.isOpen = true;
    this.replytext = "";

  }
  getRatings() {

    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {}

    this.ccapi.postData('reviews/all', requesrParams).toPromise().then((response: any) => {
      this.ccapi.hidehttpspinner();
      if (response.code == "500") {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;

        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.data && response.data.length > 0) {
          let _list = response.data;
          this.dataSource = new MatTableDataSource(_list);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.ccapi.openSnackBar("No Records Found");
        }
      }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
  };



  Refresh() {

    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {}
    let url = "reviews/getreviewsbytoken?code=" + this.ccapi.getSession("apprating_token");
    this.ccapi.getData(url).toPromise().then((response: any) => {
      this.ccapi.hidehttpspinner();
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        this.ccapi.openDialog("success", "Refreshed Successfully");
        this.getRatings();
      }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
  };



  FetchToken() {

    let requesrParams = {}
    var _accesstoken = this.ccapi.getSession("apprating_token");
    if (_accesstoken == null || _accesstoken.length < 20) {
      this.ccapi.getData('reviews/gettokenstatus?refreshToken=' + this.masterconfiglist.REFRESH_TOKEN).toPromise().then((response: any) => {
        if (response.code == "500") {
        }
        else if (response.code == "200") {
          this.ccapi.setSession("apprating_token", response.accessToken);
        }
      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    }

  }
  selecteditem: any;
  selectcomment(row) {
    this.selecteditem = row;
    this.isAddOpen = true;
    this.replytext="";
  }

  Reply() {

    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {}
    let hrdslist = [{
      key: "reviewId", value: this.selecteditem.review_id
    },
    {
      key: "replyText", value: this.replytext
    }
    ]
    this.ccapi.postDataNoLoaderHeaders('reviews/reply?accessToken=' + this.ccapi.getSession("apprating_token"), requesrParams, hrdslist).toPromise().then((response: any) => {
      this.ccapi.hidehttpspinner();
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        this.ccapi.openDialog("success", "Reply Successfully Posted");
        this.replytext = "";
        this.getRatings();
        this.toggleCancel();
      }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
  }
  showconfirm() {
    let _txt = 'Please click "YES"  reply on the Comment';

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
        this.Reply()
      }
      else {
        this.toggleCancel();
      }
    });
  }
}
