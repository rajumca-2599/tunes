import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { CommonService } from "../../../../../shared/services/common.service";
import { PageObject, OrderByObject } from "../../../../../shared/models/paging";
import { PackagesMappingComponent } from "../packages-mapping/packages-mapping.component";
import { PackageAttributesComponent } from "../package-attributes/package-attributes.component";
import { ConfirmDialogComponent } from "../../../../../shared/confirm-dialog/confirm-dialog.component";
import { Subscription } from "rxjs";
import { FileUploadComponent } from "../../../file-upload/file-upload.component";
import { UploadHistoryComponent } from "../../../upload-history/upload-history.component";
import { AddPackageComponent } from "../add-package/add-package.component";

@Component({
  selector: "app-packages-list",
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
  templateUrl: "./packages-list.component.html",
  styleUrls: ["./packages-list.component.css"],
})
export class PackagesListComponent implements OnInit {
  displayedColumns: string[] = [
    "code",
    "data",
    "voice",
    "sms",
    "validity",
    "info",
    "benfits",
    "actions",
  ];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  ciclesLst: any;
  circleid = "";
  categoryLst: any;
  subcategoryLst: any;
  categoryid = "";
  subcategoryid = "";
  public isOpen: any = true;
  lastupdatedon = "";
  public packageObj: any;
  public searchString: any = "";
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  constructor(private comm: CommonService, private dialog: MatDialog) {}

  ngOnInit() {
    this.userpermissions = this.comm.getpermissions("");
    this.pageObject.pageNo = 1;
    this.getPackagesList();
    this.getCircles();
    this.getCategories();
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
    this.getPackagesList();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getPackagesList();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getPackagesList();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  toggle() {
    this.isOpen = !this.isOpen;
  }
  getPackagesList() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      search: this.searchString,
      start: start,
      length: this.pageObject.pageSize,
      ordercolumn: this.orderByObject.ordercolumn,
      orderDir: "desc",
      circle: this.circleid,
      categoryid: this.subcategoryid,
    };
    this.comm
      .postData("packages/list", requesrParams)
      .subscribe((response: any) => {
        if (response.code == "500" && response.status == "error") {
          this.comm.openDialog("warning", response.message);
          return;
        } else if (
          response.code == "200" &&
          response.status.toLowerCase() == "success"
        ) {
          if (response && response.packages && response.packages) {
            this.dataSource = new MatTableDataSource(response.packages);
            this.pageObject.totalRecords = response.recordsTotal;
            this.pageObject.totalPages = response.recordsFiltered;
            this.lastupdatedon = response.lastupdatedon;
          } else {
            this.dataSource = new MatTableDataSource([]);
            this.pageObject.totalRecords = 0;
            this.pageObject.totalPages = 0;
          }
        }
      });
  }
  getCircles() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      start: start,
      length: this.pageObject.pageSize,
      ordercolumn: this.orderByObject.ordercolumn,
      orderDir: "desc",
    };
    this.comm
      .postData("packages/circle", requesrParams)
      .subscribe((response: any) => {
        if (
          response.code == "200" &&
          response.status.toLowerCase() == "success"
        ) {
          this.ciclesLst = response.circles;
        }
      });
  }
  getCategories() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      start: start,
      length: this.pageObject.pageSize,
      ordercolumn: this.orderByObject.ordercolumn,
      orderDir: "desc",
    };
    this.comm
      .postData("packages/categories", requesrParams)
      .subscribe((response: any) => {
        if (
          response.code == "200" &&
          response.status.toLowerCase() == "success"
        ) {
          this.categoryLst = response.categories;
        }
      });
  }
  getSubCategories() {
    this.categoryLst.forEach((element) => {
      if (element.catid == this.categoryid) {
        this.subcategoryLst = element.subcategories;
      }
    });
  }
  openmappingdialog(id: any): void {
    const dialogRef = this.dialog.open(PackagesMappingComponent, {
      width: "850px",
      minHeight: "450px",
      data: id,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getPackagesList();
      console.log("The dialog was closed");
    });
  }
  openattributedialog(id: any): void {
    const dialogRef = this.dialog.open(PackageAttributesComponent, {
      width: "850px",
      minHeight: "450px",
      data: id,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.getPackagesList();
      }
      console.log("The dialog was closed");
    });
  }
  openFileUploadDialog() {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: "650px",
      data: "Packages",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      this.getPackagesList();
    });
  }
  openHistory(): void {
    const dialogRef = this.dialog.open(UploadHistoryComponent, {
      width: "850px",
      data: "Packages",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      this.getPackagesList();
    });
  }
  createpackage(){
    var obj={};
    const dialogRef = this.dialog.open(AddPackageComponent, {
      width: "850px",
      data: obj,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      this.getPackagesList();
    }); 
  }
}
