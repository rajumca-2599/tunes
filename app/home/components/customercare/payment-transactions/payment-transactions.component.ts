import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { CommonService } from "../../../../shared/services/common.service";
import { PageObject, OrderByObject } from "../../../../shared/models/paging";
import { HttpErrorResponse } from "@angular/common/http";
import { formatDate } from "@angular/common";
import { TransactionstatusComponent } from "./transactionstatus/transactionstatus.component";
import { EnvService } from "../../../../shared/services/env.service";
@Component({
  selector: "app-payment-transactions",
  templateUrl: "./payment-transactions.component.html",
  styleUrls: ["./payment-transactions.component.css"],
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
export class PaymentTransactionsComponent implements OnInit {
  public msisdn: string = "";
  public transid: string = "";
  public rceiptid: string = "";
  displayedColumnsReports = [];
  columns = [];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  datacolumns: any = [];
  reportid = "1";
  reportnameList: any[] = [];
  last30days = false;
  staticcolumns = ["actions"];
  public statuslist: any;
  constructor(
    private ccapi: CommonService,
    private dialog: MatDialog,
    private env: EnvService
  ) {
    this.pageObject.pageSize = 25;
    this.statuslist = this.env.customerCareStaus;
  }

  ngOnInit() {
    this.pageObject.pageNo = 1;
    this.getprofile();
    this.getpaymenttransactions();
  }
  toggle() {
    this.isOpen = !this.isOpen;
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
    this.getpaymenttransactions();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getpaymenttransactions();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getpaymenttransactions();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  getpaymenttransactions() {
    let name = "msisdn";
    let start = 0;
    if (this.msisdn !== "" && this.msisdn.length > 0) {
      if (this.msisdn.indexOf("620") == 0) {
        this.ccapi.openDialog("error", "Invalid msisdn.");
        return;
      }
      if (this.msisdn.indexOf("0") == 0) {
        let _tmp = this.msisdn + "";
        _tmp = _tmp.substring(1);
        this.msisdn = this.env.countrycode + _tmp;
      } else if (this.msisdn.indexOf(this.env.countrycode) != 0) {
        let _tmp = this.env.countrycode + this.msisdn;
        if (_tmp.length > this.env.msisdnmaxlength) {
          this.ccapi.openDialog(
            "error",
            "Mobile number should be less than. " + this.env.msisdnmaxlength
          );
          return;
        }
        this.msisdn = this.env.countrycode + this.msisdn;
      }
    }
    let _datecolumn = "datetime";
    try {
      let _rpid = this.reportid;
      let _tmp = this.reportnameList.filter(function (ele, idx) {
        return ele.reportid == _rpid;
      });
      if (_tmp != null && _tmp.length > 0) {
        _datecolumn = _tmp[0].datecolumn;
      }
    } catch (e) { }

    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize;
    let startdate;
    let enddate;
    var today = new Date();
    if (this.transid != "") {
      enddate = startdate =
        "20" +
        this.transid.substring(8, 10) +
        "-" +
        this.transid.substring(6, 8) +
        "-" +
        this.transid.substring(4, 6);
    } else {
      var days = 180;
      var dd = new Date(new Date().setDate(new Date().getDate() - days));
      let smonth = Number((dd.getMonth() + 1).toString());
      let date = dd.getDate();
      let sdate = date < 10 ? "0" + date : date;
      let edate =
        today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
      let emonth = Number((today.getMonth() + 1).toString());

      let currsmonth = smonth < 10 ? "0" + smonth : smonth;
      let curremonth = emonth < 10 ? "0" + emonth : emonth;

      startdate = dd.getFullYear() + "-" + currsmonth + "-" + sdate;
      enddate = today.getFullYear() + "-" + curremonth + "-" + edate;
    }
    let filter = [];
    if (this.transid != "") {
      filter = [{ fieldName: "transid", fieldValue: this.transid }];
    }
    if (this.msisdn != "") {
      filter = [{ fieldName: "tomsisdn", fieldValue: this.msisdn }];
    }
    if (this.rceiptid != "") {
      filter = [{ fieldName: "receiptnum", fieldValue: this.rceiptid }];
    }
    var reqObject = {
      reportId: this.reportid,
      dateFilter: {
        dateStart: startdate,
        dateEnd: enddate,
      },
      paginationInfo: {
        start: start,
        end: 25,
      },
      orderByInfo: {
        fieldName: _datecolumn,
        order: "DESC",
      },

      // fulltextsearch: "",if
      filter: filter,
    };
    this.displayedColumnsReports = [];
    this.datacolumns = [];
    this.ccapi
      .postData("esreports/generateReport", reqObject)
      .toPromise()
      .then((response: any) => {
        
        // console.log(response);
        // console.log(response);
        if (
          response != null &&
          response.code != null &&
          response.code == "500"
        ) {
          this.ccapi.openDialog("warning", response.message);
          return;
        } else if (
          response != null &&
          response.code != null &&
          response.code == "200"
        ) {
          try {
            var _json = JSON.parse(response.data);
            console.log(_json,"parse")
            response.transactionInfo = _json;
           
          } catch (e) { }
          if (
            response.transactionInfo != null &&
            response.transactionInfo.transactions != null &&
            response.transactionInfo.transactions.length > 0
          ) {
            let _reportdispfiled = null;

            for (let a = 0; a < this.reportnameList.length; a++) {
              if (this.reportnameList[a].reportid == this.reportid) {
                _reportdispfiled = this.reportnameList[a];
                break;
              }
            }
            if (_reportdispfiled != null) {
              this.datacolumns = [];
              this.columns = [];
              for (let i = 0; i < _reportdispfiled.displayfields.length; i++) {
          
                let obj: any = _reportdispfiled.displayfields[i];
                let field = obj.key;
                if (this.datacolumns.indexOf(field) == -1) {
                  //this.displayedColumnsReports.push(field);
                  if (field != "") 
                  this.datacolumns.push(obj);
                  this.columns.push(field);
                }
              }
              this.dataSource = new MatTableDataSource(
                response.transactionInfo.transactions
              );

              this.displayedColumnsReports =
                this.displayedColumnsReports.concat(this.columns.map((x) => x));
              this.displayedColumnsReports.push("actions");
              console.log(this.displayedColumnsReports);
              console.log(this.columns);
              console.log(this.datacolumns);
              this.pageObject.totalRecords = response.transactionInfo.numFound;
              this.pageObject.totalPages = response.transactionInfo.numFound;
              // response.transactionInfo.transactions.length;
            }
            } else {
              this.ccapi.openDialog("warning", "No Records Found");
          }
        }
      })
      .catch((error: HttpErrorResponse) => {
        this.ccapi.HandleHTTPError(error);
      });
  }
  getdatafromrow(row, idx) {
    try {
      let _datacol = this.datacolumns[idx];
      if (_datacol != null && _datacol.key != "status") {
        return row[_datacol.key];
      }
      else {
        var status = this.statuslist.filter(x => x.key == row[_datacol.key])[0].value;
        return status;
      }
    } catch (e) {
      console.log(e);
    }
    return "";
  }
  getprofile() {
    try {
      this.reportnameList = JSON.parse(
        this.ccapi.getSession("masterconfig")
      ).paymenttransactionreports;
      //this.reportid = this.reportnameList[0].reportid;
    } catch (e) { }
  }
  openmappingdialog(transid, usertype) {
    let data = { transid: transid, usertype: usertype };
    const dialogRef = this.dialog.open(TransactionstatusComponent, {
      width: "850px",
      minHeight: "450px",
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.getpaymenttransactions();
      }
      console.log("The dialog was closed");
    });
  }
}
