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
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "../../../../shared/services/common.service";
import { PageObject, OrderByObject } from "../../../../shared/models/paging";
import { AddRssMasterComponent } from "../add-rss-master/add-rss-master.component";
import { EditRssTemplateComponent } from "../edit-rss-template/edit-rss-template.component";

@Component({
  selector: "app-rss-master",
  templateUrl: "./rss-master.component.html",
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
  styleUrls: ["./rss-master.component.css"],
})
export class RssMasterComponent implements OnInit {
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  public Obj: any;
  displayedColumns: string[] = [
    "name",
    // "description",
    "partnername",
    "category",
    "frequency",
    "last_refreshed_on",
    "status",
    "actions",
    "viewdata",
    "template",
    "rssdata",
    "refreshdata",
  ];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  constructor(
    private ccapi: CommonService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
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
    };
    this.spinner.show();
    this.ccapi.postData("rss/list", requesrParams).subscribe(
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
            response.rssmasters != null &&
            response.rssmasters.length > 0
          ) {
            response.rssmasters.forEach(element => {
              element.rssdata="1";
              element.refreshdata="2";
            });
            this.dataSource = new MatTableDataSource(response.rssmasters);
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
  createrss(data) {
    if (data == null && data == undefined) {
      this.Obj = {
        id: "",
        name: "",
        desc: "",
        status: 1,
        url: "",
        frequency: "",
        category: "",
        partnername: "",
        icon: "",
        mode: "insert",
      };
      const dialogRef = this.dialog.open(AddRssMasterComponent, {
        width: "1100px",
        height: "700px",
        data: this.Obj,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result != undefined) {
          this.getrssList();
        }
        console.log("The dialog was closed");
      });
    } else {
      this.Obj = {
        id: data.feedid,
        name: data.feed_name,
        desc: data.feed_description,
        status: data.status,
        url: data.feed_url,
        frequency: data.frequency,
        category: data.category,
        partnername: data.partner_name,
        icon: data.icon,
        promoimage: data.promo_banner,
        topimage: data.top_banner,
        mode: "update",
      };

      const dialogRef = this.dialog.open(AddRssMasterComponent, {
        width: "1100px",
        height: "700px",
        data: this.Obj,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result != undefined) {
          this.getrssList();
        }
        console.log("The dialog was closed");
      });
    }
  }
  openRssFeedUrl(url: any) {
    window.open(url);
  }
  createtemplate(data: any) {
    this.Obj = {
      id: data.feedid,
      category: data.category,
      mode: "update",
    };

    const dialogRef = this.dialog.open(EditRssTemplateComponent, {
      width: "1100px",
      height: "700px",
      data: this.Obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.getrssList();
      }
      console.log("The dialog was closed");
    });
  }
  navigatetoData(data: any) {
    this.router.navigate(["home/rssdata/" + data.feedid]);
  }
  refreshRSSData(rowdata: any) {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      start: start,
      length: this.pageObject.pageSize,
      roleid: this.ccapi.getRole(),
      userId: this.ccapi.getUserId(),
      id: rowdata.feedid,
    };
    this.spinner.show();
    let url = "/rss/refreshfeed";
    this.ccapi.postData(url, requesrParams).subscribe(
      (resp: any) => {
        this.spinner.hide();
        if (resp.code == "200" && resp.status == "success") {
          this.ccapi.openDialog("success", resp.message);
        } else {
          this.ccapi.openDialog("error", resp.message);
          // this.close();
        }
      },
      (err) => {
        this.ccapi.HandleHTTPError(err);
      }
    );
  }
}
