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
  selector: 'app-gatewayips',
  templateUrl: './gatewayips.component.html',
  styleUrls: ['./gatewayips.component.css']
})
export class GatewayipsComponent implements OnInit {
  status: number = 1;
  name: string = "";
  startip: string = "";
  endip: string = "";
  displayedColumns: string[] = ["name", "startip", "endip", "actions"];
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
    this.getGatewayips();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getGatewayips();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getGatewayips();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.userpermissions = this.ccapi.getpermissions("");
    this.dataSource.sort = this.sort;
    this.pageObject.pageNo = 1;
    this.getGatewayips();
  };

  getGatewayips() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      start: start,
      length: this.pageObject.pageSize,
      orderDir: "desc"
    }
    //this.dataSource = new MatTableDataSource([]);
    //this.pageObject.totalRecords = 0;
    //this.pageObject.totalPages = 0;
    //this.dataSource.sort = this.sort;
    this.ccapi.postData('gateway/getall', requesrParams).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.data && response.data.length > 0) {
          let arr = response.data;
          for (let a = 0; a < arr.length; a++) {
            arr[a].startip = arr[a].rangefrom;
            arr[a].endip = arr[a].rangeto;
            arr[a].id = arr[a].sid;
          }
          this.dataSource = new MatTableDataSource(arr);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          this.dataSource.sort = this.sort;
          this.resetToSearch();
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

  addGatewayips() {
    if (!this.ccapi.isvalidtext(this.name, "Enter Name")) return false;
    if (!this.isvalidip(this.startip)) { this.ccapi.openDialog('warning', "Invalid Start IP"); return; }
    if (!this.isvalidip(this.endip)) { this.ccapi.openDialog('warning', "Invalid End IP"); return; }
    try {
      if (parseFloat(this.startip.split('.')[0]) > parseFloat(this.endip.split('.')[0])) {
        this.ccapi.openDialog('warning', "Invalid Range"); return;
      }
      else if (parseFloat(this.startip.split('.')[0]) == parseFloat(this.endip.split('.')[0])
        && parseFloat(this.startip.split('.')[1]) > parseFloat(this.endip.split('.')[1])) {
        this.ccapi.openDialog('warning', "Invalid Range"); return;
      }
      else if (parseFloat(this.startip.split('.')[0]) == parseFloat(this.endip.split('.')[0])
        && parseFloat(this.startip.split('.')[1]) == parseFloat(this.endip.split('.')[1])
        && parseFloat(this.startip.split('.')[2]) > parseFloat(this.endip.split('.')[2])) {
        this.ccapi.openDialog('warning', "Invalid Range"); return;
      }
      else if (parseFloat(this.startip.split('.')[0]) == parseFloat(this.endip.split('.')[0])
        && parseFloat(this.startip.split('.')[1]) == parseFloat(this.endip.split('.')[1])
        && parseFloat(this.startip.split('.')[2]) == parseFloat(this.endip.split('.')[2])
        && parseFloat(this.startip.split('.')[3]) > parseFloat(this.endip.split('.')[3])) {
        this.ccapi.openDialog('warning', "Invalid Range"); return;
      }
    } catch (e) { }
    let obj: any = { "status": 1, "rangeto": this.endip, "rangefrom": this.startip, "name": this.name };

    this.ccapi.postData('gateway/insert', obj).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);

        this.getGatewayips();
      }
      else
        this.ccapi.openDialog('warning', resp.message);
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));

  };
  saveGatewayips() {
    if (!this.ccapi.isvalidtext(this.name, "Enter Name")) return false;
    if (!this.isvalidip(this.startip)) { this.ccapi.openDialog('warning', "Invalid Start IP"); return; }
    if (!this.isvalidip(this.endip)) { this.ccapi.openDialog('warning', "Invalid End IP"); return; }

    try {
      if (parseFloat(this.startip.split('.')[0]) > parseFloat(this.endip.split('.')[0])) {
        this.ccapi.openDialog('warning', "Invalid Range"); return;
      }
      else if (parseFloat(this.startip.split('.')[0]) == parseFloat(this.endip.split('.')[0])
        && parseFloat(this.startip.split('.')[1]) > parseFloat(this.endip.split('.')[1])) {
        this.ccapi.openDialog('warning', "Invalid Range"); return;
      }
      else if (parseFloat(this.startip.split('.')[0]) == parseFloat(this.endip.split('.')[0])
        && parseFloat(this.startip.split('.')[1]) == parseFloat(this.endip.split('.')[1])
        && parseFloat(this.startip.split('.')[2]) > parseFloat(this.endip.split('.')[2])) {
        this.ccapi.openDialog('warning', "Invalid Range"); return;
      }
      else if (parseFloat(this.startip.split('.')[0]) == parseFloat(this.endip.split('.')[0])
        && parseFloat(this.startip.split('.')[1]) == parseFloat(this.endip.split('.')[1])
        && parseFloat(this.startip.split('.')[2]) == parseFloat(this.endip.split('.')[2])
        && parseFloat(this.startip.split('.')[3]) > parseFloat(this.endip.split('.')[3])) {
        this.ccapi.openDialog('warning', "Invalid Range"); return;
      }
    } catch (e) { }
    let obj = { "status": this.status, "rangeto": this.endip, "rangefrom": this.startip, "name": this.name, "sid": this.id };
    this.ccapi.postData('gateway/update', obj).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
        this.resetToSearch();
        this.getGatewayips();
      }
      else
        this.ccapi.openDialog('warning', resp.message);
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));
  };

  resetToSearch() {
    this.isAddOpen = true;
    this.isOpen = true;
    this.id = 0;
    this.name = "";
    this.status = 1;
    this.startip = "";
    this.endip = "";
  }
  toggle() {
    this.toggleadd(null);
    this.isOpen = !this.isOpen;
    this.isAddOpen = !this.isAddOpen;
  };
  toggleadd(obj) {
    if (obj == undefined || obj == null) {
      this.id = 0;
      this.name = "";
      this.status = 1;
      this.startip = "";
      this.endip = "";

    }
    else {
      this.id = obj.id;
      this.name = obj.name;
      this.status = obj.status;
      this.startip = obj.startip;
      this.endip = obj.endip;
    }
    this.isAddOpen = true;
    this.isOpen = false;
  }
  isvalidip(txt) {
    try {
      //127.0.0.1;
      if (txt.split('.').length != 4) {
        return false;
      }
      let _itms = txt.split('.');
      if (_itms[0].length == 0 || _itms[0].length > 3) return false;
      if (_itms[1].length == 0 || _itms[1].length > 3) return false;
      if (_itms[2].length == 0 || _itms[2].length > 3) return false;
      if (_itms[3].length == 0 || _itms[3].length > 3) return false;
      if (parseInt(_itms[0]) > 256 || parseInt(_itms[1]) > 256 || parseInt(_itms[2]) > 256 || parseInt(_itms[3]) > 256)
        return false;

    } catch (e) {

    }
    return true;
  }

  
}
