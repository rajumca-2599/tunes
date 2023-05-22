import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { CommonService } from '../../../../shared/services/common.service';
import { Router } from '@angular/router';
import { PageObject, OrderByObject } from '../../userslist/userslist.component';
import { AddPackagedefComponent } from '../packagedef/add-packagedef/add-packagedef.component';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-packagedef',
  templateUrl: './packagedef.component.html',
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
  styleUrls: ['./packagedef.component.css']
})
export class PackagedefComponent implements OnInit {
  displayedColumns: string[] = ["pvrCode", "unregKeyword", "unregShortcode", "unregFlag", "buyExtraFlag", "createdBy", "createdAt", "modifiedBy", "modifiedAt", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;

  public packagedefObj: any;
  public searchString: any = "";
  constructor(private comm: CommonService, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.pageObject.pageNo = 1;
    this.getpackagesdef();
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
    this.getpackagesdef();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getpackagesdef();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.orderDir = column.direction;
    this.getpackagesdef();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  toggle() {
    this.isOpen = !this.isOpen;
  }
  getpackagesdef() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      search: this.searchString,
      start: start,
      length: this.pageObject.pageSize,
      ordercolumn: this.orderByObject.ordercolumn,
      orderDir: "desc"
    }
    this.comm.postData('catalog/packdeflist', requesrParams).subscribe((response: any) => {
      if (response.code == "500" && response.status == "error") {
        this.comm.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200" && response.status.toLowerCase() == "success") {
        if (response && response.data && response.data) {
          this.dataSource = new MatTableDataSource(response.data);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
        }
      }
    });
  }
  createPkageDialog(obj) {
    if (obj == null && obj == undefined) {
      this.packagedefObj = {
        pvrCode: "",
        unregKeyword: "",
        unregShortcode: "",
        unregFlag: 'N',
        buyExtraFlag: 'N',
        mode: "insert"
      }
      const dialogRef = this.dialog.open(AddPackagedefComponent, {
        width: '850px',
        data: this.packagedefObj
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getpackagesdef();
      });
    }
    else {
      this.packagedefObj = {
        mode: "update",
        pvrCode: obj.pvrCode,
        unregKeyword: obj.unregKeyword,
        unregShortcode: obj.unregShortcode,
        unregFlag: obj.unregFlag,
        buyExtraFlag: obj.buyExtraFlag
      }
      const dialogRef = this.dialog.open(AddPackagedefComponent, {
        width: '850px',
        data: this.packagedefObj,
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getpackagesdef();
      });
    }
  }
  deletePackage(id, obj2) {
    if (id != undefined) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        width: '400px',
        data: {
          message: 'Are you sure want to delete Package Definition with PVR Code (' + id + ')?',
          confirmText: 'Yes',
          cancelText: 'No'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          this.comm.postData("catalog/deletepackdefinition", { pvrCode: id }).subscribe((resp: any) => {
            if (resp.code == "200") {
              this.comm.openDialog('success', resp.message);
              this.getpackagesdef();
            }
          });
        }
      });
    }
  }

}
