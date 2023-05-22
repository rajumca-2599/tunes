import { Component, OnInit, NgZone, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog, MatSpinner, fadeInContent } from "@angular/material";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { MatTableDataSource, MatPaginator } from "@angular/material";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { CommonService } from "../../../shared/services/common.service";
//import { MsgdialogueboxComponent } from '../../../../shared/msgdialoguebox/msgdialoguebox.component';
import { PageObject, OrderByObject } from "../../../shared/models/paging";
import { ConfirmDialogComponent } from "../../../shared/confirm-dialog/confirm-dialog.component";
import { MatSort } from "@angular/material/sort";
import { AddRuleComponent } from "../masters/rules/add-rule/add-rule.component";
import { AddBannergroupComponent } from "../assetmanagement/bannergroup/add-bannergroup/add-bannergroup.component";

@Component({
  selector: "app-publish",
  templateUrl: "./publish.component.html",
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
  styleUrls: ["./publish.component.css"],
})
export class PublishComponent implements OnInit {
  publishstatus: any = "1";
  publislist: any[] = [];
  publishstatuslist: any[] = [
    { id: "1", name: "Pending" },
    { id: "2", name: "Approved" },
    { id: "3", name: "Rejected" },
  ];

  displayedColumns: string[] = [
    "name",
    "type",
    "actions",
    "updatedon",
    "actions",
  ];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;

  public publishitemtype: any = "1";
  public ruleObj: any;
  public searchString: any = "";
  environment: any = 1;

  checked: boolean = false;

