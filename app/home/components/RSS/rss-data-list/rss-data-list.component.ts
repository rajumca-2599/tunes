import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "../../../../../../src/app/shared/services/common.service";
import { PageObject, OrderByObject } from "../../../../shared/models/paging";
import { ViewDataComponent } from "../view-data/view-data.component";
@Component({
  selector: "app-rss-data-list",
  templateUrl: "./rss-data-list.component.html",
  animations: [
    trigger("openClose", [
      state(
        "open",
        style({
          display: "block",
          opacity: 1,
        })
      ),
      state(
        "closed",
        style({
          display: "none",
          opacity: 0,
        })
      ),
      transition("open => closed", [animate("0.4s")]),
      transition("closed => open", [animate("0.3s")]),
    ]),
  ],
  styleUrls: ["./rss-data-list.component.css"],
})
export class RssDataListComponent implements OnInit {
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  public Obj: any;
  displayedColumns: string[] = ["category","feedcategory","partner","partner_image", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  id = "";
  constructor(
    private ccapi: CommonService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private activeRoute: ActivatedRoute
  ) {}

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
    this.getrssList();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getrssList();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getrssList();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.userpermissions = this.ccapi.getpermissions("");
    this.dataSource.sort = this.sort;
    this.id = this.activeRoute.snapshot.params["id"];
    this.pageObject.pageNo = 1;
    this.getrssList();
  }
  getrssList() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      start: start,
      length: this.pageObject.pageSize,
      roleid: this.ccapi.getRole(),
      userId: this.ccapi.getUserId(),
      id: this.id,
    };
    this.spinner.show();
    this.ccapi.postData("rss/getdata", requesrParams).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.code == "500") {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.dataSource.sort = this.sort;

          this.ccapi.openDialog("warning", response.message);
          return;
        } else if (
          response.code == "200" &&
          response.status.toLowerCase() == "success"
        ) {
          if (
            response &&
            response.rssInfos != null &&
            response.rssInfos.length > 0
          ) {
            this.dataSource = new MatTableDataSource(response.rssInfos);
            this.pageObject.totalRecords = response.recordsTotal;
            this.pageObject.totalPages = response.recordsFiltered;
            this.dataSource.sort = this.sort;
          } else {
            this.dataSource = new MatTableDataSource([]);
            this.pageObject.totalRecords = 0;
            this.dataSource.sort = this.sort;

            this.pageObject.totalPages = 0;
            this.ccapi.openSnackBar("No Records Found");
          }
        }
      },
      (error) => {
        this.spinner.hide();
        this.ccapi.HandleHTTPError(error);
      }
    );
  }
  getstatustext(id) {
    if (id == 1) return "Active";
    else return "Inactive";
  }
  naviagtetoRssMaster() {
    this.router.navigate(["home/rssmaster"]);
  }
  viewOptions(data: any) {
    var obj = {
      options: data.items,
    };
    const dialogRef = this.dialog.open(ViewDataComponent, {
      width: "850px",
      data: obj,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      if (result != undefined) {
      }
    });
  }
}
