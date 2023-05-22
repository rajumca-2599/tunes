import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { AddPlatformsettingsComponent } from './add-platformsettings/add-platformsettings.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-platformsettings',
  templateUrl: './platformsettings.component.html',
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
  styleUrls: ['./platformsettings.component.css']
})
export class PlatformsettingsComponent implements OnInit {
  displayedColumns: string[] = ["keyword", "value", "group_name", "description"];
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  _rawdata: any[] = [];
  public pltfrmObj: any;
  public searchString: any = "";
  filterBy: any = "";

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
    this.pageObject.pageNo = 0;
    this.getPlatfmSettings();

  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getPlatfmSettings();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getPlatfmSettings();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  masterconfiglist:any;
  platformsettingfilters:any[]=[]
  ngOnInit() {
    this.masterconfiglist = JSON.parse(this.ccapi.getSession("masterconfig"));
    this.platformsettingfilters=this.masterconfiglist.platformsettingfilters;
    this.userpermissions = this.ccapi.getpermissions("");
    this.pageObject.pageNo = 1;
    this.dataSource.sort = this.sort;
    this.getPlatfmSettings();
  }
  getPlatfmSettingsList() {
    this.pageObject.pageNo = 1;
    this.paginator.pageIndex = 0;
    this.getPlatfmSettings();
  }
  getPlatfmSettings() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      search: this.searchString,
      filterBy: this.filterBy,
      start: start,
      length: this.pageObject.pageSize,
      orderDir: "desc"
    }
    this.dataSource = new MatTableDataSource([]);
    // this.pageObject.totalRecords = 0;
    // this.pageObject.totalPages = 0;
    // this.dataSource.sort = this.sort;

    this.ccapi.postData('globalsettings/getall', requesrParams).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.data != null && response.data.length > 0) {
          let arr: any = response.data;
          for (let i = 0; i < arr.length; i++) {
            arr[i].edited = false;
          }
          this._rawdata = JSON.parse(JSON.stringify(arr));
          this.dataSource = new MatTableDataSource(arr);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          this.dataSource.sort = this.sort;
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.dataSource.sort = this.sort;
          this.ccapi.openSnackBar("No Records Found");
        }
      }
    });
  };

  onSave(row: any) {
    row.edited = false;
    let obj = {
      "keyword": this.ccapi.trimtext(row.keyword),
      "value": this.ccapi.trimtext(row.value),
      "description": this.ccapi.trimtext(row.description),
      "group_name": this.ccapi.trimtext(row.group_name)
    }
    this.ccapi.postData("globalsettings/update", obj).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
        this.getPlatfmSettings();
      }
      else
        this.ccapi.openDialog('warning', resp.message);
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }))
  }
  onCancel(row: any) {
    row.edited = false;
    // this.getPlatfmSettings();
    try {
      for (let i = 0; i < this._rawdata.length; i++) {
        if (this._rawdata[i].id == row.id) {
          row.value = this._rawdata[i].value; break;
        }
      }
    } catch (e) { }
  }


  toggle() {
    this.isOpen = !this.isOpen;
  }

  onClickRow(row: any) {
    row.edited = true;
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if (row.keyword != this.dataSource.data[i].keyword) {
        this.dataSource.data[i].edited = false;
      }
    }
  }


  refreshPltfrm() {
    let req = { "global": "true" }
    this.ccapi.postData("refresh/all", req).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
        this.getPlatfmSettings();
      }
      else
        this.ccapi.openDialog('warning', resp.message);
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }))
  }

}
