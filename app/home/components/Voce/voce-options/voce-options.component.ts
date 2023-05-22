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
import { EditOptionsComponent } from "./edit-options/edit-options.component";

@Component({
  selector: "app-voce-options",
  templateUrl: "./voce-options.component.html",
  styleUrls: ["./voce-options.component.css"],
})
export class VoceOptionsComponent implements OnInit {
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  displayedColumns: string[] = ["title", "engtitle", "buttontext", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;

  public Obj: any;
  public searchString: any = "";
  NgxSpinnerService: any;
  status: any = 1;
  voceid: string = "";
  questionId: string = "";
  type: string = "";
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
    this.getvoceOptionsList();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getvoceOptionsList();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getvoceOptionsList();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.userpermissions = this.ccapi.getpermissions("");
    this.dataSource.sort = this.sort;
    this.voceid = this.activeRoute.snapshot.params["voceid"];
    this.questionId = this.activeRoute.snapshot.params["qid"];
    this.type = this.activeRoute.snapshot.params["type"];
    this.pageObject.pageNo = 1;
    this.getvoceOptionsList();
  }
  getstatustext(id) {
    if (id == 1) return "Active";
    else return "Inactive";
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  getvoceOptionsList() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      status: this.status,
      start: start,
      length: this.pageObject.pageSize,
      roleid: this.ccapi.getRole(),
      userId: this.ccapi.getUserId(),
      id: this.questionId,
    };
    this.spinner.show();
    this.ccapi.postData("voce/getoptions", requesrParams).subscribe(
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
            response.voceOptions != null &&
            response.voceOptions.length > 0
          ) {
            this.dataSource = new MatTableDataSource(response.voceOptions);
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
  createoptionDialog(): void {
    this.router.navigate([
      "home/addvoiceoptions/" +
        this.questionId +
        "/" +
        this.voceid +
        "/" +
        this.type +
        "/" +
        "0",
    ]);
  }
  editvoiceOptions(row) {
    if (this.type == "0")
      this.router.navigate([
        "home/addvoiceoptions/" +
          this.questionId +
          "/" +
          this.voceid +
          "/" +
          this.type +
          "/" +
          row.optid,
      ]);
    else {
      // this.router.navigate(['home/editvoiceoptions/' + row.qid +"/"+this.voceid +"/"+this.type+"/"+row.optid ]);
      var obj = {
        qid: this.questionId,
        voiceid: this.voceid,
        type: this.type,
        optid: row.optid,
      };
      const dialogRef = this.dialog.open(EditOptionsComponent, {
        width: "850px",
        data: obj,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
        if (result != undefined) {
          this.getvoceOptionsList();
        }
      });
    }
  }
  loadTitle(list: any): string {
    let str = "";
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].language == "en") {
          str = list[i].title;
          break;
        }
      }
    }
    return str;
  }
  navigatetoQuestions() {
    this.router.navigate(["home/vocequestions/" + this.voceid]);
  }
}
