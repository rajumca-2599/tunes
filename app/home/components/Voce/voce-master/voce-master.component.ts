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
import { AddVoceMasterComponent } from "./add-voce-master/add-voce-master.component";
import { formatDate } from "@angular/common";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

@Component({
  selector: "app-voce-master",
  templateUrl: "./voce-master.component.html",
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
  styleUrls: ["./voce-master.component.css"],
})
export class VoceMasterComponent implements OnInit {
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  displayedColumns: string[] = [
    "name",
    "description",
    "buttontext",
    "thanksmessage",
    "startdate",
    "enddate",
    "timespan",
    "status",
    "actions",
    "vocequestions",
    "eventmapping"
   
  ];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;

  public Obj: any;
  public searchString: any = "";
  NgxSpinnerService: any;
  status: any = 1;
 
  //enddate: Date = new Date();
  d = new Date();
  date = new Date();
  year = this.date.getFullYear();
  month = this.date.getMonth();
  day = this.date.getDate();
  startdate: Date =new Date(this.year - 1, this.month, this.day, 23, 59, 59);;
  enddate: Date = new Date();
  sdate:Date=new Date(this.year-1,this.month, this.day, 23, 59, 59)
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
    this.getvocemasterList();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getvocemasterList();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getvocemasterList();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.userpermissions = this.ccapi.getpermissions("");
    this.dataSource.sort = this.sort;

    this.pageObject.pageNo = 1;
    this.getvocemasterList();
  }
  getstatustext(id) {
    if (id == 1) return "Active";
    else return "Inactive";
  }
  createmasterDialog(obj: any): void {
    this.router.navigate(["home/addvoice"]);
  }

  editvoicemaster(row) {
    this.router.navigate(["home/addvoice/" + row.voceid]);
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  getvocemasterList() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      status: this.status,
      start: start,
      length: this.pageObject.pageSize,
      roleid: this.ccapi.getRole(),
      userId: this.ccapi.getUserId(),
      rangefrom: formatDate(this.startdate, "yyyy-MM-dd HH:mm:ss", "en-US", ""),
      rangeto: formatDate(this.enddate, "yyyy-MM-dd HH:mm:ss", "en-US", ""),
    };
    this.spinner.show();
    this.ccapi.postData("voce/getmaster", requesrParams).subscribe(
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
            response.addVoceMasters != null &&
            response.addVoceMasters.length > 0
          ) {
            this.dataSource = new MatTableDataSource(response.addVoceMasters);
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
  navigatetoQuestions(row) {
    this.router.navigate(["home/vocequestions/" + row.voceid]);
  }
  navigatetoevents() {
    this.router.navigate(["home/voceevents"]);
  }
}
