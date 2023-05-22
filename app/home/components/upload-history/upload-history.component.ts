import { Component, OnInit, Input, ViewChild, Inject } from "@angular/core";
import { CommonService } from "../../../shared/services/common.service";
import {
  MatTableDataSource,
  MatPaginator,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { PageObject, OrderByObject } from "../../../shared/models/paging";

@Component({
  selector: "app-upload-history",
  templateUrl: "./upload-history.component.html",
  styleUrls: ["./upload-history.component.css"],
})
export class UploadHistoryComponent implements OnInit {
  displayedColumns: string[] = [
    "filename",
    "description",
    "createdon",
    "total",
    "success",
    "failure",
  ];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  moduleid = "";
  public packagetype = "packageattributes";
  public packagetypelist = [
    { id: "packageattributes", name: "PackageAttributes" },
    { id: "packagemapping", name: "PackageMapping" },
    { id: "packagemaster", name: "Package Master" },
  ];
  constructor(
    private _service: CommonService,
    private dialogRef: MatDialogRef<UploadHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.moduleid = data;
  }
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  ngOnInit() {
    console.log(this.moduleid);
    this.getfilehistory();
  }
  changePage(page: number) {
    if (page) {
      this.pageObject.pageNo = page;
      this.paginator.pageIndex = page - 1;
      this.getPage({ pageIndex: this.pageObject.pageNo });
    }
  }

  changePageSize(obj) {
    this.pageObject.pageNo = 0;
    this.pageObject.pageSize = obj.pageSize;
    this.getfilehistory();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getfilehistory();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getfilehistory();
  }
  getfilehistory() {
    var reqtype = this.moduleid;
    if (this.moduleid == "Packages") reqtype = this.packagetype;
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      start: start,
      length: this.pageObject.pageSize,
      orderDir: "desc",
      moduleid: reqtype,
    };
    this._service
      .postData("files/history", requesrParams)
      .subscribe((response: any) => {
        if (response.code == "500" && response.status == "error") {
          this._service.openDialog("warning", response.message);
          return;
        } else if (
          response.code == "200" &&
          response.status.toLowerCase() == "success"
        ) {
          if (response && response.filedata && response.filedata) {
            this.dataSource = new MatTableDataSource(response.filedata);
            this.pageObject.totalRecords = response.recordsTotal;
            this.pageObject.totalPages = response.recordsFiltered;
          } else {
            this.dataSource = new MatTableDataSource([]);
            this.pageObject.totalRecords = 0;
            this.pageObject.totalPages = 0;
          }
        }
      });
  }
  close() {
    this.dialogRef.close();
  }
}
