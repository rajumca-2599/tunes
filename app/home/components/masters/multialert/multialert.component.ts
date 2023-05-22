import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
//import { MsgdialogueboxComponent } from '../../../../shared/msgdialoguebox/msgdialoguebox.component';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { AddMultialertComponent } from '../multialert/add-multialert/add-multialert.component';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { ManagealertComponent } from './managealert/managealert.component';
import { MatSort } from '@angular/material/sort';
import { EnvService } from '../../../../shared/services/env.service';

@Component({
  selector: 'app-multialert',
  templateUrl: './multialert.component.html',
  styleUrls: ['./multialert.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        display: 'block',
        opacity: 1,
      })),
      state('closed', style({
        display: 'none',
        opacity: 0,
      })),
      transition('open => closed', [
        animate('0.4s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
    ]),
  ]
})
export class MultialertComponent implements OnInit {
  displayedColumns: string[] = ["name", "type", "entitle", "idtitle", "status", "siwfstatus", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public acObj: any;
  public fsearchtext: string = "";
  public ftype: string = "1";
  public listData: any;
  pagemasters: any[] = [];
  public isTooltipEnable: boolean = false;
  public showTooltip: boolean = false;
  public TooltipText: string = "DISABLE";
  public TooltipObj: any;
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog,public env:EnvService) {
  }
  changePage(page: number) {
    if (page) {
      this.pageObject.pageNo = page;
      this.paginator.pageIndex = (page - 1);
      this.getPage({ pageIndex: (this.pageObject.pageNo) });
    }
  }

  changePageSize(obj) {
    this.pageObject.pageNo = 0;
    this.pageObject.pageSize = obj.pageSize;
    this.getalertconfigs();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getalertconfigs();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getalertconfigs();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.dataSource.sort = this.sort;

    this.ftype = "1";
    this.pageObject.pageNo = 1;
    this.getalertconfigs();
    //var _master = JSON.parse(this.ccapi.getSession("masterconfig"));
    //this.pagemasters = _master.pages;
    this.isTooltipEnable = false;
    this.TooltipText = "DISABLE";
    this.showTooltip = false;
    this.TooltipObj = [];
  }
  getStatus(status: any): string {
    if (status == "1") {
      return "Active";
    } else {
      return "Inactive";
    }
  };
  getwfstatus(val: any) {
    if (val == "1") return "Pending"; else return "Live"
  }
  getType(type: any): string {
    if (type == "1") return "Multi Alert";
    else if (type == "2") return "Smart Alert";
    else if (type == "3") return "Pro Tip";
    else if (type == "4") return "Tool Tips";
    else if (type == "5") return "Push Notifications";
    else return "";
  };
  getalertconfigsList() {
    this.pageObject.pageNo = 1;
    this.paginator.pageIndex = 0;
    this.getalertconfigs();
  }
  getalertconfigs() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      orderdir: "desc",
      search: this.fsearchtext,
      type: this.ftype,
      start: start,
      length: this.pageObject.pageSize
    }
    this.dataSource = new MatTableDataSource([]);
    // this.pageObject.totalRecords = 0;
    // this.pageObject.totalPages = 0;
    // this.dataSource.sort = this.sort;

    this.ccapi.postData('alerts/alertslist', requesrParams).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.data != null && response.data.length > 0) {
          this.dataSource = new MatTableDataSource(this.formatrequest(response.data));
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          this.dataSource.sort = this.sort;

        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0; this.dataSource.sort = this.sort;
          this.ccapi.openSnackBar("No Records found");
        }
      }
    }, (err => {
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));
  };
  getItemByLang(list, lang) {
    try {
      var isexist = false;
      var _item = list[0];
      for (var i = 0; i < list.length; i++) {
        if (list[i].language == lang) {
          _item = list[i]; isexist = true; break;
        }
      }
      if (isexist == false) {
        _item.language = lang;
      }

      return JSON.parse(JSON.stringify(_item));
    }
    catch (e) {
      return JSON.parse(JSON.stringify(list[0]))
    }
  }
  formatrequest(data) {
    try {
      var _list: any[] = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].rules.length <= 0) continue;
        let _enobject = this.getItemByLang(data[i].rules, "en");
        if (_enobject == null || _enobject == undefined) continue;
        let _idobject = this.getItemByLang(data[i].rules, "id");
        if (data[i].rules.length == 1) {
          let _tmp = JSON.parse(JSON.stringify(_idobject));
          data[i].rules.push(_tmp);
        }
        let _data_tmp = [];
        _data_tmp.push(this.getItemByLang(data[i].rules, "en"));
        _data_tmp.push(this.getItemByLang(data[i].rules, "id"));
        data[i].rules = _data_tmp;
        data[i].type = this.ftype;
        data[i].status = _enobject.status + "";
        data[i].name = data[i].rule;
        let _itm = {
          name: data[i].rule,
          status: _enobject.status,
          type: this.ftype,
          entitle: _enobject.title,
          idtitle: _idobject.title,
          data: data[i],
          siwfstatus: _enobject.siwfstatus
        }
        _list.push(_itm);
      }
      return _list;
    }
    catch (E) {
      console.log(E);
      return null;
    }

  }

  createAlertConfigDialog(obj: any): void {
    // if (obj == null && obj == undefined) {
    //   this.acObj = {
    //     id: "",
    //     name: "",
    //     type: "",
    //     mode: "insert"
    //   }
    //   const dialogRef = this.dialog.open(ManagealertComponent, {
    //     width: '950px',
    //     data: this.acObj,
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('The dialog was closed');
    //     this.getalertconfigs();
    //   });
    // }
    // else {
    const dialogRef = this.dialog.open(ManagealertComponent, {
      width: '950px',
      data: obj.data,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getalertconfigs();
    });
    // }
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  onAlertTypeChange() {
    if (this.ftype == "4") {
      this.CheckToolTipEnable();
      this.showTooltip = true;
    }
    else {
      this.showTooltip = false;
    }
    this.getalertconfigsList();
  }
  CheckToolTipEnable() {
    let requesrParams = {
      search: "TOOLTIP_ENABLE",
      filterBy: "",
      start: "1",
      length: "10",
      orderDir: "desc"
    }
    this.TooltipObj = [];
    this.ccapi.postData('globalsettings/getall', requesrParams).subscribe((response: any) => {
      if (response.code == "500") {
        this.isTooltipEnable = false;
        this.TooltipText = "DISABLE";
        return;
      }
      else if (response.code == "200") {
        if (response && response.data && response.data.length > 0) {
          this.TooltipObj = response.data[0];
          if (response.data[0].value == "T") {
            this.isTooltipEnable = true;
            this.TooltipText = "ENABLE";
          }
          else {
            this.TooltipText = "DISABLE";
            this.isTooltipEnable = false;
          }
        }
        else {
          this.isTooltipEnable = false;
          this.TooltipText = "DISABLE";
        }
      }
    });
  };
  toggleStatus(evnt) {
    if (evnt.checked) {
      this.isTooltipEnable = true;
      this.TooltipText = "ENABLE";
    }
    else {
      this.isTooltipEnable = false;
      this.TooltipText = "DISABLE";
    }
  }
  UpdateTooltipStatus() {
    let value = this.isTooltipEnable ? "T" : "F";
    let obj = {
      "keyword": "TOOLTIP_ENABLE",
      "value": value,
      "description": this.TooltipObj.description,
      "group_name": this.TooltipObj.group_name
    }
    this.ccapi.postData("globalsettings/update", obj).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
      }
      else
        this.ccapi.openDialog('warning', resp.message);
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));
  }
}
