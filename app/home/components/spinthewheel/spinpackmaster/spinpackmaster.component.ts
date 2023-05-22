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
import { AddspinmasterComponent } from './addspinpackmaster/addspinmaster.component';

@Component({
  selector: 'app-spinpackmaster',
  templateUrl: './spinpackmaster.component.html',
  styleUrls: ['./spinpackmaster.component.css']
})
export class SpinpackmasterComponent implements OnInit {

  displayedColumns: string[] = ["id", "name", "description", "catagory", "offertype", "createdon", "updatedon", "status", "actions"];
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
  packmstrobj: any;
  private _dialog1: Subscription;
  private _dialog2: Subscription;
  private _dialog3: Subscription;
  private _httpobj1: Subscription;
  private _httpobj2: Subscription;
  private _httpobj4: Subscription;
  private _httpobj3: Subscription;

  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  catagory: any = 0;
  offertype: any = 0;
  status: any = 1;
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog) {


  }
  d = new Date();
  year = this.d.getFullYear();
  month = this.d.getMonth();
  day = this.d.getDate();
  startdate: Date = new Date(this.year, this.month, this.day + 1, 0, 0, 0);

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
    this.getpackmasters();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getpackmasters();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getpackmasters();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.userpermissions = this.ccapi.getpermissions("");
    this.pageObject.pageNo = 1;
    this.loadpartnerlist();
    this.getpackmasters();
    this.getchannels();
  }

  loadpartnerlist() {
    this._httpobj1 = this.ccapi.getJSON("assets/json/partnerList.json").subscribe((resp: any) => {
      this.partnerList = resp;
      if (this.partnerList.length > 0) {
        this.partnerid = this.partnerList[0].partnerid;
      }
    }, err => {
      console.log(err);
    });

  }
  getcategory(id) {
    switch (id + "") {
      case "1": return "LISTING OFFER";
      case "2": return "WINNING OFFER";
      case "3": return "Acquisition";
      case "4": return "Retention";
      case "5": return "Offers";
    }
    return "";
  }

  getoffertype(id) {
    switch (id + "") {
      case "1": return "DATA";
      case "2": return "VOICE";
      case "3": return "COMBO";
      case "4": return "PULSA";
      case "5": return "MIX";
      case "6": return "VOUCHER";
    }
    return "";
  }
  getpackmastersList() {
    this.paginator.pageIndex = 0;
    this.pageObject.pageNo = 1;
    this.getpackmasters();
  }
  getpackmasters() {
    if (this.status == '0') {
      this.displayedColumns = ["id", "name", "description", "catagory", "offertype", "createdon", "updatedon", "status"];
    } else {
      this.displayedColumns = ["id", "name", "description", "catagory", "offertype", "createdon", "updatedon", "status", "actions"];
    }
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;

    let requesrParams = { "start": start, "length": this.pageObject.pageSize, "orderDir": "desc", "status": this.status, "catagory": this.catagory, "offertype": this.offertype, "search": this.searchString }
    this.ccapi.postData('spinwheel/getmasterpacks', requesrParams).subscribe((response: any) => {
      this.ccapi.hidehttpspinner();
      if (response.code == "500") {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        this.dataSource.sort = this.sort;

        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.data) {
          this.dataSource = new MatTableDataSource(response.data);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          this.dataSource.sort = this.sort;

        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.dataSource.sort = this.sort;
          this.ccapi.openDialog("warning", "No Data Found");
        }
      }
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));
  };

  getStatus(status: any): string {
    if (status == "1") {
      return "ACTIVE";
    } else {
      return "INACTIVE";
    }
  };

  toggle() {
    this.isOpen = !this.isOpen;
    this.isAddOpen = !this.isAddOpen;
  }

  addpackmaster(obj) {
    if (obj == null && obj == undefined) {
      let packagemaster_imageurl = "";
      try {
        packagemaster_imageurl = JSON.parse(this.ccapi.getSession("masterconfig")).packagemaster_imageurl;
      } catch (e) { }
      this.packmstrobj = {
        "mode": "insert",
        "id": 0,
        "name": "",
        "catagory": "1",
        "offertype": 1,
        "description": "",
        "imageurl": packagemaster_imageurl,
        "status": 1
      }
      const dialogRef = this.dialog.open(AddspinmasterComponent, {
        width: '900px',
        data: this.packmstrobj
      });
      this._dialog1 = dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.getpackmasters();
        }
      });
    }
    else {
      this.packmstrobj = {
        "mode": "update",
        "id": obj.id,
        "name": obj.name,
        "catagory": obj.catagory,
        "offertype": obj.offertype,
        "description": obj.description,
        "imageurl": obj.imageurl,
        "status": obj.status
      }
      const dialogRef = this.dialog.open(AddspinmasterComponent, {
        width: '900px',
        data: this.packmstrobj,
      });
      this._dialog2 = dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.getpackmasters();
        }
      });

    }
  };
  managePackMaster(obj) {
    var url = "spinwheel/getoffersbyid";
    if (obj.offertype == '5')
      url = "spinwheel/offerpacks";
    let req = {
      "offerid": obj.id
    };
    this.ccapi.postData(url, req).subscribe((resp: any) => {

      if (resp.code == "200") {
        if (obj.offertype != '5') {
          let respdata = resp.data;
          let status = 1;
          let keyword = '';
          let shortcode = '';
          let channel = '';
          let pvrid = [];
          let offerid = 0;
          let partnerid = 0;
          if (respdata.length > 0) {
            status = respdata[0].status;
            keyword = respdata[0].keyword;
            shortcode = respdata[0].shortcode;
            pvrid = respdata[0].pvrid;
            offerid = respdata[0].offerid;
            partnerid = respdata[0].partnerid;
            channel = respdata[0].channel;
          }
          this.packmstrobj = {
            "mode": "manage",
            "id": respdata.length > 0 && respdata[0].id !== undefined && respdata[0].id != "" ? respdata[0].id : obj.offerid,
            "name": obj.name,
            "catagory": obj.catagory,
            "offertype": obj.offertype,
            "description": obj.description,
            "imageurl": obj.imageurl,
            "status": status,
            "keyword": keyword,
            "shortcode": shortcode,
            "pvrid": pvrid,
            "partnerid": partnerid,
            "channel": channel,
            "offerid": respdata.length > 0 && respdata[0].id !== undefined && respdata[0].id != "" ? respdata[0].offerid : obj.id,
          }
        } else {
          this.packmstrobj = {
            "mode": "manage",
            "id": obj.id,
            "name": obj.name,
            "catagory": obj.catagory,
            "offertype": obj.offertype,
            "description": obj.description,
            "imageurl": obj.imageurl,
            "packdata": resp.data
          }
        }
        //console.log(this.packmstrobj);
        const dialogRef = this.dialog.open(AddspinmasterComponent, {
          width: '900px',
          data: this.packmstrobj,
        });
      }
      else {
        this.ccapi.openDialog('error', "Dear User, Currently we cannot process your request");
        return;
      }
    }, (error => {
      this.ccapi.HandleHTTPError(error);
    }));
    // this.packmstrobj = {
    //   "mode": "manage",
    //   "id":obj.id,
    //   "name":  obj.name,
    //   "catagory":obj.catagory,
    //   "offertype": obj.offertype,
    //   "description": obj.description,
    //   "imageurl": obj.imageurl,
    //   "status":  obj.status
    // }
    // const dialogRef = this.dialog.open(AddspinpackmasterComponent, {
    //   width: '850px',
    //   data: this.packmstrobj,
    // });
    // this._dialog3 = dialogRef.afterClosed().subscribe(result => {
    //   this.getpackmasters();
    // });
  };



  ngOnDestroy() {
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

    if (this._dialog3 != null && this._dialog3 != undefined)
      this._dialog3.unsubscribe();

  }
  getchannels() {
    let start = 1;
    let requesrParams = {
      orderDir: "desc",
      status: 1,
      search: "",
      start: start,
      length: 50
    }

    this.ccapi.postData('channels/getchannel', requesrParams).subscribe((response: any) => {


      if (response.code == "200" && response.status.toLowerCase() == "success") {
        if (response && response.data != null && response.data.length > 0) {
          this.ccapi.setSession("spin_channels", JSON.stringify(response.data));
        }

      }
    }, (error => {
    }));
  };
}
