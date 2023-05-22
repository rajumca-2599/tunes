import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { CommonService } from "../../../../../shared/services/common.service";
import { PageObject, OrderByObject } from "../../../../../shared/models/paging";
import { HttpErrorResponse } from "@angular/common/http";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { EnvService } from "../../../../../shared/services/env.service";
@Component({
  selector: "app-transactionstatus",
  templateUrl: "./transactionstatus.component.html",
  styleUrls: ["./transactionstatus.component.css"],
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
})
export class TransactionstatusComponent implements OnInit {
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  transId = "";
  usertype = "";
  transstatuslist: any;
  billDesklist: any;
  imiTransactionlist: any;
  pyroTransStatuslist: any;
  public selectedtab: number = 0;
  // pyrocolumns: any=[];
  // pyrocolumnsdata: any=[];
  displayedColumnsReports = [];
  columns = [];
  datacolumns: any = [];
  constructor(
    private ccapi: CommonService,
    private activeRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<TransactionstatusComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private dialog: MatDialog,
    private env: EnvService,
   
  ) {
    this.transId = data.transid;
    this.usertype = data.usertype;
  }

  ngOnInit() {
    this.pageObject.pageNo = 1;
    //this.transId = this.activeRoute.snapshot.params["tid"];
    //this.usertype = this.activeRoute.snapshot.params["usertype"];
    // this.transId = "IGSM061221100437";
    // this.usertype = "PREPAID";
    this.gettransstatus();
  }
  gettransstatus() {
    this.ccapi.showhttpspinner();
    let requesrParams = {
      transid: this.transId,
      usertype: this.usertype,
    };
    this.ccapi
      .postData("trans/status", requesrParams)
      .subscribe((response: any) => {
        this.ccapi.hidehttpspinner();
        if (response.code == "500" && response.status == "error") {
          this.ccapi.openDialog("warning", response.message);
          return;
        } else if (
          response.code == "200" &&
          response.status.toLowerCase() == "success"
        ) {
          if (response && response.data && response.data) {
            this.transstatuslist = response.data;
            this.billDesklist = response.data.billDesk;
            this.imiTransactionlist = response.data.imiTransaction;
            this.pyroTransStatuslist = response.data.pyroTransStatus;
          } else {
            this.ccapi.openDialog("warning", response.message);
          }
        }
      });
  }
  tabChangeEvent(tab) {
    this.selectedtab = tab;
    // if(tab==3)
    // window.open("https://mybsnl.bsnl.co.in/api/v2/template/get?type=HelpPS","_self")
  }
  close() {
    this.dialogRef.close();
  }
  opennewtab() {
    window.open(this.env.transactionhelpurl);
  }
}
