import {
  Component,
  OnInit,
  Input,
  Output,
  ElementRef,
  NgZone,
} from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Config, Data, Layout } from "plotly.js";
import { HttpErrorResponse } from "@angular/common/http";
import { CommonService } from "../../../shared/services/common.service";
import { formatDate } from "@angular/common";
import * as moment from "moment";

declare var Plotly: any;
declare var require: any;
var $ = require("jquery");

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  tmpalllist: any;
  currenttabid: any = "1";
  curdate: any = new Date();
  mindt: any = new Date();
  userpermissions: any = this._service.getpermissions("");
  nodatagraph: boolean = false;
  public range: any;
  public isOpen = false;
  isActive: boolean = true;
  public widgetListtabs: any[] = [];
  public widgetList: any[] = [];
  @Input() data: any;
  @Input() layout: any;
  @Input() options: any;
  @Input() displayRawData: boolean;
  public graphdata: any;
  widgetdata: any;
  filterdata: any;
  public interval: any;
  // fromDate: any;
  // toDate: any;
  public emptyChartInfo = {
    chartType: "bar",
    chartData: [],
    layout: {
      clickmode: "none",
      xaxis: { range: [], type: "date" },
      yaxis: { range: [0, 4], type: "linear" },
      margin: { l: 50, r: 50, t: 10, b: 50, pad: 0 },
    },
    colorCodes: [],
  };
  public dtrange = [];
  alwaysShowCalendars: boolean;
  ranges: any;
  // ranges: any = {
  //   Live: [moment().subtract(120, 'minute'), moment().subtract(1, 'minute')],
  //   Today: [moment().startOf('day'), moment().subtract(1, 'minute')],
  //   Yesterday: [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
  //   'Last 7 Days': [moment().subtract(6, 'days').startOf('day'), moment()],
  //   'Last 30 Days': [moment().subtract(29, 'days').startOf('day'), moment()],
  //   'This Month': [moment().startOf('month').startOf('day'), moment().endOf('month')],
  //   'Last Month': [moment().subtract(1, 'month').startOf('month'),
  //   moment().subtract(1, 'month').endOf('month')]
  // }
  startdtime: any;
  enddtime: any;
  constructor(
    private _service: CommonService,
    private zone: NgZone,
    public dialog: MatDialog
  ) {
    this.range = {
      fromDate: moment().subtract(120, "minute"),
      toDate: moment(),
      live: "1",
    };
    this.curdate = moment();
    this.mindt = moment().subtract(60, "days").startOf("day");
  }
  ngOnDestroy() {
    window["bindCharts"] = null;
    try {
      if (this.interval) {
        clearInterval(this.interval);
      }
    } catch (e) {}
  }

  initranges() {
    console.log(moment().subtract(120, "minute").startOf("hour"));
    console.log(moment().startOf("day"));
    this.ranges = {
      Live: [moment().subtract(120, "minute"), moment()],
      Today: [moment().startOf("day"), moment().endOf("day")],
      Yesterday: [
        moment().subtract(1, "days").startOf("day"),
        moment().subtract(1, "days").endOf("day"),
      ],
      "Last 7 Days": [moment().subtract(6, "days").startOf("day"), moment()],
      "Last 30 Days": [moment().subtract(29, "days").startOf("day"), moment()],
      "This Month": [
        moment().startOf("month").startOf("day"),
        moment().endOf("month"),
      ],
      "Last Month": [
        moment().subtract(1, "month").startOf("month"),
        moment().subtract(1, "month").endOf("month"),
      ],
    };
  }
  ngOnInit() {
    this.startdtime = moment().subtract(120, "minute");
    this.enddtime = moment().subtract(5, "minute");
    this.initranges();
    setTimeout(() => {
      this.loadpage();
    }, 2000);
    this._service.getspinthewheeldashboard();
  }
  loadpage() {
    this.getfiltervalues();
    this.zone.runOutsideAngular(() => {
      window["bindCharts"] = this.setDateRange.bind(this);
    });
    this.loadWidgetsList("1");
    // $(function () {
    //   var start = formatDate(moment().subtract(120, 'minute').toString(), 'yyyy/MM/dd HH:mm:ss', 'en-US', '');
    //   var end = formatDate( moment().subtract(5, 'minute').toString(), 'yyyy/MM/dd HH:mm:ss', 'en-US', '');
    //   // console.log("start : " + start);
    //   // console.log("end : " + end);
    //   function cb(start, end, label) {
    //     if (label == 'Live') {
    //       // $('#reportrange span').html('Live');
    //       window["bindCharts"](formatDate(start, 'yyyy/MM/dd HH:mm:ss', 'en-US', ''), formatDate(end, 'yyyy/MM/dd HH:mm:ss', 'en-US', ''), true);
    //     }
    //     else {
    //       this.dtrange = { startDate: start, endDate: end };
    //       // $('#reportrange span').html(formatDate(start, 'yyyy/MM/dd HH:mm:ss', 'en-US', '') + ' - ' + formatDate(end, 'yyyy/MM/dd HH:mm:ss', 'en-US', ''));
    //       window["bindCharts"](formatDate(start, 'yyyy/MM/dd HH:mm:ss', 'en-US', ''), formatDate(end, 'yyyy/MM/dd HH:mm:ss', 'en-US', ''), false);
    //     }
    //   }
    //   setTimeout(() => { cb(start, end, 'Live'); }, 500);
    // });

    this.interval = setInterval(() => {
      if (window.location.href.indexOf("dashboard") == -1) {
        return;
      }
      // if (this.range.live == '1') {
      //   this.setDateRange(formatDate(moment().subtract(2, 'hour').toString(), 'yyyy/MM/dd HH:mm:ss', 'en-US', ''), formatDate(moment().toString(), 'yyyy/MM/dd HH:mm:ss', 'en-US', ''), true);
      // }
    }, 180000);
  }
  rangeClicked(range) {
    console.log("[rangeClicked] range is : ", range);
    console.log("[rangeClicked] range start is : ", range.startDate);
    console.log("[rangeClicked] range end is : ", range.endDate);
  }
  datesUpdated(range) {
    console.log("[datesUpdated] range is : ", range);
    console.log("[datesUpdated] range start is : ", range.startDate);
    console.log("[datesUpdated] range end is : ", range.endDate);
    this.setDateRange(range.startDate, range.endDate, false);
  }
  choosedDate(range) {
    console.log("[choosedDate] range is : ", range);
  }
  changeUpdated(range) {
    console.log("[changeUpdated] range is : ", range);
  }
  setDateRange(startDate, endDate, islive) {
    if (startDate == undefined || endDate == undefined) {
      console.log("undefined date");
      return;
    }
    console.log(startDate + " - " + endDate);
    if (endDate > moment()) {
      endDate = moment();
      console.log("set Moment:" + endDate);
    }
    this.range = {
      fromDate: startDate,
      toDate: endDate,
      live: islive ? "1" : "0",
    };
    try {
      this.emptyChartInfo.layout.xaxis.range = [
        formatDate(startDate, "yyyy-MM-dd HH:mm", "en-US", ""),
        formatDate(endDate, "yyyy-MM-dd HH:mm", "en-US", ""),
      ];
    } catch (e) {}
    this.bindWidgetsList();
  }
  tabChangeEvent(tab) {
    try {
      if (tab < 0) tab = 0;
      this.currenttabid = tab;
      this.assigncss(tab);

      this.widgetList = this.tmpalllist[tab].list;
      this.bindWidgetsList();
    } catch (e) {}
  }
  loadWidgetstab() {
    try {
      this.assigncss(this.currenttabid);
      this.widgetList = this.tmpalllist[this.currenttabid].list;
      this.bindWidgetsList();
    } catch (e) {}
  }
  loadWidgetsList(pgload: any) {
    this.initranges();
    this.widgetList = [];
    this.widgetListtabs = [];
    let _list = this._service.getSession("widgetlist");
    if (_list == null || _list == "") {
      this._service
        .getStaticData("assets/dashboard.json")
        .subscribe((resp: any) => {
          // console.log(resp);
          // this._service.setSession("widgetlist", JSON.stringify(resp));
          this.tmpalllist = JSON.parse(JSON.stringify(resp.list));
          this.widgetListtabs = resp.list.filter(x=>x.showheader==true);
          this.assigncss(0);

          this.widgetList = this.widgetListtabs[0].list;
          this.bindWidgetsList();
        });
    } else {
      this.widgetListtabs = JSON.parse(_list);
      this.widgetListtabs = this.widgetListtabs.filter(x=>x.showheader==true);
      this.assigncss(0);
      this.widgetList = this.widgetListtabs[0].list;
      this.bindWidgetsList();
    }

    //this._service.postData('reports/widgettypes', {}).toPromise().then((res: any) => {
    //  this.widgetList = res.data;
    //  if (pgload == '0') this.bindWidgetsList();
    //}).catch((error: HttpErrorResponse) => { });
  }
  helptoggle() {
    this.isActive = !this.isActive;
  }
  bindWidgetsList() {
    this.enableOrDisableWidget();
    let iCnt = 1;
    this.widgetList.forEach((graph: any) => {
      setTimeout(() => {
        var filterId = "filter_" + graph.id + "_" + graph.widgetid;
        let filterData: any = {};
        this.bindWidget(graph.id, graph.widgetid, filterData, graph);
      }, 2000);
      iCnt++;
    });
  }

  bindWidget(id: string, wid: string, filterData: any, graphdata: any) {
    if (window.location.href.indexOf("dashboard") == -1) {
      return;
    }
    //  this.range = { fromDate: moment().subtract(120, 'minute'), toDate: moment(), live: '1' };
    let loadDivId = "spin_" + id + "_" + wid;
    let msgDivId = "msg_" + id + "_" + wid;
    let chartDivId = "chart_" + id + "_" + wid;
    let filterDivId = "filter_" + id + "_" + wid;
    try {
      try {
        if (this.range.fromDate < moment().subtract(180, "days")) {
          console.log("return start");
          return;
        }
        if (this.range.toDate > moment().endOf("day")) {
          // console.log("return end");
          // return;
          this.range.toDate = moment();
        }
      } catch (e) {}
      let payload: any = {
        widgetid: wid,
        datestart: this.range.fromDate,
        dateend: this.range.toDate,
        filters: filterData,
      };
      let fromDate, endDate;
      //console.log(formatDate(this.range.fromDate, 'yyyy-MM-dd HH:mm:ss', 'en-US', '') + "|" + formatDate(this.range.toDate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''))
      if (
        formatDate(this.range.fromDate, "yyyy-MM-dd", "en-US", "") ==
          formatDate(new Date(), "yyyy-MM-dd", "en-US", "") &&
        graphdata.name.indexOf("(D-1)") > 0
      ) {
        let _tmp = this.range.fromDate.clone();
        // console.log(_tmp)
        fromDate = _tmp.subtract(1, "days").format("YYYY-MM-DD 00:00:00");
      } else {
        fromDate = formatDate(
          this.range.fromDate,
          "yyyy-MM-dd HH:mm:ss",
          "en-US",
          ""
        );
      }
      if (
        formatDate(this.range.toDate, "yyyy-MM-dd", "en-US", "") ==
          formatDate(new Date(), "yyyy-MM-dd", "en-US", "") &&
        graphdata.name.indexOf("(D-1)") > 0
      ) {
        // endDate = moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss");
        let _tmp = this.range.toDate.clone();
        // console.log(_tmp)
        endDate = _tmp.subtract(1, "days").format("YYYY-MM-DD 23:59:59");
      } else {
        endDate = formatDate(
          this.range.toDate,
          "yyyy-MM-dd HH:mm:ss",
          "en-US",
          ""
        );
      }
      console.log(graphdata.name + "|" + fromDate + "|" + endDate);
      payload = {
        reqId: wid,
        userId: this._service.getUserId(),
        roleId: this._service.get7digitRole(this._service.getRole()),
        widgetId: wid,
        dateFilter: {
          dateStart: fromDate,
          dateEnd: endDate,
        },
        dateIndex: -1,
        query: "",
      };

      if (filterData != null && filterData.length > 0) {
        payload.queryFields = filterData;
      }

      $("#" + loadDivId).show();
      $("#" + chartDivId).hide();
      $("#" + loadDivId).hide();
      $("#" + msgDivId)
        .show()
        .text("Loading...");

      this._service
        .postDataNoLoader("bi-reports-api/getwidgetdata", payload)
        .toPromise()
        .then((res: any) => {
          if (window.location.href.indexOf("dashboard") == -1) {
            return;
          }
          let chartInfo: any = this.emptyChartInfo;
          if (res.code == "200") {
            try {
              let _respdata = null;
              try {
                _respdata = JSON.parse(res.data);
                if (JSON.parse(res.data).transactionInfo.filter_data)
                  graphdata.enablefilter = true;
              } catch (e) {}
              if (
                _respdata != null &&
                _respdata.transactionInfo != null &&
                _respdata.transactionInfo.transactions != null &&
                _respdata.transactionInfo.transactions.length > 0
              )
                this.drawdata(
                  JSON.parse(res.data),
                  chartDivId,
                  msgDivId,
                  loadDivId
                );
              else {
                $("#" + msgDivId)
                  .show()
                  .text("No Records Found");
              }
            } catch (e) {
              $("#" + msgDivId)
                .show()
                .text("No Records Found");
            }
          }
        })
        .catch((error: HttpErrorResponse) => {
          $("#" + chartDivId).hide();
          $("#" + loadDivId).hide();
          $("#" + msgDivId)
            .show()
            .text("No Results found");
        });
    } catch (e) {
      $("#" + chartDivId).hide();
      $("#" + loadDivId).hide();
      $("#" + msgDivId)
        .show()
        .text("No Results found");
    }
  }
  assigncss(tab) {
    try {
      for (let i = 0; i < this.widgetListtabs[tab].list.length; i++) {
        if (
          (this.widgetListtabs[tab].list[i].cssclass == null ||
            this.widgetListtabs[tab].list[i].cssclass == undefined ||
            this.widgetListtabs[tab].list[i].cssclass == "") &&
          this.widgetListtabs[tab].list[i].showwidget != false
        )
          this.widgetListtabs[tab].list[i].cssclass = "col-md-4";

        if (
          this.widgetListtabs[tab].list[i].showfilter == null ||
          this.widgetListtabs[tab].list[i].showfilter == undefined
        ) {
          this.widgetListtabs[tab].list[i].showfilter = false;
          this.widgetListtabs[tab].list[i].filterselected = [];
          this.widgetListtabs[tab].list[i].enablefilter = false;
          this.widgetListtabs[tab].list[i].zoomstatus = false;
        }
      }
    } catch (e) {}
  }

  channelslist: any[] = [];
  operationtypelist: any[] = [];
  statuslist: any[] = [
    { id: "1", name: "Active" },
    { id: "0", name: "Inactive" },
  ];
  usertypelist: any[] = [
    { id: "Prepaid", name: "Prepaid" },
    { id: "Postpaid", name: "Postpaid" },
  ];
  transactiontypelist: any[] = [];
  paymentchannellist: any[] = [];
  paymenttypelist: any[] = [];
  filtertypelist: any[] = [];

  filterinfo: any;

  selectedreport: any;
  filterselected: any;
  filterobj: any = {
    filtertype: "",
    comparator: "=",
    filtervalue: "",
    comparelist: [
      { id: "=", name: "Equal" },
      { id: "like", name: "Like" },
    ],
    mode: "insert",
  };
  filterobjlist: any[] = [];
  isQueryFilter: Boolean = false;
  saveQuery: Boolean = false;
  isDisplayFilter: Boolean = false;
  displayedColumnsFilter: any[] = [];
  getfiltervalues() {
    let requesrParams = {
      search: "",
      filterBy: "REPORTS",
      start: 1,
      length: 100,
      orderDir: "desc",
    };
    let _filterlist = this._service.getSession("reports_filters_masters");
    if (_filterlist == null || _filterlist == undefined || _filterlist == "") {
      this._service
        .postData("globalsettings/getall", requesrParams)
        .subscribe((response: any) => {
          if (response.code == "200") {
            if (response.data && response.data.length > 0) {
              let _itemlist = [];
              let _items = response.data;
              this.formfiltermasterdata(_items);
              this._service.setSession(
                "reports_filters_masters",
                JSON.stringify(response.data)
              );
            }
          }
        });
    } else {
      this.formfiltermasterdata(JSON.parse(_filterlist));
    }
  }

  formfiltermasterdata(_items) {
    for (let i = 0; i < _items.length; i++) {
      if (_items[i].keyword == "REPORT_OPERATION_TYPES") {
        this.operationtypelist = this.getfilterlist(_items[i].value);
      } else if (_items[i].keyword == "REPORT_TRANSACTION_TYPES") {
        this.transactiontypelist = this.getfilterlist(_items[i].value);
      } else if (_items[i].keyword == "REPORT_PAYMENT_CHANNELS") {
        this.paymentchannellist = this.getfilterlist(_items[i].value);
      } else if (_items[i].keyword == "REPORT_PAYMENT_TYPES") {
        this.paymenttypelist = this.getfilterlist(_items[i].value);
      }
    }
  }
  getfilterlist(_txt) {
    let _list: any[] = [];
    try {
      for (let j = 0; j < _txt.split(",").length; j++) {
        var _key = _txt.split(",")[j];
        _list.push({
          id: _key.split("|")[0],
          name: _key.split("|")[1].toUpperCase(),
        });
      }
    } catch (e) {}
    return _list;
  }
  getwidgetinfo(gfdata) {
    if (gfdata.showfilter) {
      gfdata.showfilter = false;
      this.reloadwidget(gfdata);
      return;
    }
    gfdata.showfilter = true;

    this.selectedreport = gfdata;
    let requestParams = {
      reqId: gfdata.id,
      userId: this._service.getUserId(),
      roleId: this._service.get7digitRole(this._service.getRole()),
      widgetId: gfdata.id,
    };
    this.filtertypelist = [];
    let _tmpwidinfo = this._service.getSession(
      "widget_filters_masters_" + gfdata.id
    );
    if (_tmpwidinfo == null || _tmpwidinfo == undefined || _tmpwidinfo == "") {
      this._service
        .postData("bi-reports-api/getwidgetinfo", requestParams)
        .toPromise()
        .then(
          (response: any) => {
            if (response.code == "500") {
              this._service.openDialog("warning", response.message);
              return;
            } else if (response.code == "200") {
              let _json = JSON.parse(response.data);
              if (
                _json != null &&
                _json.queryFields != null &&
                _json.queryFields.length > 0
              ) {
                // console.log(_json.queryFields);
                this.filterinfo = _json;
                this._service.setSession(
                  "widget_filters_masters_" + gfdata.id,
                  JSON.stringify(_json)
                );
                this.formdisplaycolumns();
              } else {
                this._service.openSnackBar("No Fitlers");
              }
            }
          },
          (err) => {
            this._service.HandleHTTPError(err);
          }
        );
    } else {
      this.filterinfo = JSON.parse(_tmpwidinfo);
      this.formdisplaycolumns();
    }
  }

  changefiltertype() {
    switch (this.filterobj.filtertype + "") {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "8":
        this.filterobj.comparelist = [{ id: "1", name: "Equal" }];
        break;
      case "7":
      case "9":
        this.filterobj.comparelist = [{ id: "2", name: "Like" }];
        break;
    }
    this.filterobj.filtervalue = "";
  }
  formdisplaycolumns() {
    try {
      let _qryfiled = null;
      if (this.filterinfo.queryFields != null)
        _qryfiled = this.filterinfo.queryFields;
      for (let i = 0; i < _qryfiled.length; i++) {
        let _qry = _qryfiled[i];
        let _filtertype = "";
        if (_qry.fieldName.toLowerCase() == "date") continue;
        switch (_qry.fieldName.toLowerCase()) {
          case "channel":
            _filtertype = "5";
            break;
          case "paymenttype":
            _filtertype = "1";
            break;
          case "paymentchannel":
            _filtertype = "2";
            break;
          case "transactiontype":
            _filtertype = "3";
            break;
          case "usertype":
            _filtertype = "4";
            break;
          case "productname":
            _filtertype = "7";
            break;
          case "status":
            _filtertype = "6";
            break;
          case "operationtype":
            _filtertype = "8";
            break;
          case "clientip":
            _filtertype = "9";
            break;
          case "nodeip":
            _filtertype = "9";
            break;
          case "ip":
            _filtertype = "9";
            break;
        }

        let _itm = {
          filtertype: _filtertype,
          comparator: "",
          filtervalue: "",
        };
        this.filtertypelist.push({
          id: _filtertype,
          name: _qry.displayName.toUpperCase(),
        });
        this.filterobjlist.push(_itm);
      }

      this.filtertypelist = JSON.parse(JSON.stringify(this.filtertypelist));
      this.filterobjlist = JSON.parse(JSON.stringify(this.filterobjlist));

      this.changefiltertype();
    } catch (e) {}
  }
  addfilter() {
    let isNew = true;
    if (
      !this._service.isvalidtext(
        this.filterobj.filtertype,
        "Select Filter Type"
      )
    )
      return;

    if (
      !this._service.isvalidtext(
        this.filterobj.comparator,
        "Select Compare Type"
      )
    )
      return;
    if (
      !this._service.isvalidtext(
        this.filterobj.filtervalue,
        "Select Filter Value"
      )
    )
      return;

    if (
      this.selectedreport.filterselected != null &&
      this.selectedreport.filterselected.length > 0
    ) {
      for (let i = 0; i < this.selectedreport.filterselected.length; i++) {
        if (
          this.selectedreport.filterselected[i].filtertype ==
          this.filterobj.filtertype
        ) {
          this._service.openDialog("warning", "Filter already added");
          isNew = false;
          break;
        }
      }
    }
    if (isNew) {
      let _itm = {
        filtertype: this.filterobj.filtertype,
        comparator: this.filterobj.comparator,
        filtervalue: this.filterobj.filtervalue,
        comparelist: this.filterobj.comparelist,
        mode: "update",
      };
      if (
        this.selectedreport.filterselected == null ||
        this.selectedreport.filterselected == undefined ||
        this.selectedreport.filterselected.length == 0
      )
        this.selectedreport.filterselected = [];

      this.selectedreport.filterselected.push(_itm);
      this.bindWidget(
        this.selectedreport.id,
        this.selectedreport.widgetid,
        this.forreportqueryfields(this.selectedreport.filterselected),
        this.selectedreport
      );
      this.filterobj.filtertype = "";
      this.filterobj.comparator = "";
      this.filterobj.filtervalue = "";
    }
  }
  removefilter(itm) {
    if (
      this.selectedreport.filterselected != null &&
      this.selectedreport.filterselected.length > 0
    ) {
      for (let i = 0; i < this.selectedreport.filterselected.length; i++) {
        if (
          this.selectedreport.filterselected[i].filtertype == itm.filtertype
        ) {
          this.selectedreport.filterselected.splice(i, 1);
          this._service.openDialog("warning", "Filter Removed");

          break;
        }
      }
    }
  }
  reloadwidget(itmwdgt) {
    try {
      itmwdgt.showfilter = false;
      this.bindWidget(
        itmwdgt.id,
        itmwdgt.widgetid,
        this.forreportqueryfields(itmwdgt.filterselected),
        itmwdgt
      );
    } catch (e) {}
  }

  forreportqueryfields(filterselected) {
    let _qrylist = [];
    try {
      if (
        filterselected != null &&
        filterselected != undefined &&
        filterselected.length > 0
      ) {
        for (let i = 0; i < filterselected.length; i++) {
          let _filterval = filterselected[i].filtertype;
          let _filtername = this.filtertypelist.filter(function (ele, idx) {
            return ele.id == _filterval;
          });
          let _qryfld = this.filterinfo.queryFields.filter(function (ele, idx) {
            return (
              ele.fieldName.toLowerCase() == _filtername[0].name.toLowerCase()
            );
          });
          if (_qryfld == null || _qryfld == undefined || _qryfld.length == 0) {
            _qryfld = this.filterinfo.queryFields.filter(function (ele, idx) {
              return (
                ele.displayName.toLowerCase() ==
                _filtername[0].name.toLowerCase()
              );
            });
          }
          if (_qryfld != null && _qryfld != undefined && _qryfld.length > 0) {
            var _qryfields = JSON.parse(JSON.stringify(_qryfld));
            _qryfields[0].operType = "=";
            if (filterselected[i].comparator == "1") {
              _qryfields[0].operType = "=";
            } else if (filterselected[i].comparator == "2") {
              _qryfields[0].operType = "LIKE";
            }

            _qryfields[0].filedValue = [];
            if (filterselected[i].comparator == "2")
              _qryfields[0].filedValue.push(
                "%" + filterselected[i].filtervalue + "%"
              );
            else
              _qryfields[0].filedValue.push(filterselected[i].filtervalue + "");
            _qryfields[0].metaData = "";
            if (filterselected[i].comparator == "2")
              _qryfields[0].metaData =
                '[{"value":"%' +
                filterselected[i].filtervalue +
                '%","text":"' +
                filterselected[i].filtervalue +
                '"}]';
            else
              _qryfields[0].metaData =
                '[{"value":"' +
                filterselected[i].filtervalue +
                '","text":"' +
                filterselected[i].filtervalue +
                '"}]';
            _qrylist.push(_qryfields[0]);
          }
        }
      }
    } catch (e) {
      // console.log(e);
    }
    return _qrylist;
  }
  drawdata(data, chartDivId, msgDivId, loadDivId) {
    let chartInfo: any = this.emptyChartInfo;
    const chartPlotlyInfo: any = data.transactionInfo.chartInfo;
    if (chartPlotlyInfo && chartPlotlyInfo.chartData) {
      chartInfo = chartPlotlyInfo;
      chartInfo.layout.showlegend = true;
      chartInfo.layout.autosize = true;
      chartInfo.layout.legend.font = {
        size: 10,
        color: "#000",
      };
    }

    $("#" + chartDivId).show();
    $("#" + msgDivId).hide();
    $("#" + loadDivId).hide();
    //,modeBarButtonsToRemove: ['sendDataToCloud', 'select2d', 'lasso2d']
    Plotly.newPlot(chartDivId, chartInfo.chartData, chartInfo.layout, {
      displayModeBar: false,
      displaylogo: false,
    }).then(function () {
      $("#" + chartDivId)
        .show()
        .addClass("responsive-plot");
    });
  }
  zoomdata(itmwdgt) {
    try {
      itmwdgt.showfilter = false;
      if (!itmwdgt.zoomstatus) {
        $("#ds_cont_w_" + itmwdgt.id).addClass("zoomchart");
      } else {
        $("#ds_cont_w_" + itmwdgt.id).removeClass("zoomchart");
      }
      itmwdgt.zoomstatus = !itmwdgt.zoomstatus;
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.bindWidget(
        itmwdgt.id,
        itmwdgt.widgetid,
        this.forreportqueryfields(itmwdgt.filterselected),
        itmwdgt
      );
    } catch (e) {}
  }
  enableOrDisableWidget() {
    this.widgetList = this.widgetList.filter((x) => x.showwidget == true);
  }
}
