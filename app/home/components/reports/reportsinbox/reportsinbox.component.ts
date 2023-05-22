//Added for #Jira id:DIGITAL-3447
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { CommonService } from '../../../../shared/services/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reportsinbox',
  templateUrl: './reportsinbox.component.html',
  styleUrls: ['./reportsinbox.component.css']
})
export class ReportsinboxComponent implements OnInit {
  displayedColumns: string[] = ["requestdatetime", "reporttype", "reportname", "status", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public statuslist: any[] = [   
    { "id": "1", "name": "Sucess", "label": "success" },
    { "id": "2", "name": "Pending", "label": "warning" }, 
    { "id": "3", "name": "Failed", "label": "danger" }]
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog) { }
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
    this.getreportslist();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getreportslist();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getreportslist();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.getreportslist();
  }
  getreportslist() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requestParams = {
      start: start,
      length: this.pageObject.pageSize,
      userid: this.ccapi.getUserId(),
      roleid: this.ccapi.get7digitRole(this.ccapi.getRole()),
      orderDir: "desc"
    }
    this.ccapi.postData('reports/inbox', requestParams).subscribe((response: any) => {
      this.ccapi.hidehttpspinner();
      if (response.code == "500") {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        this.dataSource.sort = this.sort;
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response.data != null && response.data.length > 0) {
          this.dataSource = new MatTableDataSource(response.data);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          this.dataSource.sort = this.sort;
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.dataSource.sort = this.sort;
          this.ccapi.openSnackBar("No Records Found");
        }
      }
    }, (err => {
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));
  };
  downloadfile(row: any) {  
    // window.open(this.ccapi.getUrl("reports/downloadbyid?id=" + row.id));
    window.open(this.ccapi.getUrl("reports/downloadreportinbox?req=" + row.downloadfilepath));
  }
  getstatus(val) {
    try {
      for (let i = 0; i < this.statuslist.length; i++) {
        if (this.statuslist[i].id == val) {
          return this.statuslist[i].name;
        }
      }
    } catch (e) { }
    return "";
  }
  getStatusLabel(val) {
    try {
      for (let i = 0; i < this.statuslist.length; i++) {
        if (this.statuslist[i].id == val) {
          return this.statuslist[i].label;
        }
      }
    } catch (e) { }
    return "default";
  }

}
