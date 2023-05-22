import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.component.html',
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
  styleUrls: ['./page-list.component.css']
})
export class PageListComponent implements OnInit {
  displayedColumns: string[] = ["pageid", "pagename", "status", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();

  public isOpen: any = true;
  public pageObj: any;
  public searchString: any = "";
  public listData: any;

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
    this.getpages();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getpages();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getpages();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit() {
    this.pageObject.pageNo = 1;
    this.getpages();
  }

  getpages() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      orderDir: "desc",
      search: this.searchString,
      start: start,
      length: this.pageObject.pageSize
    }
    this.listData = [{
      pageid: '1', pagename: 'Home Page ',status: '2', 
      createdBy: "venkat_ccare26", createdAt: "2019-07-03 10:24:11",
      modifiedBy: "venkat_ccare26", modifiedAt: "2019-07-03 11:24:11"
    },
    {
      pageid: '2', pagename:'My Accounts Details Page',status: '1',
      createdBy: "venkat_ccare26", createdAt: "2019-07-03 10:24:11",
      modifiedBy: "venkat_ccare26", modifiedAt: "2019-07-03 11:24:11"
    }];
    this.dataSource = new MatTableDataSource(this.listData);
    this.pageObject.totalRecords = 2;
    this.pageObject.totalPages = 2;
    //this.ccapi.postData('pages/getpage', requesrParams).subscribe((response: any) => {
    //  if (response.code == "500" && response.status == "error") {
    //    this.ccapi.openDialog("warning", response.message);
    //    return;
    //  }
    //  else if (response.code == "200" && response.status.toLowerCase() == "success") {
    //    if (response && response.data && response.data) {
    //      this.dataSource = new MatTableDataSource(response.data);
    //      this.pageObject.totalRecords = response.recordsTotal;
    //      this.pageObject.totalPages = response.recordsFiltered;
    //    }
    //    else {
    //      this.dataSource = new MatTableDataSource([]);
    //      this.pageObject.totalRecords = 0;
    //      this.pageObject.totalPages = 0;
    //    }
    //  }
    //});
  };
  getStatus(status: any): string {
    if (status == "1") return "STAGING";
    else if (status == "2")  return "PUBLISH";
    else if (status == "3") return "WAITING";
    else return "";
  };
  toggle() {
    this.isOpen = !this.isOpen;
  }
  //editPage(pageid:number) {
  //  this.router.navigate(["home/modules", pageid]);
  //}
}
