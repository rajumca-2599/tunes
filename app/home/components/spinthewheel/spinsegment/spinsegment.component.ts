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
import { retry } from 'rxjs/operators';

@Component({
  selector: 'app-segment',
  templateUrl: './spinsegment.component.html',
  styleUrls: ['./spinsegment.component.css']
})
export class SpinsegmentComponent implements OnInit {
  segmentdesc: string = "";
  displayedColumns: string[] = ["segmentname", "createdon", "approvedon", "msisdncount", "invalidcount", "duplicatecount", "status", "actions"];
  segmentstatuslist: any[] = [{ "id": "-1", "name": "All", "label": "" },
  { "id": "0", "name": "Uploaded", "label": "primary" },
  { "id": "1", "name": "Approved", "label": "info" },
  { "id": "5", "name": "In Process", "label": "warning" },
  { "id": "2", "name": "Active", "label": "default" },
  { "id": "4", "name": "Rejected", "label": "danger" }
  ]
  //{ "id": "3", "name": "Completed", "label": "success" },
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  status: string = "2";
  public isOpen: any = true;
  public isAddOpen: any = false;

  public issingle: any = true;
  public ismulti: any = false;
  selectedsegment: any = {};
  public uploadgtrid: any = "";
  public attriObj: any;
  public searchString: any = "";
  public segmentname: string = "";
  public title: any = "";
  public resetVar: boolean = false;
  public desc: string = "";
  d = new Date();
  year = this.d.getFullYear();
  month = this.d.getMonth();
  day = this.d.getDate();
  uploaddate: Date = new Date(this.year, this.month, this.day, 0, 0, 0);
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
  startdate: any;
  mapdate: any;
  currentdate: Date = new Date();
  minuplod: Date = new Date();
  maxupload: Date = new Date();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //@ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  ngOnInit() {
    //this.dataSource.sort = this.sort;

    this.minuplod =  new Date(this.year, this.month, this.day + 1, 0, 0, 0);
    this.maxupload = new Date(this.year, this.month, this.day + 45, 0, 0, 0)
    
    this.userpermissions = this.ccapi.getpermissions("");
    this.currentdate = new Date();
    this.startdate = [
      new Date(new Date().setDate(this.currentdate.getDate())),
      new Date(new Date().setDate(this.currentdate.getDate() + 7))
    ];

    this.mapdate = [
      new Date(new Date().setDate(this.currentdate.getDate() + 1)),
      new Date(new Date().setDate(this.currentdate.getDate() + 3))
    ];


    this.d.setDate(this.d.getDate() + 1);//Enable for testing
    this.uploaddate.setDate(this.uploaddate.getDate() + 1);// //Enable for testing


    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0;


    this.pageObject.pageNo = 1;

