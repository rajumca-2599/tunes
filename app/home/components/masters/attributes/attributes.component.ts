import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { AddAttributeComponent } from './add-attribute/add-attribute.component';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
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
  styleUrls: ['./attributes.component.css']
})
export class AttributesComponent implements OnInit {
  displayedColumns: string[] = ["key", "value", "desc", "group", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;

  public attriObj: any;
  public searchString: any = "";

  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource([]);
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
    this.getattributes();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getattributes();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getattributes();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit() {
    this.pageObject.pageNo = 1;
    this.getattributes();
  }

  getattributes() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      orderDir: "desc",
      search: this.searchString,
      start: start,
      length: this.pageObject.pageSize,
      ordercolumn: this.orderByObject.ordercolumn
    }
    this.ccapi.postData('attributes/attributeslist', requesrParams).subscribe((response: any) => {
      if (response.code == "500") {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;

        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200" && response.status.toLowerCase() == "success") {
        if (response && response.data != null && response.data.length > 0) {
          this.dataSource = new MatTableDataSource(response.data);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.ccapi.openSnackBar("No Records Found");
        }
      }
    });
  };

  createAttributeDialog(obj: any): void {
    if (obj == null && obj == undefined) {
      this.attriObj = {
        key: "",
        value: "",
        desc: "",
        mode: "insert"
      }
      const dialogRef = this.dialog.open(AddAttributeComponent, {
        width: '850px',
        data: this.attriObj,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.getattributes();
      });
    }
    else {
      //var url = "user/getattribute/" + id;
      //this.ccapi.postData(url, {}).subscribe((resp: any) => {
      //  if (resp.code == "200") {
      //    this.attriObj = {
      //      id: id,
      //      key: resp.data.key,
      //      value: resp.data.value,
      //      desc: resp.data.desc,
      //      mode: "update"
      //    }
      //    const dialogRef = this.dialog.open(AddAttributeComponent, {
      //      width: '850px',
      //      data: this.attriObj,
      //    });
      //    dialogRef.afterClosed().subscribe(result => {
      //      console.log('The dialog was closed');
      //    });
      //  }
      //  else {
      //    this.ccapi.openDialog('error', "Dear User, Currently we cannot process your request");
      //    return;
      //  }
      //});
      this.attriObj = {
        mode: "update",
        key: obj.key,
        value: obj.value,
        desc: obj.desc
      }
      const dialogRef = this.dialog.open(AddAttributeComponent, {
        width: '850px',
        data: this.attriObj,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getattributes();
      });
    }
  }

  deleteAttribute(id: number, name: string): void {
    if (id != undefined) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        width: '400px',
        data: {
          message: 'Are you sure want to delete attribute (' + name + ')?',
          confirmText: 'Yes',
          cancelText: 'No'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          this.ccapi.postData("attributes/deleteattributes", { key: id }).subscribe((resp: any) => {
            if (resp.code == "200") {
              this.ccapi.openDialog('success', 'Attribute has been deleted successfully.');
              this.getattributes();
            }
          });
        }
      });
    }
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
}

