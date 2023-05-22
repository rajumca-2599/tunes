import { Component, OnInit, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { AddEmailtemplateComponent } from './add-emailtemplate/add-emailtemplate.component';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';

import { MatSort } from '@angular/material/sort';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-emailtemplate',
  templateUrl: './emailtemplate.component.html',
  styleUrls: ['./emailtemplate.component.css'],
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
})
export class EmailtemplateComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ["name", "type","url" ,"status", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public etObj: any;
  public fsearchtext: string = "";
  public ftype: string = "email";
  private _dialog1: Subscription;
  private _httpobj1: Subscription;
  private _httpobj2: Subscription;
  private _dialog2: Subscription;


  public listData: any;
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog) {
    this.ftype = "email";
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
    this.getEmailTemplates();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getEmailTemplates();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getEmailTemplates();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.pageObject.pageNo = 1;
    this.getEmailTemplates();
  }
  getStatus(status: any): string {
    if (status == "1") {
      return "Active";
    } else {
      return "Inactive";
    }
  };
  getType(type: any): string {
    if (type.toLowerCase() == "email") return "Email";
    else if (type.toLowerCase() == "webview") return "Web View";
     //Changes for JIRA ID: DIGITAL-4647 on 07-09-2020
    else if (type.toLowerCase() == "json") return "JSON";
    else return "";
  };
  getEmailTemplates() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      search: this.fsearchtext,
      // type: this.ftype,
      start: start,
      length: this.pageObject.pageSize,
      orderDir: "desc"
    }
    // this.listData = [{ id: '1', name: 'Auto Expiry', type:"email",desc:"", body: '<b>Auto Expiry</b>', status: '1' },
    //   { id: '2', name: 'Account Expiry', type: "email", desc: "", body: '<h1>Account Expiry</h1>', status: '1' }];
    // this.dataSource = new MatTableDataSource(this.listData);
    // this.pageObject.totalRecords = 2;
    // this.pageObject.totalPages = 2;
    let objmasters = JSON.parse(this.ccapi.getSession("masterconfig"));
    this._httpobj1 = this.ccapi.postData('template/getall', requesrParams).subscribe((response: any) => {
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
          let _tmp = response.data;
          try {
            for (let a = 0; a < _tmp.length; a++) {
              _tmp[a].physicalurl = objmasters.mastertemplateassets.replace("!TID!", _tmp[a].name);
            }

          } catch (e) { }
          this.dataSource = new MatTableDataSource(_tmp);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          this.dataSource.sort = this.sort;
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

  EditEmailTemplateDialog(obj: any): void {
   
    if (obj == null && obj == undefined) {
      this.etObj = {};
      this.etObj.mode = "insert";
      const dialogRef = this.dialog.open(AddEmailtemplateComponent, {
        width: '950px',
        height: "950px",
        data: this.etObj
      });
      this._dialog1 = dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.getEmailTemplates();
        }
        console.log('The dialog was closed');
      });
    }
    else {
      this.etObj = obj;
      this.etObj.mode = "update";
      const dialogRef = this.dialog.open(AddEmailtemplateComponent, {
        width: '950px',
        height: "950px",
        data: this.etObj
      });
      this._dialog2 = dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.getEmailTemplates();
        }
        console.log('The dialog was closed');
      });
    }
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  ngOnDestroy() {
    console.log("destroypostdata");
    if (this._httpobj1 != null && this._httpobj1 != undefined)
      this._httpobj1.unsubscribe();
    if (this._httpobj2 != null && this._httpobj2 != undefined)
      this._httpobj2.unsubscribe();
    if (this._dialog1 != null && this._dialog1 != undefined)
      this._dialog1.unsubscribe();
    if (this._dialog2 != null && this._dialog2 != undefined)
      this._dialog2.unsubscribe();
  }

}


