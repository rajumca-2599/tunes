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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-popularpackages',
  templateUrl: './popularpackages.component.html',
  styleUrls: ['./popularpackages.component.css']
})
export class PopularpackagesComponent implements OnInit {
  searchString: any = "";
  private _dialog2: Subscription;
  displayedColumns: string[] = ["usertype", "category", "range", "product", "actions"];
  ranges: any[] = ["0-100", "101-200", "201-500", "501-1000", "1001-10000"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public isAddOpen: any = false;
  usertype: any = "PREPAID";
  range: any = "";
  category: any = "CONTENT";
  product: any = "";
  mode: any = "insert";
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

  ngOnInit() {
    try {
      this.ranges = JSON.parse(this.ccapi.getSession("masterconfig")).arpuranges;

    } catch (e) { }
    this.dataSource.sort = this.sort;
    this.pageObject.pageNo = 1;
    this.getPlatfmSettings();
  };
  getPlatfmSettingsList() {
    this.paginator.pageIndex = 0;
    this.pageObject.pageNo = 1;
    this.getPlatfmSettings();
  }
  getPlatfmSettings() {
    this.searchString = this.ccapi.trimtext(this.searchString);
    this.usertype = "PREPAID";
    this.range = "";
    this.product = "";
    this.category = "CONTENT";
    this.mode = 'insert';
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      search: this.ccapi.trimtext(this.searchString),
      filterBy: "POPULARPACKS",
      start: start,
      length: this.pageObject.pageSize,
      orderDir: "desc"
    }
    //this.dataSource = new MatTableDataSource([]);
    //this.pageObject.totalRecords = 0;
    //this.pageObject.totalPages = 0;
    //this.dataSource.sort = this.sort;

    this.ccapi.postData('globalsettings/getall', requesrParams).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.data != null && response.data.length > 0) {
          let arr: any = [];
          for (let i = 0; i < response.data.length; i++) {
            try {
              var _itm = JSON.parse(JSON.stringify(response.data[i]));
              _itm.edited = false;
              let _key = _itm.keyword;
              _itm.usertype = _key.split('_')[0];
              _itm.category = _key.split('_')[1];
              _itm.range = _key.split('_')[2];
              _itm.product = _itm.value;
              arr.push(_itm);
            } catch (e) { }

          }

          this.dataSource = new MatTableDataSource(arr);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          this.dataSource.sort = this.sort;
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.ccapi.openSnackBar("No Records Found");
          this.dataSource.sort = this.sort;
        }
      }
    });
  };


  savepackages() {
    let _keyword = this.usertype + "_" + this.category + "_" + this.range;
    if (!this.ccapi.isvalidtext(this.product, "Enter Product")) return false;
    if (!this.ccapi.isvalidtext(this.usertype, "Select Usertype")) return false;
    if (!this.ccapi.isvalidtext(this.category, "Select Category")) return false;
    if (!this.ccapi.isvalidtext(this.range, "Select Range")) return false;
    this.product = this.product.trim();



    let obj = {
      "keyword": this.ccapi.trimtext(_keyword),
      "value": this.ccapi.trimtext(this.product),
      "description": this.ccapi.trimtext(_keyword),
      "group_name": this.ccapi.trimtext("POPULARPACKS")
    }

    this.ccapi.postData("globalsettings/update", obj).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', "Updated Successfully");
        this.getPlatfmSettings();
      }
      else
        this.ccapi.openDialog('warning', resp.message);
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }))
  };
  removepackages(row: any) {

    let obj = {
      "keyword": row.keyword,
      "value": row.value,
      "description": row.desc,
      "group_name": this.ccapi.trimtext("POPULARPACKS")
    }
    this.ccapi.postData("globalsettings/delete", obj).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', "Removed Successfully");
        this.getPlatfmSettings();
      }
      else
        this.ccapi.openDialog('warning', resp.message);
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }))
  };
  resetToSearch() {
    this.isAddOpen = false;
    this.isOpen = true;
    this.usertype = "PREPAID";
    this.range = "";
    this.product = "";
    this.category = "CONTENT";
  }
  toggle() {
    this.toggleadd(null);
    this.isOpen = !this.isOpen;
    this.isAddOpen = !this.isAddOpen;
    this.usertype = "PREPAID";
    this.range = "";
    this.product = "";
    this.category = "CONTENT";
    this.mode = 'insert';
  };
  toggleadd(obj) {
    this.isAddOpen = true;
    this.isOpen = false;
    this.usertype = "PREPAID";
    this.range = "";
    this.product = "";
    this.category = "CONTENT";
    this.mode = 'insert';
  }
  edititem(obj) {
    this.isAddOpen = true;
    this.isOpen = false;
    this.mode = "update";
    this.usertype = obj.usertype;
    this.range = obj.range;
    this.product = obj.product;
    this.category = obj.category;
  }
  validateproduct(event: KeyboardEvent) {
    let regex: RegExp = new RegExp(/[;'\\><(){}!|@#$%^&*+=~?/\\[\]\{\}^%#`"]/g);
    let specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];

    var keyCode = event.which || event.keyCode;

    if (keyCode == 9 || keyCode == 38 || keyCode == 39 || keyCode == 37 || keyCode == 40 || keyCode == 8 || keyCode == 46 || keyCode == 118) {
      return true;
    }
    if (keyCode == 32) return false;
    if (keyCode == 13) return false;
    if (event.ctrlKey) {
      if (event.key.toLowerCase() != 'c' && event.key.toLowerCase() != 'v' && event.key.toLowerCase() != 'x') {
        event.preventDefault();
        return false;
      }
    }
    else {
      if (specialKeys.indexOf(event.key) !== -1) {
        return true;
      }
      let current: string = this.product;
      let next: string = current.concat(event.key);
      if (next && String(next).match(regex)) {
        return false;
      }
    }
    return true;
  }

  showconfirm(reqtype, row) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      width: '400px',
      data: {
        message: 'Please click "YES" to process this request.',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });
    this._dialog2 = dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        if (reqtype == "add") {
          this.savepackages();
        }
        else if (reqtype == "remove") {
          this.removepackages(row);
        }

      }
    });
  }
}
