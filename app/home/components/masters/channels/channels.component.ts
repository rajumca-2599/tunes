
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
//import { MsgdialogueboxComponent } from '../../../../shared/msgdialoguebox/msgdialoguebox.component';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { AddChannelComponent } from '../channels/add-channel/add-channel.component';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
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
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  displayedColumns: string[] = ["channelId", "channelName", "status", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;

  public channelObj: any;
  public searchString: any = "";
  NgxSpinnerService: any;
  status: any = 1;
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog, private spinner: NgxSpinnerService) {
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
    this.getchannels();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getchannels();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getchannels();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.userpermissions = this.ccapi.getpermissions("");
    this.dataSource.sort = this.sort;

    this.pageObject.pageNo = 1;
    this.getchannels();
  }
  getstatustext(id) {
    // if (id == null || id == undefined || id == "") return "Active";
    if (id == "1") return "Active";
    else
      return "Inactive";
  }
  getchannelsList() {
    this.paginator.pageIndex = 0;
    this.pageObject.pageNo = 1;
    this.getchannels();
  }
  getchannels() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      orderDir: "desc",
      status: this.status,
      search: this.searchString,
      start: start,
      length: this.pageObject.pageSize
    }
    this.spinner.show();
    this.ccapi.postData('channels/getchannel', requesrParams).subscribe((response: any) => {
      this.spinner.hide();
      if (response.code == "500") {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0; this.dataSource.sort = this.sort;

        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200" && response.status.toLowerCase() == "success") {
        if (response && response.data != null && response.data.length > 0) {
          this.dataSource = new MatTableDataSource(response.data);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered; this.dataSource.sort = this.sort;

        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.dataSource.sort = this.sort;

          this.pageObject.totalPages = 0;
          this.ccapi.openSnackBar("No Records Found");
        }
      }
    }, (error => {
      this.spinner.hide();
      this.ccapi.HandleHTTPError(error);
    }));
  };

  createChannelDialog(obj: any): void {
    if (obj == null && obj == undefined) {
      this.channelObj = {
        channelid: "",
        channelname: "",
        mode: "insert",
        status: 1
      }
      const dialogRef = this.dialog.open(AddChannelComponent, {
        width: '850px',
        data: this.channelObj,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result != undefined) {
          this.getchannels();
        }
      });
    }
    else {
      this.channelObj = {
        mode: "update",
        channelid: obj.channelId,
        channelname: obj.channelName,
        status: obj.status
      }
      const dialogRef = this.dialog.open(AddChannelComponent, {
        width: '850px',
        data: this.channelObj,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result != undefined) {
          this.getchannels();
        }
      });
    }
  }

  deleteChannel(id: number, name: string): void {
    if (id != undefined) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        width: '400px',
        data: {
          message: 'Are you sure want to delete channel (' + name + ')?',
          confirmText: 'Yes',
          cancelText: 'No'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          this.spinner.show();

          this.ccapi.postData("channels/deletechannel", { channelId: id }).subscribe((resp: any) => {
            this.spinner.hide();
            if (resp.code == "200") {
              this.ccapi.openDialog('success', 'Channel has been deleted successfully.');
              this.getchannels();
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
