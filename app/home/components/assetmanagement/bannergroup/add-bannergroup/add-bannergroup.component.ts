import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher, MatDialog } from "@angular/material";
import { CommonService } from '../../../../../shared/services/common.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ShowImageComponent } from '../../../shared/show-image/show-image.component';
import * as moment from 'moment';
import { formatDate } from '@angular/common';
import { parse } from 'url';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PageObject } from '../../../userslist/userslist.component';

@Component({
  selector: 'app-add-bannergroup',
  templateUrl: './add-bannergroup.component.html',
  styleUrls: ['./add-bannergroup.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AddBannergroupComponent implements OnInit, OnDestroy {
  bannersearchtext: any = "";
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  displayedColumns: string[] = ["name", "image", "order", "status", "actions"];
  dataSource: any = new MatTableDataSource();
  public title: string = "ADD BANNER GROUP";
  public bgobj: any;
  public mode: string = 'update';
  public disabled: boolean = false;
  public show_SelectedBanners: boolean = true;
  public selectedBanners: any = [];
  public bannerslist: any = [];
  public bannertypes: any = [];
  public bannertype_disabled: boolean = false;
  public minDate = new Date();
  public maxDate = new Date();
  startdate: Date = new Date();
  private _dialog1: Subscription;
  private _httpobj1: Subscription;
  private _httpobj2: Subscription;
  private _httpobj3: Subscription;
  private _httpobj4: Subscription;


  d = new Date();
  year = this.d.getFullYear();
  month = this.d.getMonth();
  day = this.d.getDate();
  publishbanners: any[] = []
  enddate: Date = new Date(this.year + 5, this.month, this.day, 23, 59, 59);
  constructor(private router: Router, private comm: CommonService, private dialogRef: MatDialogRef<AddBannergroupComponent>, @Inject(MAT_DIALOG_DATA) data, private dialog: MatDialog) {
    this.bgobj = {
      id: "",
      name: "",
      title: "",
      desc: "",
      startdate: this.startdate,
      enddate: this.enddate,
      status: "1",
      bannertype: "1",
      banners: [],
      mode: "insert"
    };

    this.bannertypes = [{ id: "1", text: "Card" }, { id: "2", text: "Full" }, { id: "3", text: "Top Banner" }];
    this.show_SelectedBanners = true;
    this.mode = data.mode;
    if (data.mode == "update") {
      this.bgobj.bannertype = data.bannertype;
      this.title = "EDIT BANNER GROUP (" + data.name + ")";
      this.d = new Date(formatDate(data.startdate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''));
      this.bgobj.id = data.id;
      this.bgobj.name = data.name;
      this.bgobj.title = data.title;
      this.bgobj.desc = data.desc;
      this.bgobj.mode = data.mode;
      this.bgobj.status = data.status;
      this.disabled = false;
      this.bgobj.startdate = data.startdate;
      this.bgobj.enddate = data.enddate;
      this.publishbanners = data.banners;
    }
  }

  ngOnInit() {
    this.userpermissions = this.comm.getpermissions("bannergrouping");
    this.bannerslist = [];
    try {
      if (this.bgobj.mode == "update") {
        if (this.userpermissions.edit == 0) {
          this.router.navigate(["/home/error405"]);
        }
        this.bannertype_disabled = true;
        this.mode = "update";
        this.d = new Date(formatDate(this.bgobj.startdate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''));
        this.title = "EDIT BANNER GROUP (" + this.bgobj.name + ")"
        this.bgobj.bannertype = this.bgobj.bannertype.toString();
        this.bgobj.startdate = this.bgobj.startdate + "";
        this.bgobj.enddate = this.bgobj.enddate + "";
        //if (data.banners.length > 0) {
        //  this.show_SelectedBanners = true;
        //  data.banners.map((obj) => { obj.isnew = false; return obj; });
        //  this.selectedBanners = data.banners; 
        //}
        if (this.comm.getStateName() == "publish") {
          this.selectedBanners = this.publishbanners;
          this.dataSource = new MatTableDataSource(this.selectedBanners);
        }
        else {
          this.getBannersByGroupId(this.bgobj.id);
        }
        if (this.bgobj.startdate != '') {
          this.bgobj.startdate = new Date(formatDate(this.bgobj.startdate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''));
          this.bgobj.enddate = new Date(formatDate(this.bgobj.enddate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''));
        }
      }
    }
    catch (e) { }
    this.dataSource = new MatTableDataSource(this.selectedBanners);
  }
  getBannersByGroupId(bannergroupid) {
    console.log('banners/getbannergroupById');
    this._httpobj1 = this.comm.postData('banners/getbannergroupById', { bannergroupid: bannergroupid }).subscribe((response: any) => {
      if (response.code == "200") {
        if (response.bannergroups != undefined && response.bannergroups[0].banners.length > 0) {
          this.show_SelectedBanners = true;
          response.bannergroups[0].banners.map((obj) => { obj.isnew = false; return obj; });
          // console.log(response.bannergroups[0].banners);
          // try {
          //   for (let _i = 0; _i < response.bannergroups[0].banners.length; _i++) {
          //     if (response.bannergroups[0].banners[_i].order == "0") {
          //       response.bannergroups[0].banners[_i].order = _i + "";
          //     }
          //   }
          // } catch (e) { }
          this.selectedBanners = response.bannergroups[0].banners;
          this.dataSource = new MatTableDataSource(this.selectedBanners);
        }
        else {
          this.show_SelectedBanners = false;
        }
      }
      else {

      }
    }, (err => {
      this.comm.HandleHTTPError(err);
    }));
  }
  public removed(value: any): void {
    console.log(value);
  }

  public typed(value: any): void {
    if (value.length > 1) {
      this.getbannersbytype(value);
    }
    else {
      this.bannerslist = [];
    }
  }
  getBannerImage(id) {
    return this.comm.getBannerUrl(id);
  }

  searchbanner(reset) {
    if (reset == "-1") this.pageObject.pageNo = 1;
    else if (reset == "1") this.pageObject.pageNo = this.pageObject.pageNo + 1;
    else if (reset == "0") this.pageObject.pageNo = this.pageObject.pageNo - 1;
    if (this.pageObject.pageNo < 1) this.pageObject.pageNo = 1;
    this.getbannersbytype(this.bannersearchtext)
  }
  shownext: boolean = false;
  showprev: boolean = false;
  currentpageno: number = 1;
  pageObject: PageObject = new PageObject();

  public getbannersbytype(searchtext) {
    this.pageObject.pageSize = 8;
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;

    let reqObj = {
      "type": this.bgobj.bannertype,
      "status": 1,
      "name": searchtext, start: start,
      length: this.pageObject.pageSize, orderDir: "desc"
    }
    this._httpobj2 = this.comm.postData('banners/getbanners', reqObj).subscribe((response: any) => {
      if (response.code == "200") {
        this.bannerslist = [];
        let _tmp = [];
        for (let i = 0; i < response.banners.length; i++) {
          let item = {
            id: response.banners[i].bannerid,
            text: response.banners[i].name,
            order: "0",
            src: this.comm.getBannerUrl(response.banners[i].bannerid),
            status: "1"
          };
          _tmp.push(item);
        }
        this.bannerslist = _tmp;
        let _itm = (this.pageObject.pageNo * this.pageObject.pageSize);
        if (_itm < response.recordsTotal) {
          this.shownext = true;
        }
        else
          this.shownext = false;
        if (this.pageObject.pageNo > 1) {
          this.showprev = true;
        }
        else {
          this.showprev = false;
        }
      }
      else {
        console.log(response);
      }
    }, (err => {
      this.comm.HandleHTTPError(err);
    }));
  }
  public refreshValue(value: any): void {
    console.log(value);
  }
  onBannerSelectedChange(bid): void {
    // get selected banner item
    let selecteditems = this.bannerslist.filter(function (element, index) {
      return (element.id === bid.id);
    });
    let selecteditem;
    if (selecteditems.length > 0) {
      selecteditem = selecteditems[0];
    }
    if (this.selectedBanners.length > 0) {
      let chkitem = this.selectedBanners.filter(function (element, index) {
        return (element.bannerid === bid.id);
      });
      if (chkitem.length == 0) {
        this.selectedBanners.push({ bannerid: bid.id, title: bid.text, order: 0, src: selecteditem.src, status: selecteditem.status, isnew: true });
      }
    }
    else {
      this.selectedBanners.push({ bannerid: bid.id, title: bid.text, order: 0, src: selecteditem.src, status: selecteditem.status, isnew: true });
    }
    this.show_SelectedBanners = true;
    this.bannertype_disabled = true;
    this.dataSource = new MatTableDataSource(this.selectedBanners);
  }
  onchangeBannerType(): void {
    // this.items = [];
    // load banners based on banner type
    this.bannerslist = [];
  }
  removeSelectedBanner(r): void {
    if (this.selectedBanners.length > 0) {
      if (r.isnew) {
        let removeIndex = this.selectedBanners.findIndex(d => d.bannerid === r.bannerid);
        if (removeIndex > -1) { this.selectedBanners.splice(removeIndex, 1) }
      }
      else {
        let rIndex = this.selectedBanners.findIndex(d => d.bannerid === r.bannerid);
        if (this.selectedBanners[rIndex].status != "0" && rIndex > -1) { this.selectedBanners[rIndex].status = "0" };
      }
      if (this.bgobj.mode == "insert" && this.selectedBanners.length == 0) {
        this.bannertype_disabled = false;
      }
      this.dataSource = new MatTableDataSource(this.selectedBanners);
    }
  }
  ReactivateBanner(r): void {
    if (this.selectedBanners.length > 0) {
      if (!r.isnew) {
        let rIndex = this.selectedBanners.findIndex(d => d.bannerid === r.bannerid);
        if (this.selectedBanners[rIndex].status == "0" && rIndex > -1)
          this.selectedBanners[rIndex].status = "1";
      }

      this.dataSource = new MatTableDataSource(this.selectedBanners);
    }
  }
  getStatus(status: any): string {
    if (status == "1") {
      return "Active";
    } else {
      return "Inactive";
    }
  };


  close() {
    this.dialogRef.close();
  }
  showBannerImage(obj) {
    const dialogRef = this.dialog.open(ShowImageComponent, {
      width: '850px',
      data: obj.src,
    });
    this._dialog1 = dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  submitBannerGroup() {
    if (this.bgobj.name == "" || this.bgobj.name == undefined || this.bgobj.name == null) {
      this.comm.openDialog('error', 'Banner group name is required.');
      return false;
    }
    if (this.bgobj.bannertype == "" || this.bgobj.bannertype == undefined || this.bgobj.bannertype == null) {
      this.comm.openDialog('error', 'Banner type is required.');
      return false;
    }
    if (this.bgobj.startdate == "" || this.bgobj.startdate == undefined || this.bgobj.startdate == null) {
      this.comm.openDialog('error', 'Banner start date is required.');
      return false;
    }
    if (this.bgobj.enddate == "" || this.bgobj.enddate == undefined || this.bgobj.enddate == null) {
      this.comm.openDialog('error', 'Banner end date is required.');
      return false;
    }
    if (new Date(this.bgobj.enddate) < new Date(this.bgobj.startdate)) {
      this.comm.openDialog('error', "End Date can't before start date");
      return false;
    }
    let activeBanners = this.selectedBanners.filter(d => d.status == "1");
    if (activeBanners.length < 1) {
      this.comm.openDialog('error', "Please added atleast one active banners to banner group.");
      return false;
    }
    let banners = [];
    if (this.selectedBanners.length > 0) {
      for (let i = 0; i < this.selectedBanners.length; i++) {
        let itm = this.selectedBanners[i];
        banners.push({ "order": parseInt(itm.order), "status": parseInt(itm.status), "bannerid": parseInt(itm.bannerid) });
      }
    }
    if (banners.length < 1) {
      this.comm.openDialog('error', "Please added atleast one active banners to banner group.");
      return false;
    }
    let req; let url;
    if (this.bgobj.mode == "update") {
      url = "banners/managebannergroup";
      req = {
        bannergroupid: this.bgobj.id,
        title: this.bgobj.title,
        groupname: this.bgobj.name,
        description: this.bgobj.desc,
        startdate: formatDate(this.bgobj.startdate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''),
        enddate: formatDate(this.bgobj.enddate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''),
        status: parseInt(this.bgobj.status),
        createdBy: this.comm.getUserId(),
        modifiedBy: this.comm.getUserId(),
        type: parseInt(this.bgobj.bannertype),
        banners: banners
      };
    }
    else {
      url = "banners/createbannergroup";
      req = {
        bannergroupid: 0,
        title: this.bgobj.title,
        name: this.bgobj.name,
        description: this.bgobj.desc,
        startDate: formatDate(this.bgobj.startdate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''),
        endDate: formatDate(this.bgobj.enddate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''),
        status: parseInt(this.bgobj.status),
        createdBy: this.comm.getUserId(),
        modifiedBy: this.comm.getUserId(),
        type: parseInt(this.bgobj.bannertype),
        data: banners,
        wfstatus: 0
      };
    }
    this._httpobj3 = this.comm.postData(url, req).subscribe((resp: any) => {
      if (resp.code == "200" && resp.status == "success")
        this.comm.openDialog('success', resp.message);
      else
        this.comm.openDialog('error', resp.message);
      this.dialogRef.close(resp);
    }, (err => {
      this.comm.HandleHTTPError(err);
    }));
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
  }
}

