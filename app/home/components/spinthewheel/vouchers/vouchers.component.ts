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
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.css']
})
export class VouchersComponent implements OnInit {

  displayedColumns: string[] = ["sid", "partnerid", "createdon", "vouchercount", "duplicate", "invalid", "uploadedby", "status", "remarks"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public isAddOpen: any = false;
  public uploadgtrid: any = "";
  public attriObj: any;
  public searchString: any = "";
  public title: any = "";
  public resetVar: boolean = false;
  partnerid: any = 100;
  partnerList: any = [];
  private _httpobj1: Subscription;
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog) {


  }
  d = new Date();
  year = this.d.getFullYear();
  month = this.d.getMonth();
  day = this.d.getDate();
  //startdate: Date = new Date(this.year, this.month, this.day + 1, 0, 0, 0);
  startdate: Date = new Date();
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
    this.getsegments();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getsegments();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getsegments();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //@ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }


  status: any = -1;

  ngOnInit() {
    this.userpermissions = this.ccapi.getpermissions("");
    this.dataSource = new MatTableDataSource([]);
    //this.dataSource.sort = this.sort;
    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0;
    this.pageObject.pageNo = 1;
    this.loadpartnerlist();
    this.getsegments();
  }

  loadpartnerlist() {
    try {
      this.partnerList = JSON.parse(this.ccapi.getSession("masterconfig")).voucherspartners;
      if (this.partnerList.length > 0) {
        this.partnerid = this.partnerList[0].partnerid;
      }
    } catch (e) { }
    // this._httpobj1 = this.ccapi.getJSON("assets/json/partnerList.json").subscribe((resp: any) => {
    //   this.partnerList = resp;
    //   if(this.partnerList.length>0){
    //     this.partnerid = this.partnerList[0].partnerid;
    //   }
    // }, err => {
    //   console.log(err);
    // });

  }

  getpartner(id: any): string {
    let str = "";
    for (let i = 0; i < this.partnerList.length; i++) {
      if (this.partnerList[i].partnerid == id) {
        str = this.partnerList[i].partnername;
        break;
      }
    }
    return str;
  }
  getsegmentsList() {
    this.paginator.pageIndex = 0;
    this.pageObject.pageNo = 1;
    this.getsegments();
  }

  getsegments() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;

    let requesrParams = {
      orderDir: "desc",
      partnerid: this.partnerid,
      start: start,
      length: this.pageObject.pageSize,
      status: this.status
      // ordercolumn: this.orderByObject.ordercolumn
    }
    this.ccapi.postData('spinwheel/getvouchers', requesrParams).subscribe((response: any) => {
      this.ccapi.hidehttpspinner();
      if (response.code == "500") {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        //this.dataSource.sort = this.sort;

        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.data) {
          this.dataSource = new MatTableDataSource(response.data);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          //this.dataSource.sort = this.sort;

        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          //this.dataSource.sort = this.sort;
          this.ccapi.openDialog("warning", "No Data Found");
        }
      }
    }, (err => {
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));
  };

  getStatus(status: any): string {
    //0 - file uploaded successfully,
    //1 - in process by offline file processor,
    //2 - vouchers added in master successfully,
    //3 - Failure with description
    if (status == "0") {
      return "Uploaded";
    }
    else if (status == "1") {
      return "In Process";
    }
    else if (status == "2") {
      return "Processed";
    }
    else if (status == "3") {
      return "Failed";
    }
    else {
      return "";
    }
  };

  toggle() {
    this.isOpen = !this.isOpen;
    this.isAddOpen = false;
    //this.isAddOpen = !this.isAddOpen;
  }
  toggleAdd() {
    this.isAddOpen = !this.isAddOpen;
    this.isOpen = false;
    //this.isOpen = !this.isOpen;
  }
  toggleCancel() {
    this.isAddOpen = false;
    this.isOpen = true;
  }
  afuConfigId = {
    formatsAllowed: ".zip, .csv",
    maxSize: "10",
    theme: "dragNDrop",
    uploadAPI: {
      url: this.ccapi.getUrl("files/uploadFile"),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'accesskey': this.ccapi.getAccessKey(),
        "x-imi-uploadtype": "9"
      }
    }
  };
  DocUpload(e) {
    let res = e.response;
    let result = JSON.parse(res);
    if (result != null && result.code == "200") {
      this.uploadgtrid = result.gtrId;
    }
    else {
      if (result != null && result.message != null)
        this.ccapi.openDialog("warning", result.message);
      else {
        this.ccapi.openDialog("warning", "Unable to upload file.");
      }
    }
  }
  addsegment() {
    if (this.uploadgtrid == null || this.uploadgtrid == undefined || this.uploadgtrid.length < 2) {
      this.ccapi.openDialog('warning', 'Upload Voucher Zip File'); return false;
    }
    var req = {
      "offerdate": this.startdate,
      "partnerid": this.partnerid,
      "status": 0,
      "flag": "0",
      "id": this.uploadgtrid
    }
    this.ccapi.postData("spinwheel/insertvoucher", req).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
        this.uploadgtrid = "";
        this.isAddOpen = false;
        this.isOpen = true;
        this.getsegments();
      }
      else {
        this.ccapi.openDialog('error', resp.message);
      }
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));

  }
  downloadVouchers(row: any): void {
    if (this.userpermissions.export == 1)
      window.open(this.ccapi.getUrl("spinwheel/downloadvoucher?id=" + row.sid));
    else {
      this.ccapi.openSnackBar("No Permissions to download");
    }
    //this.ccapi.postData("spinwheel/downloadfiles", { "refid": row.sid }).toPromise().then((resp: any) => {
    //  console.log(resp);
    //  if (resp.code == "200") {
    //    window.open(resp.data, '_blank', '');
    //  }
    //  else {
    //    this.ccapi.openDialog('error', resp.message);
    //  }
    //}).catch((error: HttpErrorResponse) => {
    //  this.ccapi.HandleHTTPError(error);
    //});
  }
}
