import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { CommonService } from '../../../../shared/services/common.service';
import { Router } from '@angular/router';
import { PageObject, OrderByObject } from '../../userslist/userslist.component';

@Component({
  selector: 'app-packagelist',
  templateUrl: './packagelist.component.html',
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
  styleUrls: ['./packagelist.component.css']
})
export class PackagelistComponent implements OnInit {
  displayedColumns: string[] = ["lang", "packName", "pvrCode", "keyword", "prefix", "tarrifOriginal", "createdBy", "createdAt", "modifiedBy", "modifiedAt", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;

  public packageObj: any;
  public searchString: any = "";
  constructor(private comm: CommonService, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.pageObject.pageNo = 1;
    this.getPackageList();
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
    this.getPackageList();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getPackageList();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.orderDir = column.direction;
    this.getPackageList();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  toggle() {
    this.isOpen = !this.isOpen;
  }
  getPackageList() {
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
    this.comm.postData('catalog/packslist', requesrParams).subscribe((response: any) => {
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
    this.router.navigate(['home/addpackage']);
  }
  deletePackage(obj1, obj2) { }
}
