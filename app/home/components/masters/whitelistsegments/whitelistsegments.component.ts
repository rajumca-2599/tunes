//Added for #Jira id:DIGITAL-3211
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { CommonService } from '../../../../shared/services/common.service';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-whitelistsegments',
  templateUrl: './whitelistsegments.component.html',
  styleUrls: ['./whitelistsegments.component.css']
})
export class WhitelistsegmentsComponent implements OnInit {

  displayedColumns: string[] = ["name", "createdon", "updatedon", "status", "successcount", "failedcount","duplicatecount","invalidcount", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public isAddOpen: any = false;
  public uploadgtrid: any = "";
  public attriObj: any;
  public searchString: any = "";
  public segmentStatus: string = "-1";
  public title: any = "";
  public resetVar: boolean = false;
  startdate: any;
  currentdate: Date = new Date();
  maxupload: Date = new Date();
  minupload: Date = new Date();
  d = new Date();
  year = this.d.getFullYear();
  month = this.d.getMonth();
  day = this.d.getDate();
  public segment_max_limit: number = 10;
  public Isseg_limit_reached: boolean = false;
  public segmentstatuslist: any[] = [
    { "id": "-1", "name": "All", "label": "" },
    { "id": "1", "name": "Uploaded", "label": "warning" },
    { "id": "5", "name": "In-Progress", "label": "warning" },
    { "id": "2", "name": "White-listed", "label": "success" },        
    { "id": "8", "name": "Purge", "label": "info" },
    { "id": "6", "name": "Purge In-Process", "label": "info" },
    { "id": "3", "name": "Purge Completed", "label": "success" },
    { "id": "4", "name": "Failed", "label": "danger" }]

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

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.segment_max_limit = 40;
    this.CheckSegmentMaxLimitation();
    this.segmentStatus = "-1";
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.sort = this.sort;

    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0;

    this.pageObject.pageNo = 1;
    this.currentdate = new Date();
    this.minupload = new Date(this.year-1, this.month, this.day, 0, 0, 0)
    this.maxupload = new Date(this.year, this.month, this.day, 0, 0, 0)
    this.startdate = [
      new Date(new Date().setDate(this.currentdate.getDate() - 7)),
      new Date(new Date().setDate(this.currentdate.getDate()))
    ];

    this.d.setDate(this.d.getDate() + 1);//Enable for testing  
    this.getsegments();
  }
  toggle() {
    this.isOpen = !this.isOpen;
    this.isAddOpen = false;
  }
  afuConfigId = {
    formatsAllowed: ".zip",
    maxSize: "10",
    theme: "dragNDrop",
    uploadAPI: {
      url: this.ccapi.getUrl("files/lms/uploadFile"),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'accesskey': this.ccapi.getAccessKey(),
        "x-imi-uploadtype": "7"
      }
    }
  };
  toggleAdd() {
    this.isAddOpen = !this.isAddOpen
    this.isOpen = false;
    this.afuConfigId = {
      formatsAllowed: ".zip",
      maxSize: "10", theme: "dragNDrop",
      uploadAPI: {
        url: this.ccapi.getUrl("files/lms/uploadFile"),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'accesskey': this.ccapi.getAccessKey(),
          "x-imi-uploadtype": "7"
        }
      }
    };
  }
  toggleCancel() {
    this.isAddOpen = false;
    this.isOpen = true;
    this.title = "";
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
    let requestParams = {
      orderDir: "desc",
      search: this.searchString,
      startdate: formatDate(this.startdate[0], "yyyy-MM-dd", 'en-US', "") + " 00:00:00",
      enddate: formatDate(this.startdate[1], "yyyy-MM-dd", 'en-US', "") + " 23:59:59",
      start: start,
      length: this.pageObject.pageSize,
      status: this.segmentStatus
    }
    if (requestParams.startdate > requestParams.enddate) {
      this.ccapi.openDialog('warning', 'Start Date should be less than End Date '); return false;
    }
    this.Isseg_limit_reached = false;
    this.ccapi.postData('files/lms/getuploadedfile', requestParams).subscribe((response: any) => {
      this.ccapi.hidehttpspinner();
      if (response.code == "500") {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        this.dataSource.sort = this.sort;
        this.ccapi.openDialog("warning", response.message);
        this.Isseg_limit_reached = false;
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
    this.ccapi.postData("rules/lms/createsegemets", req).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
        this.uploadgtrid = ""; this.title = "";
        this.resetVar = true;
        this.getsegments();
        this.toggle();
      }
      else {
        this.ccapi.openDialog('error', resp.message);
      }
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));

  }
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
  deleteSegment(obj: any): void {
    var id = obj.id;
    if (id != undefined) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        width: '400px',
        data: {
          message: obj.status == '2' ? 'Are you sure want to delete Segment ?' : 'Are you sure want to add Segment ?',
          confirmText: 'Yes',
          cancelText: 'No'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          let _test = JSON.parse(JSON.stringify(obj));

          let req = {
            "trnid": obj.id,
            "status": obj.status
          }

          this.ccapi.postData("files/updateStatus", req).subscribe((resp: any) => {
            if (resp.code == "200") {
              var message = obj.status == '2' ? 'Segment has been deleted successfully.' : 'Segment has been added successfully.';
              this.ccapi.openDialog('success', message);
              this.getsegments();
            }
            else {
              this.ccapi.openDialog('warning', resp.message);
            }
          });
        }
      });
    }
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
