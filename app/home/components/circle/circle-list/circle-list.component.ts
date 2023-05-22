import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { CommonService } from '../../../../shared/services/common.service';
import { PageObject, OrderByObject } from "../../../../shared/models/paging";

@Component({
  selector: 'app-circle-list',
  templateUrl: './circle-list.component.html',
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
  styleUrls: ['./circle-list.component.css']
})
export class CircleListComponent implements OnInit {

  displayedColumns: string[] = ["circleid","circlecode","circlename","zoneid","zonename"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;

  public packageObj: any;
  public searchString: any = "";
  constructor(private comm: CommonService) {
  }

  ngOnInit() {
    this.pageObject.pageNo = 1;
    this.getCirclesList();
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
    this.getCirclesList();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getCirclesList();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getCirclesList();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  getCirclesList() {
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
    this.comm.postData('packages/circle', requesrParams).subscribe((response: any) => {
      if (response.code == "500" && response.status == "error") {
        this.comm.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200" && response.status.toLowerCase() == "success") {
        if (response && response.circles && response.circles) {
          this.dataSource = new MatTableDataSource(response.circles);
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
}