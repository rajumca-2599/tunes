import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonService } from '../../../../../shared/services/common.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { PageObject, OrderByObject } from '../../../../../shared/models/paging';


@Component({
  selector: 'app-trans-history',
  templateUrl: './trans-history.component.html',
  styleUrls: ['./trans-history.component.css']
})
export class TransHistoryComponent implements OnInit {
  displayedColumns: string[] = ["ruleId", "subscriberType", "serviceClass", "createdBy", "createdAt", "modifiedBy", "modifiedAt"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();

  @Input()
  msisdn: string = "";
  public reportrange = [new Date(2018, 3, 12, 20, 30), new Date(2018, 3, 22, 20, 30)];
  constructor(private _service: CommonService) { }
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  ngOnInit() {
    console.log(this.msisdn);
    this.getccaredetails();
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
    this.getccaredetails();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getccaredetails();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getccaredetails();
  }
  getccaredetails() {
    if (this.msisdn == "" || this.msisdn == undefined) {
      this._service.openDialog("error", "Msisdn is requied.");
    }
    else if (this.msisdn.length < 10 || this.msisdn.length > 12) {
      this._service.openDialog("error", "Invalid msisdn.");
    }
    else {
      let start = 1;
      if (this.pageObject.pageNo > 1)
        start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
      let requesrParams = {
        search: "",
        start: start,
        length: this.pageObject.pageSize,
        orderDir: "desc",
        msisdn:this.msisdn
      }
      this._service.postData('rules/ruleslist', requesrParams).subscribe((response: any) => {
        if (response.code == "500" && response.status == "error") {
          this._service.openDialog("warning", response.message);
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
  }
}
