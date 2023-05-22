import { Component, OnInit, NgZone, ViewChild, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { formatDate } from '@angular/common';
import { Subscription } from 'rxjs';
import { EnvService } from '../../../../shared/services/env.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
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
  ],
  styleUrls: ['./reports-list.component.css']
})
export class ReportsListComponent implements OnInit, OnDestroy {
  currentdate: Date = new Date();
  private _dialog1: Subscription;
  private _httpobj1: Subscription;
  private _httpobj2: Subscription;

  private _httpobj3: Subscription;

  private _httpobj4: Subscription;

  private _httpobj5: Subscription;

  private _httpobj6: Subscription;

  mindays: Date = new Date(this.currentdate.getFullYear(), this.currentdate.getMonth() - 12, this.currentdate.getDay());
  channelslist: any[] = [];
  operationtypelist: any[] = [];
  statuslist: any[] = [{ id: "1", "name": "Active" }, { id: "0", "name": "Inactive" }];
  usertypelist: any[] = [{ id: "Prepaid", "name": "Prepaid" }, { id: "Postpaid", "name": "Postpaid" }];
  transactiontypelist: any[] = [];
  paymentchannellist: any[] = [];
  paymenttypelist: any[] = [];
  filtertypelist: any[] = [];
  datacolumns: any = [];
  displayedColumns: any = [];//[{ id: 0, fieldName: 'test', displayName: "test" }, { id: 1, fieldName: 'test1', displayName: "test1" }];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  filterinfo: any;
  public ruleObj: any;
  public searchString: any = "";
  reportnameList: any = [];
  startdate: any;
  startdatecopy: any;;
  reportName: any = 2;
  reportid: any = 0;
  reportType: any = "1031001";
  reportField: any = 1;
  comparator: any = 1;
  filterselected: any[] = [];
  filterobj: any = {
    "filtertype": "", "comparator": "=", "filtervalue": "",
    // comparelist: [{ "id": "=", "name": "Equal" }, { "id": "like", "name": "Like" }], mode: 'insert'
    comparelist: [{ "id": "=", "name": "Equal" }], mode: 'insert'
  }
  filterobjlist: any[] = [];
  isQueryFilter: Boolean = false;
  saveQuery: Boolean = false;
  isDisplayFilter: Boolean = false;
  displayedColumnsFilter: any[] = [];//[{ id: 0, model: true, value: "ruleId" }, { id: 1, model: true, value: "subscriberType" }, { id: 2, model: true, value: "serviceClass" }, { id: 3, model: true, value: "createdBy" }, { id: 4, model: true, value: "createdAt" }, { id: 5, model: true, value: "modifiedBy" }, { id: 6, model: true, value: "modifiedAt" }];
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog, public env: EnvService) {
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
    this.generateReports();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.generateReports();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.generateReports();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit() {
    this.currentdate = new Date();
    this.mindays = new Date(this.currentdate.getFullYear(), this.currentdate.getMonth() - 12, this.currentdate.getDate());
    this.reportType = "1031001";
    this.pageObject.pageNo = 1;
    // this.loadReports();
    let _tmpstartdate = new Date(this.currentdate.getFullYear(), this.currentdate.getMonth(), this.currentdate.getDate(), 0, 0)
    _tmpstartdate.setDate(_tmpstartdate.getDate() - 1);
    this.startdate = [
      _tmpstartdate,
      new Date(this.currentdate.getFullYear(), this.currentdate.getMonth(), this.currentdate.getDate(), 23, 59)
    ];
    this.loadfiltervalues();
    this.getfiltervalues();
  }


  onDatepickerOpen(data) {
    this.startdatecopy = {...this.startdate};
  }


  onDatepickerChange(data) {
    let startmonth = moment(data[0]).month();
    let endmonth = moment(data[1]).month();
    if (this.reportid == this.env.monthwiseloginreportid && startmonth != endmonth) {
      if (this.startdatecopy) {
        this.startdate = [
          moment(this.startdatecopy[0]).toDate(), moment(this.startdatecopy[1]).toDate()
        ];
      } else {
        this.startdate = [
          moment().subtract(1, 'days').toDate(), moment().toDate()
        ];
      }
      this.ccapi.openDialog("warning", "Start date and End date should be in same month");
      // return;
    }
  }

  loadReportsdata() {
    this.displayedColumns = [];
    this.datacolumns = [];
    this.dataSource = new MatTableDataSource([]);
    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0;

    let req = {
      "reportId": this.reportid,
      "roleId": this.ccapi.get7digitRole(this.ccapi.getRole()),
      "userId": this.ccapi.getUserId()
    }

    if (this.reportid == this.env.monthwiseloginreportid) {
      let _tmpstartdate = new Date(this.currentdate.getFullYear(), this.currentdate.getMonth(), this.currentdate.getDate(), 0, 0)
      _tmpstartdate.setDate(_tmpstartdate.getDate() - 1);
      this.startdate = [_tmpstartdate, new Date(this.currentdate.getFullYear(), this.currentdate.getMonth(), this.currentdate.getDate(), 23, 59)
      ];
      this.mindays = new Date(this.currentdate.getFullYear(), this.currentdate.getMonth() - 3, this.currentdate.getDate());
    }
    else {
      this.mindays = new Date(this.currentdate.getFullYear(), this.currentdate.getMonth() - 12, this.currentdate.getDate());
    }



    this.filterselected = [];
    this.filtertypelist = [];
    this.pageObject.pageNo = 0;
    this.filterinfo = null;
    let _filterlist = this.ccapi.getSession("reportfilters_" + this.reportid);
    if (_filterlist == null || _filterlist == undefined || _filterlist == "") {
      this._httpobj1 = this.ccapi.postData('bi-reports-api/getfilters', req).subscribe((resp: any) => {
        console.log(resp);
        try {
          if (resp.code == "200" && resp.data != null) {
            var _json = JSON.parse(resp.data);
            resp.filters = _json.filters;
          }
        } catch (e) { }

        if (resp.filters != null) {
          this.filterinfo = JSON.parse(JSON.stringify(resp.filters));
          this.ccapi.setSession("reportfilters_" + this.reportid, JSON.stringify(this.filterinfo));
          this.formdisplaycolumns();
        }
        else {
          this.ccapi.openDialog("warning", "Filter Details Not Available");
        }
      }, (err => {
        this.ccapi.HandleHTTPError(err);
      }))
    }
    else {
      this.filterinfo = JSON.parse(_filterlist);
      this.formdisplaycolumns();
    }
  };
  formdisplaycolumns() {
    try {
      let defaultfiltertype = 20;
      let _qryfiled = null;
      if (this.filterinfo.queryFields != null)
        _qryfiled = this.filterinfo.queryFields;
      for (let i = 0; i < _qryfiled.length; i++) {
        let _qry = _qryfiled[i];
        let _filtertype = "";
        if (_qry.fieldName.toLowerCase() == "date") continue;
        switch (_qry.fieldName.toLowerCase()) {
          case "channel": _filtertype = "5"; break;
          case "paymenttype": _filtertype = "1"; break;
          case "paymentchannel": _filtertype = "2"; break;
          case "transactiontype": _filtertype = "3"; break;
          case "usertype": _filtertype = "4"; break;
          case "productname": _filtertype = "7"; break;
          case "status": _filtertype = "6"; break;
          case "operationtype": _filtertype = "8"; break;
          case "clientip": _filtertype = "9"; break;
          case "loginid": _filtertype = "10"; break;
          case "circleid": _filtertype = "11"; break;
          // default : _filtertype = _qry.fieldName; break;
        }

        let _itm = {
          filtertype: _filtertype, comparator: "", filtervalue: ""
        }
       

        if (_filtertype == "")
        {
          defaultfiltertype++;

          _itm = {
            filtertype: defaultfiltertype.toString(), comparator: "", filtervalue: ""
          }

          this.filtertypelist.push({ "id": defaultfiltertype.toString(), "name": _qry.displayName });
        }
        else
        {
          this.filtertypelist.push({ "id": _filtertype, "name": _qry.displayName });
        }

        
        
        this.filterobjlist.push(_itm);
      }

      this.filtertypelist = JSON.parse(JSON.stringify(this.filtertypelist));
      this.filterobjlist = JSON.parse(JSON.stringify(this.filterobjlist));


    } catch (e) { }
    let arr = this.filterinfo.displayFields;
    this.displayedColumns = [];
    this.datacolumns = [];
    for (let i = 0; i < arr.length; i++) {
      let obj: any = arr[i];
      let field = obj.displayName;
      if (this.displayedColumns.indexOf(field) == -1) {
        this.displayedColumns.push(field);
        this.datacolumns.push(obj);
      }
    }
    // this.displayedColumns.pop();
    this.changefiltertype();
  }
  getdatafromrow(row, idx) {
    try {
      let _datacol = this.datacolumns[idx];
      if (_datacol != null) {
        let _tmp = 0;
        for (let key in row) {
          if (_tmp == idx) {
            return row[key];
          }
          _tmp++;
        }
        // if (row[_datacol.displayName] != null && row[_datacol.displayName] != undefined)
        //   return row[_datacol.displayName];
        // else if (row[_datacol.displayName.toLowerCase()] != null && row[_datacol.displayName.toLowerCase()] != undefined)
        //   return row[_datacol.displayName.toLowerCase()];
        // else if (row[_datacol.fieldName] != null && row[_datacol.fieldName] != undefined)
        //   return row[_datacol.fieldName];
        // else if (row[_datacol.fieldName.toLowerCase()] != null && row[_datacol.fieldName.toLowerCase()] != undefined)
        //   return row[_datacol.fieldName.toLowerCase()];
      }
    } catch (e) { }
    return "";
  }
  changefiltertype() {
    switch (this.filterobj.filtertype + "") {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "8": this.filterobj.comparelist = [{ "id": "1", "name": "Equal" }]; break;
      case "7":
      case "9":
      // case "9": this.filterobj.comparelist = [{ "id": "2", "name": "Like" }]; break;
      case "10":
      default : this.filterobj.comparelist = [{ "id": "1", "name": "Equal" }]; break;
      // case "11":

    }
    this.filterobj.filtervalue = "";
  }
  loadReportTypes() {

  };

  loadReportsJson() {

  };
  resetreport() {
    this.reportid = 0;
    this.filterselected = [];
    this.reportnameList = [];
    this.filtertypelist = [];
    this.pageObject.pageNo = 0;

  }

  loadReports() {
    let req = {
      "report_type_id": this.reportType,
      "start": 1,
      "length": 100,
      "orderDir": "desc"
    };
    try {
      this.reportid = 0;
      this.filterselected = [];
      this.reportnameList = [];
      this.filtertypelist = [];
      this.pageObject.pageNo = 0;

    } catch (e) { }
    let _reportslist = this.ccapi.getSession("reportslist_" + this.reportType);
    if (_reportslist == null || _reportslist == undefined || _reportslist == "") {
      this._httpobj2 = this.ccapi.postData('reports/getreports', req).subscribe((resp: any) => {
        console.log(resp);
        try {
          var _retype = this.reportType + "";
          resp.data = resp.data.filter(function (ele) {
            return ele.reporttypeid + "" == _retype
          });
        } catch (e) { }
        if (resp && resp.data && resp.data.length > 0) {
          this.reportnameList = resp.data;
          this.ccapi.setSession("reportslist_" + this.reportType, JSON.stringify(this.reportnameList));
        } else {
          this.reportnameList = [];
          this.ccapi.openDialog("warning", "No Reports Available");
        }
      }, (err => {
        this.ccapi.HandleHTTPError(err);
      }));
    }
    else {
      this.reportnameList = JSON.parse(_reportslist);
    }
  };

  formreportdisplayfields() {
    let _list: any = [];
    try {
      let _disfilelds = this.filterinfo.displayFields;
      for (let i = 0; i < _disfilelds.length; i++) {
        var _item = _disfilelds[i];
        _item.selected = true;
        _item.fieldSort = null;
        _item.headerInfo = null;
        _item.metaData = null;
        _list.push(_item);
      }
    } catch (e) { }
    return _list;
  }
  forreportqueryfields() {
    let _qrylist = []
    try {
      if (this.filterselected.length > 0) {
        for (let i = 0; i < this.filterselected.length; i++) {
          let _filterval = this.filterselected[i].filtertype;
          let _filtername = this.filtertypelist.filter(function (ele, idx) {
            return ele.id == _filterval;
          });
          // {"displayName":"referralid","fieldName":"ReferralID","dataType":"string","operType":"=","filedValue":["a"],
          // "allowedForChart":false,"headerInfo":null
          // ,"metaData":"[{\"value\":\"a\",\"text\":\"a\"}]","fieldSort":null}
          let _qryfld = this.filterinfo.queryFields.filter(function (ele, idx) {
            return ele.fieldName.toLowerCase() == _filtername[0].name.toLowerCase()
          });
          if (_qryfld == null || _qryfld == undefined || _qryfld.length == 0) {
            _qryfld = this.filterinfo.queryFields.filter(function (ele, idx) {
              return ele.displayName.toLowerCase() == _filtername[0].name.toLowerCase()
            });
          }
          if (_qryfld != null && _qryfld != undefined && _qryfld.length > 0) {
            var _qryfields = JSON.parse(JSON.stringify(_qryfld));
            _qryfields[0].operType = "=";
            if (this.filterselected[i].comparator == "1" || this.filterselected[i].comparator == "=") {
              _qryfields[0].operType = "=";
            }
            else if (this.filterselected[i].comparator == "2" || this.filterselected[i].comparator == "like") {
              _qryfields[0].operType = "LIKE";
            }

            _qryfields[0].filedValue = [];
            if (this.filterselected[i].comparator == "2" || this.filterselected[i].comparator == "like")
              _qryfields[0].filedValue.push("%" + this.filterselected[i].filtervalue + "%");
            else
              _qryfields[0].filedValue.push(this.filterselected[i].filtervalue + "");
            _qryfields[0].metaData = "";
            if (this.filterselected[i].comparator == "2" || this.filterselected[i].comparator == "like")
              _qryfields[0].metaData = ("[{\"value\":\"%" + this.filterselected[i].filtervalue + "%\",\"text\":\"" + this.filterselected[i].filtervalue + "\"}]");
            else
              _qryfields[0].metaData = ("[{\"value\":\"" + this.filterselected[i].filtervalue + "\",\"text\":\"" + this.filterselected[i].filtervalue + "\"}]");
            _qrylist.push(_qryfields[0]);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    return _qrylist;
  }

  generateReports() {
    if (this.reportid == null || this.reportid == undefined || this.reportid == 0) {
      this.ccapi.openDialog("warning", "Select Report"); return false;
    }
    let start = 0;
    if (this.pageObject.pageNo > 1)
      start = ((this.pageObject.pageNo - 1) * this.pageObject.pageSize);
    let requesrParams = {
      "reqId": this.reportid,
      "userId": this.ccapi.getUserId(),
      "roleId": this.ccapi.get7digitRole(this.ccapi.getRole()),
      // "reportName": "OTP",
      "reportId": this.reportid,
      "dateFilter": {
        "dateStart": formatDate(this.startdate[0], 'yyyy-MM-dd', 'en-US', ''),
        "dateEnd": formatDate(this.startdate[1], 'yyyy-MM-dd', 'en-US', '')
      },
      "displayInfo": { "displayType": "grid" },
      "filters":
      {
        "displayFields": this.formreportdisplayfields(),
        "queryFields": this.forreportqueryfields(), "es_mapping": []
      },
      "paginationInfo": { "start": start, "rows": this.pageObject.pageSize },
      "orderByInfo": { "fieldName": "DATE", "order": "desc" }
    }
    this.dataSource = new MatTableDataSource([]);
    // this.pageObject.totalRecords = 0;
    // this.pageObject.totalPages = 0;

    this._httpobj3 = this.ccapi.postData('bi-reports-api/generatereport', requesrParams).subscribe((response: any) => {
      console.log(response);
      if (response != null && response.code != null && response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response != null && response.code != null && response.code == "200") {
        try {
          var _json = JSON.parse(response.data);
          response.transactionInfo = _json.transactionInfo;
        } catch (e) { }
      }
      if (response && response.transactionInfo && response.transactionInfo.transactions != null && response.transactionInfo.transactions.length > 0) {
        let arr = response.transactionInfo.transactions;
        let temparr = [];
        for (let i = 0; i < arr.length; i++) {
          temparr.push(arr[i]);
        }
        console.log(temparr);
        this.dataSource = new MatTableDataSource(temparr);
        // this.pageObject.totalRecords = response.recordsTotal;
        //   this.pageObject.totalPages = response.recordsFiltered;
        this.pageObject.totalRecords = response.transactionInfo.numFound;
        this.pageObject.totalPages = this.pageObject.pageSize;
      }
      else {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        this.ccapi.openSnackBar("No Records Found");
      }
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));
  };

  createRuleDialog(obj: any): void {

  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  toggleQueryFilter() {
    this.isDisplayFilter = false;
    this.isQueryFilter = !this.isQueryFilter;
  }

  toggleDisplayFilter() {
    this.isQueryFilter = false;
    this.isDisplayFilter = !this.isDisplayFilter;
  }
  modifyTable(obj: any) {

  }

  saveQueryStateChange() { }
  generateReportGrid() { }

  exportReport(obj) {
    if (this.reportid == null || this.reportid == undefined || this.reportid == 0) {
      this.ccapi.openDialog("warning", "Select Report"); return false;
    }
    let start = 1;
    let requesrParams = {
      "reqId": this.reportid,
      "userId": this.ccapi.getUserId(),
      "roleId": this.ccapi.get7digitRole(this.ccapi.getRole()),
      "reportName": "download_" + this.reportid,
      "reportId": this.reportid,
      "dateFilter": {
        "dateStart": formatDate(this.startdate[0], 'yyyy-MM-dd', 'en-US', ''),
        "dateEnd": formatDate(this.startdate[1], 'yyyy-MM-dd', 'en-US', '')
      },
      "displayInfo": { "displayType": "grid" },
      "filters":
      {
        "displayFields": this.formreportdisplayfields(),
        "queryFields": this.forreportqueryfields(), "es_mapping": []
      },

      "orderByInfo": { "fieldName": "DATE", "order": "desc" },
      "exportInfo": { exportType: obj, delimiter: "," }
    }


    const dialogRef = this.dialog.open(AlertDialogComponent,{
      disableClose: true,
      data:{
        message: 'If download response time is longer than 60 seconds, Please download the report from your Report Inbox.',
        buttonText: {
          cancel: 'OK'
        }
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        let req = btoa(JSON.stringify(requesrParams));
        var win2= window.open(this.ccapi.getUrl('reports/downloadreport?req=' + req));
        if (!win2.closed)
        setTimeout(function(){win2.close()},60000);
      }
    });


    
    
    // this._httpobj4 = this.ccapi.getData('reports/downloadreport?req='+req).subscribe((response: any) => {
    // if (response != null && response.code != null && response.code == "500") {
    //   this.ccapi.openDialog("warning", response.message);
    //   return;
    // }
    // else if (response != null && response.code != null && response.code == "200") {
    //   this.ccapi.openDialog("success", "Downloading..");
    // }
    //}, (err => {
    //this.ccapi.HandleHTTPError(err);
    // }));



  }
  loadfiltervalues() {
    this.getchannels();
  }
  getchannels() {
    let requesrParams = {
      orderDir: "desc",
      status: 1,
      search: "",
      start: 1,
      length: 100
    }
    let _filterlist = this.ccapi.getSession("reports_channels");
    if (_filterlist == null || _filterlist == undefined || _filterlist == "") {
      this._httpobj5 = this.ccapi.postData('channels/getchannel', requesrParams).subscribe((response: any) => {
        if (response.code == "200") {
          if (response.data && response.data.length > 0) {
            let _itemlist = [];
            let _items = (response.data);
            for (let i = 0; i < _items.length; i++) {
              _itemlist.push({ "id": _items[i].channelId, "name": _items[i].channelName });
            }
            this.channelslist = _itemlist;
            this.ccapi.setSession("reports_channels", JSON.stringify(this.channelslist));
          }
        }
      });
    }
    else {
      this.channelslist = JSON.parse(_filterlist);
    }
  }
  getfiltervalues() {
    let requesrParams = { "search": "", "filterBy": "REPORTS", "start": 1, "length": 100, "orderDir": "desc" }
    let _filterlist = this.ccapi.getSession("reports_filters_masters");
    if (_filterlist == null || _filterlist == undefined || _filterlist == "") {
      this._httpobj6 = this.ccapi.postData('globalsettings/getall', requesrParams).subscribe((response: any) => {
        if (response.code == "200") {
          if (response.data && response.data.length > 0) {
            let _itemlist = [];
            let _items = (response.data);
            this.formfiltermasterdata(_items);
            this.ccapi.setSession("reports_filters_masters", JSON.stringify(response.data));
          }
        }
      });
    }
    else {
      this.formfiltermasterdata(JSON.parse(_filterlist));
    }
  }
  formfiltermasterdata(_items) {
    for (let i = 0; i < _items.length; i++) {
      if (_items[i].keyword == "REPORT_OPERATION_TYPES") {
        this.operationtypelist = this.getfilterlist(_items[i].value);
      }
      else if (_items[i].keyword == "REPORT_TRANSACTION_TYPES") {
        this.transactiontypelist = this.getfilterlist(_items[i].value);
      }
      else if (_items[i].keyword == "REPORT_PAYMENT_CHANNELS") {
        this.paymentchannellist = this.getfilterlist(_items[i].value);
      }
      else if (_items[i].keyword == "REPORT_PAYMENT_TYPES") {
        this.paymenttypelist = this.getfilterlist(_items[i].value);
      }
    }
  }
  getfilterlist(_txt) {
    let _list: any[] = [];
    try {
      for (let j = 0; j < _txt.split(',').length; j++) {
        var _key = _txt.split(',')[j];
        _list.push({ "id": _key.split('|')[0], "name": _key.split('|')[1].toUpperCase() });
      }

    } catch (e) { }
    return _list;
  }
  addfilter() {
    let isNew = true;
    if (!this.ccapi.isvalidtext(this.filterobj.filtertype, "Select Filter Type")) return;

    if (!this.ccapi.isvalidtext(this.filterobj.comparator, "Select Compare Type")) return;
    if (!this.ccapi.isvalidtext(this.filterobj.filtervalue, "Select Filter Value")) return;


    if (this.filterselected != null && this.filterselected.length > 0) {
      for (let i = 0; i < this.filterselected.length; i++) {
        if (this.filterselected[i].filtertype == this.filterobj.filtertype) {
          this.ccapi.openDialog("warning", "Filter already added");
          isNew = false;
          break;
        }
      }
    }
    if (isNew) {
      let _itm = {
        "filtertype": this.filterobj.filtertype, "comparator": this.filterobj.comparator, "filtervalue": this.filterobj.filtervalue,
        comparelist: this.filterobj.comparelist, mode: 'update'
      }
      this.pageObject.pageNo = 0;
      this.filterselected.push(_itm);
      this.filterobj.filtertype = ""; this.filterobj.comparator = ""; this.filterobj.filtervalue = "";
    }
  }
  removefilter(itm) {
    if (this.filterselected != null && this.filterselected.length > 0) {
      for (let i = 0; i < this.filterselected.length; i++) {
        if (this.filterselected[i].filtertype == itm.filtertype) {
          this.filterselected.splice(i, 1);
          this.ccapi.openDialog("warning", "Filter Removed");
          this.pageObject.pageNo = 0;
          break;
        }
      }
    }
  }

  ngOnDestroy() {
    console.log("destroypostdata");
    if (this._httpobj1 != null && this._httpobj1 != undefined)
      this._httpobj1.unsubscribe();
    if (this._httpobj2 != null && this._httpobj2 != undefined)
      this._httpobj2.unsubscribe();

    if (this._httpobj3 != null && this._httpobj3 != undefined)
      this._httpobj3.unsubscribe();
    if (this._httpobj4 != null && this._httpobj4 != undefined)
      this._httpobj4.unsubscribe();
    if (this._httpobj5 != null && this._httpobj5 != undefined)
      this._httpobj5.unsubscribe();
    if (this._httpobj6 != null && this._httpobj6 != undefined)
      this._httpobj6.unsubscribe();

    if (this._dialog1 != null && this._dialog1 != undefined)
      this._dialog1.unsubscribe();
  }
}



@Component({
  selector: 'app-alert-dialog',
  template: `<mat-dialog-content>
  <h6>{{message}}</h6>
</mat-dialog-content>
<mat-dialog-actions align="center">
<button mat-raised-button color="primary" mat-dialog-close tabindex="-1">{{cancelButtonText}}</button>
</mat-dialog-actions>`
})
export class AlertDialogComponent {
  message: string = ""
  cancelButtonText = "Cancel"
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<AlertDialogComponent>) {
      if (data) {
        this.message = data.message || this.message;
        if (data.buttonText) {
          this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
        }
      }
      this.dialogRef.updateSize('300vw','300vw')
    }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

}