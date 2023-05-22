import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "../../../../shared/services/common.service";
import { PageObject, OrderByObject } from "../../../../shared/models/paging";
import { AddVoceQuestionsComponent } from "./add-voce-questions/add-voce-questions.component";

@Component({
  selector: "app-voce-questions",
  templateUrl: "./voce-questions.component.html",
  styleUrls: ["./voce-questions.component.css"],
})
export class VoceQuestionsComponent implements OnInit {
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  displayedColumns: string[] = [
    "name",
    "description",
    "type",   
    "category",
    // "language",
    "startdate",
    "enddate",
    "status",
    "actions",
    "voceoptions",
  ];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;

  public Obj: any;
  public searchString: any = "";
  NgxSpinnerService: any;
  status: any = 1;
  voceid = "";
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
    this.getvoceQuestionsList();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getvoceQuestionsList();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getvoceQuestionsList();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.userpermissions = this.ccapi.getpermissions("");
    this.dataSource.sort = this.sort;
    this.voceid = this.activeRoute.snapshot.params["voceid"];
    this.pageObject.pageNo = 1;
    this.getvoceQuestionsList();
  }
  getstatustext(id) {
    if (id == 1) return "Active";
    else return "Inactive";
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  getvoceQuestionsList() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      status: this.status,
      search: this.searchString,
      start: start,
      length: this.pageObject.pageSize,
      roleid: this.ccapi.getRole(),
      userId: this.ccapi.getUserId(),
      id: this.voceid,
    };
    this.spinner.show();
    this.ccapi.postData("voce/getquestions", requesrParams).subscribe(
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
            response.voceQuestions != null &&
            response.voceQuestions.length > 0
          ) {
            this.dataSource = new MatTableDataSource(response.voceQuestions);
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
  createquestionDialog(obj: any): void {
    this.router.navigate(["home/addvoicequestions/" + this.voceid + "/" + "0"]);
  }
  editvoicequestion(row) {
    this.router.navigate([
      "home/addvoicequestions/" + this.voceid + "/" + row.qid,
    ]);
  }
  editvoiceoption(row) {
    this.router.navigate([
      "home/voceoptions/" + row.qid + "/" + row.voceid + "/" + row.type,
    ]);
  }
  naviagtetoMaster() {
    this.router.navigate(["home/vocemaster"]);
  }
}