  constructor(
    private ccapi: CommonService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.publishitemtype = "1";
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
    this.getworkflowitems();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getworkflowitems();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getworkflowitems();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.publishstatus = "1";
    this.pageObject.pageNo = 1;
    this.dataSource.sort = this.sort;
    if (this.ccapi.getRole() == "101005") {
      this.publislist = [{ id: "3", name: "Alerts" }];
      this.publishitemtype = "3";
    } else {
      this.publislist = [
        { id: "1", name: "Banners" },
        { id: "2", name: "Banner Groups" },
        { id: "3", name: "Alerts" },
        { id: "4", name: "Rules" },
        { id: "5", name: "Pages" },
      ];
    }
    this.getworkflowitems();
  }
  getworkflowitemsList() {
    this.paginator.pageIndex = 0;
    this.pageObject.pageNo = 1;
    this.getworkflowitems();
  }
  getworkflowitems() {
    this.displayedColumns = ["name", "type", "updatedon", "actions"];
    if (this.publishstatus != "1")
      this.displayedColumns = ["name", "type", "updatedon"];
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      start: start,
      length: this.pageObject.pageSize,
      orderDir: "desc",
      status: this.publishstatus,
    };
    if (this.publishitemtype == "1") {
      this.displayedColumns = [
        "name",
        "bannerimage",
        "type",
        "updatedon",
        "actions",
      ];
      this.ccapi.postData("banners/getworkflowitems", requesrParams).subscribe(
        (response: any) => {
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            this.dataSource = new MatTableDataSource([]);
            this.pageObject.totalRecords = 0;
            this.pageObject.totalPages = 0;
            this.dataSource.sort = this.sort;

            return;
          } else if (response.code == "200") {
            this.parseworflowresponse(response);
          }
        },
        (err) => {
          console.log(err);
          this.ccapi.HandleHTTPError(err);
        }
      );
    } else if (this.publishitemtype == "2") {
      this.ccapi
        .postData("banners/getbannergroupworkflow", requesrParams)
        .subscribe(
          (response: any) => {
            if (response.code == "500") {
              this.ccapi.openDialog("warning", response.message);
              this.dataSource = new MatTableDataSource([]);
              this.pageObject.totalRecords = 0;
              this.pageObject.totalPages = 0;
              this.dataSource.sort = this.sort;

              return;
            } else if (response.code == "200") {
              this.parseworflowresponse(response);
            }
          },
          (err) => {
            console.log(err);
            this.ccapi.HandleHTTPError(err);
          }
        );
    } else if (this.publishitemtype == "3") {
      let requestalerts = {
        status: parseInt(this.publishstatus),
        type: 1,
        orderDir: "desc",
        start: start,
        length: this.pageObject.pageSize,
      };
      this.ccapi.postData("alerts/getalertworkflow", requestalerts).subscribe(
        (response: any) => {
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            this.dataSource = new MatTableDataSource([]);
            this.pageObject.totalRecords = 0;
            this.pageObject.totalPages = 0;
            this.dataSource.sort = this.sort;
            return;
          } else if (response.code == "200") {
            this.parseworflowresponse(response);
          }
        },
        (err) => {
          console.log(err);
          this.ccapi.HandleHTTPError(err);
        }
      );
    } else if (this.publishitemtype == "4") {
      let requestrules = {
        type: 1,
        status: parseInt(this.publishstatus),
        name: "",
        start: start,
        length: this.pageObject.pageSize,
        orderDir: "desc",
      };
      this.ccapi.postData("rules/getworkflowitems", requestrules).subscribe(
        (response: any) => {
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            this.dataSource = new MatTableDataSource([]);
            this.pageObject.totalRecords = 0;
            this.pageObject.totalPages = 0;
            this.dataSource.sort = this.sort;
            //return;
          } else if (response.code == "200") {
            this.parseworflowresponse(response);
          }
        },
        (err) => {
          this.ccapi.HandleHTTPError(err);
        }
      );
    } else if (this.publishitemtype == "5") {
      this.displayedColumns = [
        "pagename",
        "modulename",
        "updatedon",
        "actions",
      ];
      let requestpage = {
        search: "",
        start: start,
        length: this.pageObject.pageSize,
        orderDir: "desc",
        status: parseInt(this.publishstatus),
      };
      this.ccapi.postData("pages/getworkflows", requestpage).subscribe(
        (response: any) => {
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            this.dataSource = new MatTableDataSource([]);
            this.pageObject.totalRecords = 0;
            this.pageObject.totalPages = 0;
            this.dataSource.sort = this.sort;

            return;
          } else if (response.code == "200") {
            this.parseworflowresponse(response);
          }
        },
        (err) => {
          this.ccapi.HandleHTTPError(err);
        }
      );
    } else {
      this.ccapi.openDialog("warning", "Not Available");
    }
  }
  parseworflowresponse(response) {
    if (this.publishitemtype == "1") {
      if (
        response.banners != null &&
        response.banners.banners != null &&
        response.banners.banners.length > 0
      ) {
        this.dataSource = new MatTableDataSource(
          this.formbannerdatasoruce(response.banners.banners)
        );
        this.pageObject.totalRecords = response.recordsTotal;
        this.pageObject.totalPages = response.recordsFiltered;
        if (
          this.pageObject.totalRecords == null ||
          this.pageObject.totalRecords == undefined
        ) {
          this.pageObject.totalRecords = response.banners.banners.length.length;
          this.pageObject.totalPages = 1;
        }
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        this.dataSource.sort = this.sort;
        this.ccapi.openSnackBar("No Records Found");
      }
    } else if (this.publishitemtype == "2") {
      if (
        response.banners != null &&
        response.banners.banners != null &&
        response.banners.banners.length > 0
      ) {
        this.dataSource = new MatTableDataSource(
          this.formbannergroupdatasoruce(response.banners.banners)
        );
        this.pageObject.totalRecords = response.recordsTotal;
        this.dataSource.sort = this.sort;

        this.pageObject.totalPages = response.recordsFiltered;
        if (
          this.pageObject.totalRecords == null ||
          this.pageObject.totalRecords == undefined
        ) {
          this.pageObject.totalRecords = response.banners.banners.length;
          this.pageObject.totalPages = 1;
        }
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        this.dataSource.sort = this.sort;
        this.ccapi.openSnackBar("No Records Found");
      }
    } else if (this.publishitemtype == "3") {
      if (response.alertdata != null && response.alertdata.length > 0) {
        if (this.ccapi.getRole() == "101005") {
          var list;
          list = this.formalertdatasource(response.alertdata);
          this.dataSource = new MatTableDataSource(list);
          this.pageObject.totalRecords = list.count;
        } else {
          this.dataSource = new MatTableDataSource(
            this.formalertdatasource(response.alertdata)
          );

          this.pageObject.totalRecords = response.recordsTotal;
        }

        this.pageObject.totalPages = response.recordsFiltered;
        this.dataSource.sort = this.sort;

        if (
          this.pageObject.totalRecords == null ||
          this.pageObject.totalRecords == undefined
        ) {
          this.pageObject.totalRecords = response.alertdata.length;
          this.pageObject.totalPages = 1;
        }
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        this.ccapi.openSnackBar("No Records Found");
      }
    } else if (this.publishitemtype == "4") {
      if (response.rules != null && response.rules.length > 0) {
        this.dataSource = new MatTableDataSource(
          this.formrules(response.rules)
        );
        this.pageObject.totalRecords = response.recordsTotal;
        this.pageObject.totalPages = response.recordsFiltered;
        this.dataSource.sort = this.sort;

        if (
          this.pageObject.totalRecords == null ||
          this.pageObject.totalRecords == undefined
        ) {
          this.pageObject.totalRecords = response.alertdata.length;
          this.pageObject.totalPages = 1;
        }
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        this.ccapi.openSnackBar("No Records Found");
      }
    } else if (this.publishitemtype == "5") {
      if (response.data != null && response.data.length > 0) {
        this.dataSource = new MatTableDataSource(this.formpages(response.data));
        this.pageObject.totalRecords = response.recordsTotal;
        this.pageObject.totalPages = response.recordsFiltered;
        this.dataSource.sort = this.sort;

        if (
          this.pageObject.totalRecords == null ||
          this.pageObject.totalRecords == undefined
        ) {
          this.pageObject.totalRecords = response.data.length;
          this.pageObject.totalPages = 1;
        }
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        this.ccapi.openSnackBar("No Records Found");
      }
    }
  }
  banners: any = [];
  formbannerdatasoruce(banners) {
    try {
      for (var i = 0; i < banners.length; i++) {
        var _obj = JSON.parse(banners[i].updatejson);
        banners[i].select = false;
        banners[i].name = _obj.vcname;
        switch (_obj.type + "") {
          case "1":
            banners[i].type = "Card";
            break;
          case "2":
            banners[i].type = "Full";
            break;
          case "3":
            banners[i].type = "Top Banner";
            break;
        }
        banners[i].updatedon = _obj.createdat;

        banners[i].bannerimage = this.getimagetid(
          _obj.bannerDetailsMap[0].uploadid
        );
      }
      this.banners = banners;
      return banners;
    } catch (e) {
      console.log(e);
      this.ccapi.openDialog(
        "warning",
        "Unable to Show the details. Please try again later"
      );
      return [];
    }
  }
  formalertdatasource(alerts) {
    try {
      var itemlist: any[] = [];
      for (var i = 0; i < alerts.length; i++) {
        try {
          var _obj = JSON.parse(alerts[i].updatejson);
          alerts[i].select = false;
          alerts[i].name = _obj.rule;
          switch (_obj.type + "") {
            case "1":
              alerts[i].type = "Multi Alert";
              break;
            case "2":
              alerts[i].type = "Smart Alert";
              break;
            case "3":
              alerts[i].type = "Pro Tip";
              break;
            case "4":
              alerts[i].type = "Tool Tip";
              break;
            case "5":
              alerts[i].type = "Push Notifications";
              break;
          }
          alerts[i].reqalerttype = _obj.rules[0].type;
          alerts[i].status = _obj.status;
          alerts[i].updatedon = _obj.createdat;
          if (this.ccapi.getRole() == "101005") {
            if (alerts[i].type == "Pro Tip") itemlist.push(alerts[i]);
          } else itemlist.push(alerts[i]);
        } catch (e) {}
      }
      return itemlist;
    } catch (e) {
      console.log(e);
      this.ccapi.openDialog(
        "warning",
        "Unable to Show the details. Please try again later"
      );
      return [];
    }
  }

  formrules(rules) {
    try {
      var itemlist: any[] = [];
      for (var i = 0; i < rules.length; i++) {
        try {
          var _obj = JSON.parse(rules[i].updatejson);
          rules[i].select = false;
          rules[i].type = "Rules";
          rules[i].name = _obj.ruleid;
          rules[i].status = _obj.status;
          rules[i].updatedon = _obj.createdat;
          itemlist.push(rules[i]);
        } catch (e) {}
      }
      return itemlist;
    } catch (e) {
      console.log(e);
      this.ccapi.openDialog(
        "warning",
        "Unable to Show the details. Please try again later"
      );
      return [];
    }
  }

  formpages(rules) {
    try {
      var itemlist: any[] = [];
      for (var i = 0; i < rules.length; i++) {
        try {
          var _obj = JSON.parse(rules[i].json);
          rules[i].select = false;
          rules[i].type = "Pages";
          rules[i].name = _obj.moduleid;
          rules[i].status = _obj.status;
          rules[i].pagename = _obj.pagename;
          rules[i].modulename = _obj.modulename;
          rules[i].updatedon = "";
          itemlist.push(rules[i]);
        } catch (e) {}
      }
      return itemlist;
    } catch (e) {
      console.log(e);
      this.ccapi.openDialog(
        "warning",
        "Unable to Show the details. Please try again later"
      );
      return [];
    }
  }

  formbannergroupdatasoruce(banners) {
    try {
      for (var i = 0; i < banners.length; i++) {
        var _obj = JSON.parse(banners[i].updatejson);
        banners[i].select = false;
        banners[i].name = _obj.title;
        banners[i].bannergroupid = _obj.bannergroupid;
        switch (_obj.type + "") {
          case "1":
            banners[i].type = "Card";
            break;
          case "2":
            banners[i].type = "Full";
            break;
          case "3":
            banners[i].type = "Top Banner";
            break;
        }
        banners[i].updatedon = _obj.createdat;
      }
      this.banners = banners;
      return banners;
    } catch (e) {
      console.log(e);
      this.ccapi.openDialog(
        "warning",
        "Unable to Show the details. Please try again later"
      );
      return [];
    }
  }

  deleteRule(id: number, name: string): void {}
  approvelist() {
    try {
      if (this.publishitemtype == "1") {
        for (var i = 0; i < this.banners.length; i++) {
          if (this.banners[i].select) {
            this.approve(this.banners[i]);
            break;
          }
        }
      } else {
        this.ccapi.openDialog("warning", "Not Available");
      }
    } catch (e) {}
  }
  rejectlist() {
    try {
      if (this.publishitemtype == "1") {
        for (var i = 0; i < this.banners.length; i++) {
          if (this.banners[i].select) {
            this.reject(this.banners[i]);
            break;
          }
        }
      } else {
        this.ccapi.openDialog("warning", "Not Available");
      }
    } catch (e) {}
  }
  approve(row) {
    if (this.publishitemtype == "1") {
      var requesrParams = {
        bannerid: row.bannerid,
      };
      this.ccapi.postData("banners/approveworkflow", requesrParams).subscribe(
        (response: any) => {
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            return;
          } else if (
            response.code == "200" &&
            response.status.toLowerCase() == "success"
          ) {
            this.ccapi.openDialog("success", "Approved Successfully");
            this.getworkflowitems();
          }
        },
        (err) => {
          console.log(err);
          this.ccapi.HandleHTTPError(err);
        }
      );
    } else if (this.publishitemtype == "2") {
      var reqbannergroupid = {
        bannergroupid: row.bannergroupid,
      };
      this.ccapi
        .postData("banners/approvebannergroupflow", reqbannergroupid)
        .subscribe(
          (response: any) => {
            if (response.code == "500") {
              this.ccapi.openDialog("warning", response.message);
              return;
            } else if (
              response.code == "200" &&
              response.status.toLowerCase() == "success"
            ) {
              this.ccapi.openDialog("success", "Approved Successfully");
              this.getworkflowitems();
            }
          },
          (err) => {
            console.log(err);
            this.ccapi.HandleHTTPError(err);
          }
        );
    } else if (this.publishitemtype == "3") {
      var reqalert = {
        rule: row.name,
        type: row.reqalerttype,
      };
      this.ccapi.postData("alerts/approveworkflow", reqalert).subscribe(
        (response: any) => {
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            return;
          } else if (
            response.code == "200" &&
            response.status.toLowerCase() == "success"
          ) {
            this.ccapi.openDialog("success", "Approved Successfully");
            this.getworkflowitems();
          }
        },
        (err) => {
          console.log(err);
          this.ccapi.HandleHTTPError(err);
        }
      );
    } else if (this.publishitemtype == "4") {
      var reqrule = {
        ruleid: row.name,
      };
      this.ccapi.postData("rules/approveworkflow", reqrule).subscribe(
        (response: any) => {
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            return;
          } else if (
            response.code == "200" &&
            response.status.toLowerCase() == "success"
          ) {
            this.ccapi.openDialog("success", "Approved Successfully");
            this.getworkflowitems();
          }
        },
        (err) => {
          console.log(err);
          this.ccapi.HandleHTTPError(err);
        }
      );
    } else if (this.publishitemtype == "5") {
      var _json = JSON.parse(row.json);
      var reqpage = {
        pageid: row.pageid,
        moduleid: row.moduleid,
        status: 2,
        pagemoduleid: _json.pagemoduleid,
      };
      this.ccapi.postData("pages/updatewfstatus", reqpage).subscribe(
        (response: any) => {
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            return;
          } else if (
            response.code == "200" &&
            response.status.toLowerCase() == "success"
          ) {
            this.ccapi.openDialog("success", "Approved Successfully");
            this.getworkflowitems();
          }
        },
        (err) => {
          console.log(err);
          this.ccapi.HandleHTTPError(err);
        }
      );
    } else {
      this.ccapi.openDialog("warning", "Not Available");
    }
  }
  reject(row) {
    if (this.publishitemtype == "1") {
      let requesrParams = {
        bannerid: row.bannerid,
      };
      this.ccapi.postData("banners/rejectchanges", requesrParams).subscribe(
        (response: any) => {
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            return;
          } else if (
            response.code == "200" &&
            response.status.toLowerCase() == "success"
          ) {
            this.ccapi.openDialog("success", "Rejected Successfully");

            this.getworkflowitems();
          }
        },
        (err) => {
          console.log(err);
          this.ccapi.HandleHTTPError(err);
        }
      );
    } else if (this.publishitemtype == "2") {
      let requesrParamsgrp = {
        bannergroupid: row.bannergroupid,
      };
      this.ccapi
        .postData("banners/rejectbannergroupflow", requesrParamsgrp)
        .subscribe(
          (response: any) => {
            if (response.code == "500") {
              this.ccapi.openDialog("warning", response.message);
              return;
            } else if (
              response.code == "200" &&
              response.status.toLowerCase() == "success"
            ) {
              this.ccapi.openDialog("success", "Rejected Successfully");

              this.getworkflowitems();
            }
          },
          (err) => {
            console.log(err);
            this.ccapi.HandleHTTPError(err);
          }
        );
    } else if (this.publishitemtype == "3") {
      var reqalert = {
        rule: row.name,
        type: row.reqalerttype,
      };
      this.ccapi.postData("alerts/rejectchanges", reqalert).subscribe(
        (response: any) => {
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            return;
          } else if (response.code == "200") {
            this.ccapi.openDialog("success", "Rejected Successfully");
            this.getworkflowitems();
          }
        },
        (err) => {
          console.log(err);
          this.ccapi.HandleHTTPError(err);
        }
      );
    } else if (this.publishitemtype == "4") {
      var reqrule = {
        ruleid: row.name,
      };
      this.ccapi.postData("rules/rejectchanges", reqrule).subscribe(
        (response: any) => {
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            return;
          } else if (response.code == "200") {
            this.ccapi.openDialog("success", "Rejected Successfully");
            this.getworkflowitems();
          }
        },
        (err) => {
          console.log(err);
          this.ccapi.HandleHTTPError(err);
        }
      );
    } else if (this.publishitemtype == "5") {
      var _json = JSON.parse(row.json);
      var reqpage = {
        pageid: row.pageid,
        moduleid: row.moduleid,
        status: 3,
        pagemoduleid: _json.pagemoduleid,
      };
      this.ccapi.postData("pages/updatewfstatus", reqpage).subscribe(
        (response: any) => {
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            return;
          } else if (response.code == "200") {
            this.ccapi.openDialog("success", "Rejected Successfully");
            this.getworkflowitems();
          }
        },
        (err) => {
          console.log(err);
          this.ccapi.HandleHTTPError(err);
        }
      );
    } else {
      this.ccapi.openDialog("warning", "Not Available");
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
  selectall() {
    try {
      let _obj = this.banners;
      if (this.checked) {
        for (var i = 0; i < _obj.length; i++) {
          this.banners[i].select = true;
        }
      } else {
        for (var i = 0; i < _obj.length; i++) {
          this.banners[i].select = false;
        }
      }
      this.dataSource = new MatTableDataSource(this.banners);
    } catch (e) {}
  }
  showconfirm(rowdata, reqtype) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      width: "400px",
      data: {
        message: 'Please click "YES" to process this request.',
        confirmText: "Yes",
        cancelText: "No",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        if (reqtype == "approve") {
          this.approve(rowdata);
        } else if (reqtype == "reject") {
          this.reject(rowdata);
        }
      }
    });
  }

  getimagetid(tid) {
    return this.ccapi.getUrl("files/downloadimage?id=" + tid);
  }
  resetdata() {
    this.pageObject.pageNo = 0;
    this.dataSource = new MatTableDataSource([]);
    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0;
  }

  createRuleDialog(objreq: any): void {
    try {
      let obj = JSON.parse(objreq.updatejson);
      this.ruleObj = {
        id: obj.id,
        ruleid: obj.ruleid,
        subscribertype: obj.subscribertype,
        serviceclass: obj.serviceclass,
        targetedos: obj.targetedos,
        specificversions: obj.specificversions,
        androidmax: obj.androidmax,
        androidmin: obj.androidmin,
        iosmax: obj.iosmax,
        iosmin: obj.iosmin,
        appversioneligible: obj.appversioneligible,
        scheduling: obj.scheduling,
        startdate: obj.startdate,
        enddate: obj.enddate,
        description: obj.description,
        recurring: obj.recurring,
        daysofweek: obj.daysofweek,
        daysofmonth: obj.daysofmonth,
        starttime: obj.starttime,
        endtime: obj.endtime,
        segments: obj.segments,

        status: obj.status + "",
        mode: "update",
      };

      const dialogRef = this.dialog.open(AddRuleComponent, {
        width: "1200px",
        height: "1000px",
        data: this.ruleObj,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.pageObject.pageNo = 1;
        this.dataSource.sort = this.sort;
        this.getworkflowitems();
      });
    } catch (e) {
      this.ccapi.openSnackBar("Unable to view Details");
    }
  }

  bannerGrpObj: any;
  createBannerGroup(objreq: any): void {
    try {
      let obj = JSON.parse(objreq.updatejson);
      this.bannerGrpObj = {
        id: obj.bannergroupid,
        name: obj.groupname,
        title: obj.title,
        desc: obj.description,
        startdate: obj.startdate,
        enddate: obj.enddate,
        status: obj.status.toString(),
        bannertype: obj.type,
        banners: obj.banners,
        mode: "update",
      };

      const dialogRef = this.dialog.open(AddBannergroupComponent, {
        width: "1100px",
        height: "700px",
        data: this.bannerGrpObj,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result != undefined) {
          this.pageObject.pageNo = 1;
          this.dataSource.sort = this.sort;
          this.getworkflowitems();
        }
        console.log("The dialog was closed");
      });
    } catch (e) {}
  }
}
