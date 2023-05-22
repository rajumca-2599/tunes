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

@Component({
  selector: 'app-segments',
  templateUrl: './segments.component.html',
  styleUrls: ['./segments.component.css']
})
export class SegmentsComponent implements OnInit {

  displayedColumns: string[] = ["name", "createdon", "updatedon", "status", "successcount", "failedcount"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public isAddOpen: any = false;
  public uploadgtrid: any = "";
  public attriObj: any;
  public searchString: any = "";
  public fstatus: string = "-1";
  public title: any = "";
  public resetVar: boolean = false;
  public segment_max_limit: number = 10;
  public Isseg_limit_reached: boolean = false;
  public segmentstatuslist: any[] = [{ "id": "-1", "name": "All", "label": "" }, { "id": "0", "name": "Uploaded", "label": "primary" }, { "id": "1", "name": "Approved", "label": "info" },
  { "id": "2", "name": "Profile Updated", "label": "default" }, { "id": "4", "name": "Rejected", "label": "danger" }, { "id": "5", "name": "In Process", "label": "warning" }]
  //{ "id": "3", "name": "Completed", "label": "success" },
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog) {


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
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.fstatus = "-1";
    this.segment_max_limit = 40;
    this.CheckSegmentMaxLimitation();
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.sort = this.sort;

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
      orderDir: "desc",
      search: this.searchString,
      start: start,
      length: this.pageObject.pageSize,
      status: this.fstatus
      // ordercolumn: this.orderByObject.ordercolumn
    }
    this.Isseg_limit_reached = false;
    this.ccapi.postData('files/getuploadedfile', requesrParams).subscribe((response: any) => {
      this.ccapi.hidehttpspinner();
      if (response.code == "500") {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        this.dataSource.sort = this.sort;
        this.Isseg_limit_reached = false;
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response.filedata != null && response.filedata.length > 0) {
          let arr = response.filedata;
          for (let a = 0; a < arr.length; a++) {
            if (this.ccapi.trimtext(arr[a].filename) == "") arr[a].filename = "Segment_" + a;
            arr[a].filename = this.ccapi.trimtext(arr[a].filename);
          }
          this.dataSource = new MatTableDataSource(arr);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          this.dataSource.sort = this.sort;
          //check msisdn sement max limitations
          if (this.pageObject.totalRecords >= this.segment_max_limit) {
            this.Isseg_limit_reached = true;
          }
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.dataSource.sort = this.sort;
          this.Isseg_limit_reached = false;
          this.ccapi.openSnackBar("No Records Found");
        }
      }
    }, (err => {
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));
  };

  toggle() {
    this.isOpen = !this.isOpen;
    this.isAddOpen = false;
  }
  toggleAdd() {
    this.isAddOpen = !this.isAddOpen
    this.isOpen = false;
    this.afuConfigId = {
      formatsAllowed: ".zip",
      maxSize: "0.1", theme: "dragNDrop",
      uploadAPI: {
        url: this.ccapi.getUrl("files/uploadFile"),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'accesskey': this.ccapi.getAccessKey(),
          "x-imi-uploadtype": "3"
        }
      }
    };
  }
  toggleCancel() {
    this.isAddOpen = false;
    this.isOpen = true;
    this.title = "";
  }
  afuConfigId = {
    formatsAllowed: ".zip",
    maxSize: "0.1",
    theme: "dragNDrop",
    uploadAPI: {
      url: this.ccapi.getUrl("files/uploadFile"),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'accesskey': this.ccapi.getAccessKey(),
        "x-imi-uploadtype": "3"
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
    if (this.pageObject.totalRecords >= this.segment_max_limit) {
      this.ccapi.openDialog('warning', 'MSISDN segments max limitation is reached.'); return false;
    }
    if (this.title == null || this.title == undefined || this.title.length < 2) {
      this.ccapi.openDialog('warning', 'Title is Mandatory'); return false;
    }
    if (this.uploadgtrid == null || this.uploadgtrid == undefined || this.uploadgtrid.length < 2) {
      this.ccapi.openDialog('warning', 'Upload MSISDN Zip File'); return false;
    }

    if (!this.ccapi.isvalidtext(this.title, "Title is Mandatory")) return false;


    if (!this.ccapi.isvalidtext(this.uploadgtrid, "Upload MSISDN Zip File")) return false;


    var req = {
      "name": this.title, "uploadid": this.uploadgtrid, status: 1
    }
    this.ccapi.postData("rules/createsegemets", req).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
        this.uploadgtrid = ""; this.title = "";
        this.resetVar = true; this.getsegments(); this.toggle();
      }
      else {
        this.ccapi.openDialog('error', resp.message);
      }
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));

  }
  CheckSegmentMaxLimitation() {
    let requesrParams = {
      search: "SEGMENT_MAX_LIMIT",
      filterBy: "",
      start: "1",
      length: "10",
      orderDir: "desc"
    }
    this.ccapi.postData('globalsettings/getall', requesrParams).subscribe((response: any) => {
      console.log(response);
      if (response.code == "200") {
        if (response && response.data && response.data.length > 0) {
          if (response.data[0].value != undefined && response.data[0].value != "") {
            this.segment_max_limit = response.data[0].value;
          }
        }
      }
    });
  }

}
