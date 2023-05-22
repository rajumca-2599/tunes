import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSort } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { CommonService } from '../../../../shared/services/common.service';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';

@Component({
  selector: 'app-fourgcities',
  templateUrl: './fourgcities.component.html',
  styleUrls: ['./fourgcities.component.css']
})
export class FourgcitiesComponent implements OnInit {
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  citycode: any = "";
  cityname: any = "";
  citydesc: any = "";
  currentcity: any;
  displayedColumns: string[] = ["code", "city", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public isAddOpen: any = false;
  public uploadgtrid: any = "";
  public attriObj: any;
  public searchString: any = "";
  public title: any = "";
  public resetVar: boolean = false;
  cities: any = "";
  citiesList: any = [];
  mode: any = "insert";
  public pageTitle: string = "Add New 4G City";
  constructor(private ccapi: CommonService) {


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
    this.get4gcities();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.get4gcities();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.get4gcities();
  }

  getallcities() {
    let start = 1;
    let requesrParams = {
      orderDir: "desc",
      search: this.searchString,
      start: 1,
      length: 1000,
    }
    let _sesscities = this.ccapi.getSession("citieslist");
    if (_sesscities == null || _sesscities == undefined || _sesscities == "") {
      this.ccapi.postData('4g/4gcoverage', requesrParams).subscribe((response: any) => {
        this.ccapi.hidehttpspinner();
        if (response.code == "500") {
          this.ccapi.openDialog("warning", "No Cities Found");
          return;
        }
        else if (response.code == "200") {
          if (response && response.data && response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
              if (response.data[i].id == null || response.data[i].id == undefined)
                response.data[i].id = i;
            }
            this.citiesList = response.data;
            this.ccapi.setSession("citieslist", JSON.stringify(response.data));
          }
          else {
            this.ccapi.openSnackBar("No Records Found");
          }
        }
      }, (err => {
        this.ccapi.HandleHTTPError(err);
      }));
    }
    else {
      this.citiesList = JSON.parse(_sesscities);
    }
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //@ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  ngAfterViewInit() {
    //this.dataSource.sort = this.sort;
  }
  ngOnInit() {
    // this.getallcities();
    this.userpermissions = this.ccapi.getpermissions("");
    this.dataSource = new MatTableDataSource([]);
    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0;
    this.pageObject.pageNo = 1;
    this.get4gcities();

  }
  get4gcitiesList() {
    this.paginator.pageIndex = 0;
    this.pageObject.pageNo = 1;
    this.get4gcities();
  }
  get4gcities() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      orderDir: "desc",
      search: this.searchString,
      start: start,
      length: this.pageObject.pageSize,
    }
    this.ccapi.postData('4g/4gcoverage', requesrParams).subscribe((response: any) => {
      this.ccapi.hidehttpspinner();
      if (response.code == "500") {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.data && response.data.length > 0) {
          this.dataSource = new MatTableDataSource(response.data);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          // this.dataSource.sort = this.sort;
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.ccapi.openDialog("warning", "No Data Found");
        }
      }
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));
  };

  toggle() {
    this.isOpen = !this.isOpen;
    this.isAddOpen = false;
  }
  toggleAdd() {
    if (this.mode == "update") {
      this.isAddOpen = false;
    }
    this.isAddOpen = !this.isAddOpen;
    this.isOpen = false;
    this.cities = "";
    this.uploadgtrid = "";
    this.pageTitle = "Add New 4G City";
    this.reset();
    this.mode == "insert";
  }
  toggleCancel() {
    this.isAddOpen = false;
    this.isOpen = true;
    this.reset();
  }

  afuConfigId = {
    formatsAllowed: ".kmz",
    maxSize: "5", theme: "dragNDrop",
    uploadAPI: {
      url: this.ccapi.getUrl("files/uploadFile"),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'accesskey': this.ccapi.getAccessKey(),
        "x-imi-uploadtype": "4"
      }
    }
  };
  DocUpload(e) {
    let res = e.response;
    let result = JSON.parse(res);
    if (result != null && result.code == "200") {
      this.ccapi.handleHttpUploadFileError(result);
      this.uploadgtrid = result.gtrId;
    }
    else {
      this.afuConfigId = {
        formatsAllowed: ".kmz",
        maxSize: "5", theme: "dragNDrop",
        uploadAPI: {
          url: this.ccapi.getUrl("files/uploadFile"),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'accesskey': this.ccapi.getAccessKey(),
            "x-imi-uploadtype": "4"
          }
        }
      };
      if (result != null && result.message != null)
        this.ccapi.openDialog("warning", result.message);
      else {
        this.ccapi.openDialog("warning", "Unable to upload file.");
      }
      return false;
    }
  }
  edit(row) {
    this.isAddOpen = true;
    this.isOpen = false;
    this.uploadgtrid = "";
    this.currentcity = row;
    this.mode = "update";
    this.cities = row.code;
    this.citycode = row.code;
    this.cityname = row.city;
    this.citydesc = row.description;
    this.pageTitle = "Edit 4G City '" + row.code + "'";
  }
  reset() {
    this.uploadgtrid = "";
    this.cities = "";
    this.citycode = "";
    this.cityname = "";
    this.citydesc = "";
    this.afuConfigId = {
      formatsAllowed: ".kmz",
      maxSize: "5", theme: "dragNDrop",
      uploadAPI: {
        url: this.ccapi.getUrl("files/uploadFile"),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'accesskey': this.ccapi.getAccessKey(),
          "x-imi-uploadtype": "4"
        }
      }
    };
    this.currentcity = null;
    this.mode = "insert";
  }
  addsegment() {

    if (this.citycode == null || this.citycode == undefined || this.citycode.trim().length < 2) {
      this.ccapi.openDialog('warning', 'Enter City Code . Minimum 2 Characters'); return false;
    }
    if (this.cityname == null || this.cityname == undefined || this.cityname.trim().length < 2) {
      this.ccapi.openDialog('warning', 'Enter City Name . Minimum 2 Characters'); return false;
    }
    if (this.citydesc == null || this.citydesc == undefined || this.citydesc.trim().length < 2) {
      this.ccapi.openDialog('warning', 'Enter City Description . Minimum 2 Characters'); return false;
    }

    if (this.uploadgtrid == null || this.uploadgtrid == undefined || this.uploadgtrid.length < 2) {
      if (this.mode != "update") {
        this.ccapi.openDialog('warning', 'Upload File'); return false;
      }
    }
    var _url = "4g/add4gcoverage";
    var req = {}
    if (this.mode == "update") {
      _url = "4g/managecity";
      req = {
        "citycode": this.citycode,
        "name": this.cityname,
        "description": this.citydesc,
        "status": "1",
        "wfstatus": "1",
        "transid": this.uploadgtrid
      }
    }
    else {

      req = {
        "citycode": this.citycode,
        "name": this.cityname,
        "description": this.citydesc,
        "status": "1",
        "transid": this.uploadgtrid
      }
    }

    this.ccapi.postData(_url, req).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
        this.reset(); this.get4gcities(); this.toggle();
      }
      else {
        this.ccapi.openDialog('error', resp.message);
      }
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));
  };
  loadStatus(status) {
    if (status == 1)
      return 'ACTIVE';
    else
      return 'INACTIVE';
  };

  donwloadfile(row: any) {
    window.open(this.ccapi.getUrl("4g/downloadfile?id=" + row.cityid));
    // this.ccapi.openDialog('success', "Downloading..");
  }
}
