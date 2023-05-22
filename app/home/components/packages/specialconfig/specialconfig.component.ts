import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
//import { MsgdialogueboxComponent } from '../../../../shared/msgdialoguebox/msgdialoguebox.component';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { AddSpecialconfigComponent } from './add-specialconfig/add-specialconfig.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-specialconfig',
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
  templateUrl: './specialconfig.component.html',
  styleUrls: ['./specialconfig.component.css']
})
export class SpecialconfigComponent implements OnInit {
  displayedColumns: string[] = ["schema", "createdon", "status", "actions"];
  userpermissions: any = this.ccapi.getpermissions("");
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;

  public splConfig: any;
  public searchString: any = "";

  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog) {
    this.displayedColumns = ["schema", "createdon", "status", "actions"];

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
    this.getspecialconfig();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getspecialconfig();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getspecialconfig();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.pageObject.pageNo = 1;
    this.pageObject.pageSize = 20;
    this.getspecialconfig();
  }
  getspecialconfigList() {
    this.paginator.pageIndex = 0;
    this.pageObject.pageNo = 1;
    this.getspecialconfig();
  }
  getspecialconfig() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      search: this.searchString,
      start: start,
      length: this.pageObject.pageSize,
      orderDir: "desc"
    }
    this.ccapi.postData('specialpackage/getall', requesrParams).subscribe((response: any) => {
      console.log(response);
      if (response.code == "500") {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        this.dataSource.sort = this.sort;
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.data != null && response.data.length > 0) {
          this.dataSource = new MatTableDataSource(response.data);
          if (response.recordsTotal == 0) {
            response.recordsTotal = response.data.length;
          }
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

  createSplConfigDialog(obj: any): void {
    if (obj == null && obj == undefined) {
      this.splConfig = {
        id: 0,
        schema: '',
        home_banner_id: '',
        home_banner_en: '',
        home_banner_url_id: '',
        home_banner_url_en: '',
        UnlimitedDataBarString_id: '',
        UnlimitedDataBarString_en: '',
        UnlimitedPhoneBarString_id: '',
        UnlimitedPhoneBarString_en: '',
        UnlimitedSMSBarString_id: '',
        UnlimitedSMSBarString_en: '',
        "isDisplayUnlimitedDataCircle": false,
        "isDisplayUnlimitedPhoneCircle": false,
        "isDisplayUnlimitedSMSCircle": false,
        "isDisplayUnlimitedDataBar": false,
        "isDisplayUnlimitedPhoneBar": false,
        "isDisplayUnlimitedSMSBar": false,
        "description": '',
        "mode": "insert"
      }
      const dialogRef = this.dialog.open(AddSpecialconfigComponent, {
        width: '1200px',
        data: this.splConfig,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.getspecialconfig();
        }
        console.log('The dialog was closed');
      });
    }
    else {
      let enObj: any = {};
      let idObj: any = {};
      try {
        if (obj.packageInfo != null && obj.packageInfo != undefined && obj.packageInfo.length > 0) {
          let packInfo: any = obj.packageInfo;
          for (let i = 0; i < packInfo.length; i++) {
            if (packInfo[i].language == 'en') {
              enObj = packInfo[i];
            } else if (packInfo[i].language == 'id') {
              idObj = packInfo[i];
            }
          }
        }
      } catch (e) { }
      this.splConfig = {
        id: obj.id,
        schema: obj.schema,
        home_banner_id: idObj.home_banner,
        home_banner_en: enObj.home_banner,
        home_banner_url_id: idObj.home_banner_url,
        home_banner_url_en: enObj.home_banner_url,
        UnlimitedDataBarString_id: idObj.UnlimitedDataBarString,
        UnlimitedDataBarString_en: enObj.UnlimitedDataBarString,
        UnlimitedPhoneBarString_id: idObj.UnlimitedPhoneBarString,
        UnlimitedPhoneBarString_en: enObj.UnlimitedPhoneBarString,
        UnlimitedSMSBarString_id: idObj.UnlimitedSMSBarString,
        UnlimitedSMSBarString_en: enObj.UnlimitedSMSBarString,
        "isDisplayUnlimitedDataCircle": enObj.isDisplayUnlimitedDataCircle,
        "isDisplayUnlimitedPhoneCircle": enObj.isDisplayUnlimitedPhoneCircle,
        "isDisplayUnlimitedSMSCircle": enObj.isDisplayUnlimitedSMSCircle,
        "isDisplayUnlimitedDataBar": enObj.isDisplayUnlimitedDataBar,
        "isDisplayUnlimitedPhoneBar": enObj.isDisplayUnlimitedPhoneBar,
        "isDisplayUnlimitedSMSBar": enObj.isDisplayUnlimitedSMSBar,
        "description": enObj.description,
        "mode": "update"
      }
      const dialogRef = this.dialog.open(AddSpecialconfigComponent, {
        width: '1200px',
        data: this.splConfig,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.getspecialconfig();
        }
        console.log('The dialog was closed');
      });
    }
  }

  manageSplConfig(obj) {
    let enObj: any = {};
    let idObj: any = {};
    if (obj.packageInfo) {
      let packInfo: any = obj.packageInfo;
      for (let i = 0; i < packInfo.length; i++) {
        if (packInfo[i].language == 'en') {
          enObj = packInfo[i];
        } else if (packInfo[i].language == 'id') {
          idObj = packInfo[i];
        }
      }
    }
    this.splConfig = {
      id: obj.id,
      schema: obj.schema,
      home_banner_id: idObj.home_banner,
      home_banner_en: enObj.home_banner,
      home_banner_url_id: idObj.home_banner_url,
      home_banner_url_en: enObj.home_banner_url,
      UnlimitedDataBarString_id: idObj.UnlimitedDataBarString,
      UnlimitedDataBarString_en: enObj.UnlimitedDataBarString,
      UnlimitedPhoneBarString_id: idObj.UnlimitedPhoneBarString,
      UnlimitedPhoneBarString_en: enObj.UnlimitedPhoneBarString,
      UnlimitedSMSBarString_id: idObj.UnlimitedSMSBarString,
      UnlimitedSMSBarString_en: enObj.UnlimitedSMSBarString,
      "isDisplayUnlimitedDataCircle": enObj.isDisplayUnlimitedDataCircle,
      "isDisplayUnlimitedPhoneCircle": enObj.isDisplayUnlimitedPhoneCircle,
      "isDisplayUnlimitedSMSCircle": enObj.isDisplayUnlimitedSMSCircle,
      "isDisplayUnlimitedDataBar": enObj.isDisplayUnlimitedDataBar,
      "isDisplayUnlimitedPhoneBar": enObj.isDisplayUnlimitedPhoneBar,
      "isDisplayUnlimitedSMSBar": enObj.isDisplayUnlimitedSMSBar,
      "description": enObj.description,
      "pvr_id": obj.pvr_id,
      "mode": "manage"
    }
    const dialogRef = this.dialog.open(AddSpecialconfigComponent, {
      width: '800px',
      height: '800px',
      data: this.splConfig,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.getspecialconfig();
      }
    });

  }
  toggle() {
    this.isOpen = !this.isOpen;
  }

  getstatustext(id) {
    if (id == null || id == undefined || id == "") return "Active";
    if (id == "1") return "Active";
    else if (id == "0") return "Active";
  }



  removepackages(row: any) {

    let obj = {
      status: 0, id: row.id
    }
    this.ccapi.postData("specialpackage/update", obj).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', "Updated Successfully");
        this.getspecialconfig();
      }
      else
        this.ccapi.openDialog('warning', resp.message);
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }))
  };


  showconfirm(row) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      width: '400px',
      data: {
        message: 'Please click "YES" to process this request.',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.removepackages(row);
      }
    });
  }
}
