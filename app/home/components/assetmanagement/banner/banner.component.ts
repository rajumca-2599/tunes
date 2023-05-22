import { Component, OnInit, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
//import { MsgdialogueboxComponent } from '../../../../shared/msgdialoguebox/msgdialoguebox.component';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { AddBannerComponent } from './add-banner/add-banner.component';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
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
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit, OnDestroy {
  userpermissions: any = this.ccapi.getpermissions("");
  public statuslist: any[] = [{ id: "1", name: "Active" }, { id: "0", name: "Inactive" }];

  displayedColumns: string[] = ["bannerid", "name", "type", "description", "startdate", "enddate", "status", "workflowstatus", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public bannertype: any = 3;
  public bannerObj: any;
  public searchString: any = "";
  public fstatus: any = 1;
  private _dialog1: Subscription;
  private _httpobj1: Subscription;
  private _httpobj2: Subscription;

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
    this.pageObject.pageSize = obj.pageSize;
    this.getBanners();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getBanners();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getBanners();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.pageObject.pageNo = 1;
    this.getBanners();
    this.fstatus = "1";
    this.loadRules();
    this.dataSource.sort = this.sort;
  }
  searchbanners() {
    this.pageObject.pageNo = 1;
    this.paginator.pageIndex = 0;
    this.getBanners();
  }
  getbannertype(id) {
    switch (id + "") {
      case "1": return "Card Banner";
      case "2": return "Full Banner";
      case "3": return "Top Banner";
    }
    return "";
  }
  getBanners() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requestParams = {
      "type": this.bannertype,
      "status": this.fstatus,
      name: this.searchString,
      start: start,
      length: this.pageObject.pageSize,
      orderDir: "desc"
    }
    this.dataSource = new MatTableDataSource([]);
    // this.pageObject.totalRecords = 0;
    // this.pageObject.totalPages = 0; this.dataSource.sort = this.sort;
    this._httpobj1 = this.ccapi.postData('banners/getbanners', requestParams).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.banners && response.banners.length > 0) {
          this.dataSource = new MatTableDataSource(response.banners);
          this.pageObject.totalRecords = response.recordsTotal;
          if (response.recordsTotal == 0) {
            this.pageObject.totalRecords = response.banners.length;
          }
          this.pageObject.totalPages = response.recordsFiltered;
           this.dataSource.sort = this.sort;
          // if (this.pageObject.totalRecords == null || this.pageObject.totalRecords == undefined) {
          //   this.pageObject.totalRecords = response.banners.length;
          //   this.pageObject.totalPages = 1;
          // }
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0; this.dataSource.sort = this.sort;
          this.ccapi.openSnackBar("No Records Found");
        }
      }
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));
  };
  createBanner() {
    this.router.navigate(['home/addbanner']);
  }
  createRuleDialog(obj: any): void {
    this.router.navigate(['home/addbanner']);
  }

  deleteRule(id: number, name: string): void {
    if (id != undefined) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        width: '400px',
        data: {
          message: 'Are you sure want to delete rule (' + name + ')?',
          confirmText: 'Yes',
          cancelText: 'No'
        }
      });
      this._dialog1 = dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          this._httpobj2 = this.ccapi.postData("rules/deleterule", { ruleId: id }).subscribe((resp: any) => {
            if (resp.code == "200") {
              this.ccapi.openDialog('success', 'Rule has been deleted successfully.');
              this.getBanners();
            }
          }, (err => {
            this.ccapi.HandleHTTPError(err);
          }));
        }
      });
    }
  }

  editbanner(row,isview) {
    this.router.navigate(['home/addbanner/' + row.bannerid + "/" + row.type + "/" + isview]);
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  getstatus(val) {
    if (val == "1") return "Active"; else return "Inactive";
  }
  getworkflowstatus(val) {
    if (val == "1")
      return "Pending";
    else
      return "Live";
  }

  ngOnDestroy() {
    console.log("destroypostdata");
    if (this._httpobj1 != null && this._httpobj1 != undefined)
      this._httpobj1.unsubscribe();
    if (this._httpobj2 != null && this._httpobj2 != undefined)
      this._httpobj2.unsubscribe();
    if (this._dialog1 != null && this._dialog1 != undefined)
      this._dialog1.unsubscribe();
  }
  loadRules() {
    let requesrParams = {
      orderDir: "desc",
      name: "",
      start: 1,
      length: 100,
      "status": 1
    }
    let _rulelist = [];
    var _temp = this.ccapi.getSession("ruleslist");
    if (_temp != null && _temp != undefined && _temp != "") {
     // _rulelist = JSON.parse(this.ccapi.getSession("ruleslist"));
    }
    if (_rulelist == null || _rulelist == undefined || _rulelist.length == 0) {
      this.ccapi.postData('rules/listrules', requesrParams).toPromise().then((response: any) => {
        if (response.code == "500") {
          this.ccapi.openSnackBar("No Records Found");
        }
        else if (response.code == "200") {
          let arr = response.rules;
          for (let i = 0; i < arr.length; i++) {
            arr[i].id = i;
          }
          this.ccapi.setSession("ruleslist", JSON.stringify(arr));
        }
      }).catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
    } 
  };
}
