import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
//import { MsgdialogueboxComponent } from '../../../../shared/msgdialoguebox/msgdialoguebox.component';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { AddCategoriesComponent } from './add-categories/add-categories.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
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
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  displayedColumns: string[] = ["lang", "category", "channelName", "mainCategory", "sequence", "startPrice", "createdBy", "createdAt", "modifiedBy", "modifiedAt", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;

  public catObj: any;
  public searchString: any = "";

  constructor(private comm: CommonService, private router: Router, private dialog: MatDialog) {
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
    this.getCategories();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getCategories();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getCategories();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  ngOnInit() {
    this.pageObject.pageNo = 1;
    this.getCategories();
  }
  getCategories() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      search: this.searchString,
      start: start,
      length: this.pageObject.pageSize,
      orderDir: "desc"
    };
    this.comm.postData('catalog/catagorylist', requesrParams).subscribe((response: any) => {
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
  toggle() {
    this.isOpen = !this.isOpen;
  }
  createCategoryDialog(id: any): void {
    if (id == null && id == undefined) {
      this.catObj = {
        id: 0,
        rule: "",
        subcribertype: "",
        serviceclass: "",
        mode: "insert"
      }
      const dialogRef = this.dialog.open(AddCategoriesComponent, {
        width: '1050px',
        data: this.catObj
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
    else {
      var url = "user/getcategory/" + id;
      this.comm.postData(url, {}).subscribe((resp: any) => {
        if (resp.code == "200") {
          this.catObj = {
            id: id,
            rule: resp.data.rule,
            subcribertype: resp.data.subcribertype,
            serviceclass: resp.data.serviceclass,
            mode: "update"
          }
          const dialogRef = this.dialog.open(AddCategoriesComponent, {
            width: '850px',
            data: this.catObj,
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
          });
        }
        else {
          this.comm.openDialog('error', "Dear User, Currently we cannot process your request");
          return;
        }
      });
    }
  }

  deleteRule(obj1,obj2) { }
  getrules() {}
}