    this.getsegments();
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
      orderDir: "desc", offerdate: formatDate(this.startdate[0], "yyyy-MM-dd", 'en-US', ""),
      startdate: formatDate(this.startdate[0], "yyyy-MM-dd", 'en-US', ""),
      enddate: formatDate(this.startdate[1], "yyyy-MM-dd", 'en-US', ""),
      start: start,
      length: this.pageObject.pageSize, status: this.status
    }
    this.ccapi.postData('spinwheel/getall', requesrParams).toPromise().then((response: any) => {
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
        if (response && response.data && response.data.length > 0) {
          this.dataSource = new MatTableDataSource(response.data);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          // this.dataSource.sort = this.sort;

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
  }
  toggleAdd() {
    this.isAddOpen = !this.isAddOpen;
    this.isOpen = false;
    this.uploadgtrid = ""; this.segmentname = "";
    this.issingle = true;
    this.ismulti = false;
    this.segmentdesc = "";
    this.desc = "";
    this.selectedsegment = {};
    this.afuConfigId = {
      formatsAllowed: ".zip,.csv",
      maxSize: "10",
      theme: "dragNDrop",
      uploadAPI: {
        url: this.ccapi.getUrl("files/uploadFile"),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'accesskey': this.ccapi.getAccessKey(),
          "x-imi-uploadtype": "8"
        }
      }
    };
  }
  toggleCancel() {
    this.isAddOpen = false;
    this.isOpen = true;
  }
  afuConfigId = {
    formatsAllowed: ".zip,.csv",
    maxSize: "10",
    theme: "dragNDrop",
    uploadAPI: {
      url: this.ccapi.getUrl("files/uploadFile"),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'accesskey': this.ccapi.getAccessKey(),
        "x-imi-uploadtype": "8"
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

    let _testdate: Date = new Date(this.year, this.month, this.day, 0, 0, 0);
    ///new Date();
    if (this.uploaddate == null || this.uploaddate == undefined || this.uploaddate < _testdate) {
      this.ccapi.openDialog('warning', 'Offer Date Should be greater than current date'); return false;
    }
    if (!this.ccapi.isvalidtext(this.uploadgtrid, "Upload MSISDN  File")) return;
    if (!this.ccapi.isvalidtext(this.segmentname, "Segment Name is Mandatory")) return;

    var req = {
      "offerdate": formatDate(this.uploaddate, "yyyy-MM-dd", 'en-US', ""),
      "id": this.uploadgtrid,
      segmentname: this.segmentname,
      status: 0,
      segmentid: this.ccapi.trimtext(this.segmentname),
      "description": this.segmentdesc
    }
    this.ccapi.postData("spinwheel/segmentinsert", req).toPromise().then((resp: any) => {
      if (resp.code == "200") {
        this.isOpen = true;
        this.isAddOpen = false;

        this.ccapi.openDialog('success', resp.message);
        this.uploadgtrid = ""; this.segmentname = ""; this.segmentdesc = "";
        this.resetVar = true; this.getsegments();
      }
      else {
        this.ccapi.openDialog('error', resp.message);
      }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });

  }
  getstatus(val) {
    try {
      for (let i = 0; i < this.segmentstatuslist.length; i++) {
        if (this.segmentstatuslist[i].id == val) {
          return this.segmentstatuslist[i].name;
        }
      }
    } catch (e) { }
    return "";
  }
  getStatusLabel(val) {
    try {
      for (let i = 0; i < this.segmentstatuslist.length; i++) {
        if (this.segmentstatuslist[i].id == val) {
          return this.segmentstatuslist[i].label;
        }
      }
    } catch (e) { }
    return "default";
  }

  approve(row, sts) {
    if (row.status != "0") {
      this.ccapi.openDialog('error', "Invalid Status"); return;
    }
    let req = {
      "sid": row.sid, "status": sts
    }
    this.ccapi.postData("spinwheel/segmentupdate", req).toPromise().then((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
        this.getsegments();
      }
      else {
        this.ccapi.openDialog('error', resp.message);
      }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });

  }
  approveconfirm(row, sts) {
    let _txt = "";
    if (sts == "1")
      _txt = "Are you sure. You want to approve segment '" + row.segmentname + "'";
    if (sts == "4")
      _txt = "Are you sure. You want to reject segment '" + row.segmentname + "'.";

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
        this.approve(row, sts);
      }
    });
  }
  downloadfile(row: any) {
    window.open(this.ccapi.getUrl("spinwheel/downloadfile?refid=" + row.uploadid));
    // this.ccapi.openDialog('success', "Downloading..");
  }


  selectitem(row: any) {
    this.selectedsegment = row;
    this.segmentdesc = row.description;
    this.segmentname = row.segmentname;
    this.isOpen = false;
    this.isAddOpen = true;
    this.issingle = false;
    this.ismulti = true;
    let _date = new Date(row.offerdate);
    let _offer_date = new Date(row.offerdate);
    let _mindatecheck = new Date();
    _mindatecheck.setDate(_mindatecheck.getDate() + 1);

    //console.log(_date);
    this.mapdate = [
      new Date(new Date().setDate(new Date().getDate() + 1)),
      new Date(new Date().setDate(new Date().getDate() + 3))
    ];

  
    // this.minuplod = new Date(_offer_date.setDate(_offer_date.getDate() + 1));
  }
  mapsegments() {
    if (this.mapdate == null || this.mapdate == undefined) {
      this.ccapi.openDialog('warning', 'Upload Date Should be greater than current date'); return false;
    }


    var req = {
      startdate: formatDate(this.mapdate[0], "yyyy-MM-dd", 'en-US', ""),
      enddate: formatDate(this.mapdate[1], "yyyy-MM-dd", 'en-US', ""),
      status: 1,
      sid: this.selectedsegment.sid,
      "description": this.segmentdesc
    }
    this.ccapi.postData("spinwheel/addmultisegments", req).toPromise().then((resp: any) => {
      if (resp.code == "200") {
        this.isOpen = true;
        this.isAddOpen = false;
        this.ccapi.openDialog('success', resp.message);
        this.uploadgtrid = ""; this.segmentname = ""; this.selectedsegment = {};
        this.resetVar = true; this.getsegments(); this.segmentdesc = "";
      }
      else {
        this.ccapi.openDialog('error', resp.message);
      }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });

  }

  showconfirm(type) {

    let _testdate: Date = new Date(this.year, this.month, this.day, 0, 0, 0);
    ///new Date();

    if (type == "1") {
      if (this.uploaddate == null || this.uploaddate == undefined || this.uploaddate < _testdate) {
        this.ccapi.openDialog('warning', 'Offer Date Should be greater than current date'); return false;
      }
    }
    if (type == "1") {
      if (!this.ccapi.isvalidtext(this.uploadgtrid, "Upload MSISDN  File")) return;
    }
    if (!this.ccapi.isvalidtext(this.segmentname, "Segment Name is Mandatory")) return;

    let _txt = ''
    if (type == "2") {
      _txt = "Same segment will be uploaded for the selected dates. " + formatDate(this.mapdate[0], "yyyy-MM-dd", 'en-US', "")
        + " / " + formatDate(this.mapdate[1], "yyyy-MM-dd", 'en-US', "") + ". Are you sure you want to proceed."
    }
    else {
      let offerdt = formatDate(this.uploaddate, "yyyy-MM-dd", 'en-US', "");
      _txt = "Segment creation with offer date:" + offerdt + ", segment name:" + this.segmentname + ". Are you sure you want to create.";

    }
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
        if (type == "1")
          this.addsegment();
        else
          this.mapsegments();
      }
    });
  }
  downloadValidateBase(row: any, type: any): void {

    if (this.userpermissions.export == 1)
      window.open(this.ccapi.getUrl("spinwheel/downloadfiles?refid=" + row.sid + "&type=" + type + ""));
    else {
      this.ccapi.openSnackBar("No Permissions to download");
    }
    //this.ccapi.getData("spinwheel/downloadpath?refid=" + row.sid + "&type=" + type).subscribe((resp: any) => {
    //  if (resp.code == "200") {
    //    window.open(resp.filepath, '_blank', '');
    //  }
    //  else {
    //    this.ccapi.openDialog('error', resp.message);
    //  }
    //}, (err => {
    //  console.log(err);
    //}));
  }
  resetdata() {
    this.pageObject.pageNo = 0;
    this.dataSource = new MatTableDataSource([]);
    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0;

  }
}
