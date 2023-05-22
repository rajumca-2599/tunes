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
import { FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-refresh',
  templateUrl: './refresh.component.html',
  styleUrls: ['./refresh.component.css']
})
export class RefreshComponent implements OnInit {
  status: number = 1;
  name: string = "";
  startip: string = "";
  endip: string = "";
  displayedColumns: string[] = ["name", "actions"];
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = false;
  public isAddOpen: any = true;
  keyword: any = "";
  public word: any = "";
  public searchString: any = "";
  languag: any = 1;
  description: any = "";
  public id: number = 0;
  refreshitems: any[] = [];
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
    this.getrefreshitems();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getrefreshitems();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getrefreshitems();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.userpermissions = this.ccapi.getpermissions("");
    this.dataSource.sort = this.sort;
    this.pageObject.pageNo = 1;
    this.refreshitems = JSON.parse(this.ccapi.getSession("masterconfig")).refreshitems;
    this.getrefreshitems();
  };

  getrefreshitems() {

    this.dataSource = new MatTableDataSource([]);
    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0;
    this.dataSource.sort = this.sort;

    this.refreshitems = JSON.parse(this.ccapi.getSession("masterconfig")).refreshitems;
    this.dataSource = new MatTableDataSource(this.refreshitems);
    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0;
    this.dataSource.sort = this.sort;
  };

  refresh(row) {
    let _txt = '{"' + row.value + '": "true" }';
     let obj: any = JSON.parse(_txt);

    this.ccapi.postData('refresh/all', obj).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
      }
      else
        this.ccapi.openDialog('warning', resp.message);
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));

  };



  showconfirm(row) {
    let _txt = 'Please click "YES" to process this request.';

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

        this.refresh(row);
      }
    });
  }




}
