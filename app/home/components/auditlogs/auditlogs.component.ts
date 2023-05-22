import { Component, OnInit, ViewChild } from '@angular/core';

import { PageObject, OrderByObject } from '../userslist/userslist.component';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { CommonService } from '../../../shared/services/common.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-auditlogs',
  templateUrl: './auditlogs.component.html',
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
  styleUrls: ['./auditlogs.component.css']
})
export class AuditlogsComponent implements OnInit {

  constructor(private ccapi: CommonService) { }
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public userTypesList: any;
  startdate: any;
  mapdate: any;
  mindate: Date = new Date();
  currentdate: Date = new Date();
  dropdownSettings = {};
  searchStr = "";
  selectedUserType = "";
  dropdownList = [];
  selectedItems: any;
  d = new Date();
  year = this.d.getFullYear();
  month = this.d.getMonth();
  day = this.d.getDate();
  displayedColumns: string[] = ["accesskey", "method","trans_type", "timetaken", "nodeip", "originating_timestamp", "errorcode", "errordescription"];
  endDate: Date = new Date();
  ngOnInit() {
    this.mindate.setDate(new Date().getDate() - 30);
    this.GetRoles();
    this.currentdate = new Date();
    this.startdate = [
      new Date(new Date().setDate(new Date().getDate() - 3)),
      new Date()
    ];

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'userid',
      textField: 'loginId',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 7,
      allowSearchFilter: true
    };
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
    this.getAuditLog();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getAuditLog()
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.orderDir = column.direction;


  }
  resetdata() {
    this.pageObject.pageNo = 0;
    this.dataSource = new MatTableDataSource([]);
    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0; this.dataSource.sort = this.sort;

  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  public GetRoles() {
    let _ustypes = this.ccapi.getSession("userroleslist");
    _ustypes = null;
    if (_ustypes == null || _ustypes == undefined || _ustypes == "") {
      var roles = this.ccapi.GetRoles().then(
        (res: any) => { // Success
          if (res.code != null && res.code == "200") {
            this.userTypesList = res.data;
            console.log(this.userTypesList);
            if (this.userTypesList.length > 0 && this.ccapi.getRole() != 101000) {
              for (let i = this.userTypesList.length - 1; i >= 0; i--) {
                if (this.userTypesList[i].roleId == this.ccapi.getRole() || this.userTypesList[i].roleId == 101000) {
                  this.userTypesList.splice(i, 1);
                }
              }
            }
            this.selectedUserType = this.userTypesList[0].roleId;
            this.getUsers();
            this.ccapi.setSession("userroleslist-audit", JSON.stringify(this.userTypesList));

          }
          else {
            this.ccapi.openDialog("error", "No users found.");
          }
        },
        (msg: any) => { // Error
          this.ccapi.openDialog("error", "No users found.");
        }
      );
    }
    else {
      this.userTypesList = JSON.parse(this.ccapi.getSession("userroleslist-audit"));
      console.log(this.userTypesList);
      this.selectedUserType = this.userTypesList[0].roleId;
      this.getUsers();
      this.getPage({ pageIndex: (this.pageObject.pageNo), pageSize: this.pageObject.pageSize });

    }
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }

  getUsers() {

    this.selectedItems = [];
    this.dropdownList = [];
    if (this.selectedUserType == "101000") {
      this.dropdownList.push({
        loginId: this.ccapi.getloginid(),
        mobileNo: this.ccapi.getOauth().mobileNo,
        name: this.ccapi.getOauth().name,
        roleId: 101000,
        userRole: "Super Admin",
        userStatus: 1,
        userid: this.ccapi.getOauth().userId,
      });
      return;
    }
    let start = 1;
    let requesrParams = {
      parentid: "",
      search: this.searchStr,
      roleId: this.selectedUserType,
      start: start,
      length: 1000,
      ordercolumn: this.orderByObject.ordercolumn,
      status: 1,
      orderDir: "desc"
    }
    this.ccapi.postData('user/userlist', requesrParams).subscribe((response: any) => {
      this.ccapi.hidehttpspinner();
      if (response.code == "500" && response.status == "error") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.data != null && (response.data !== undefined && response.data.length > 0)) {
          this.dropdownList = response.data;
        }
        else {
          this.dropdownList = [];
          this.selectedItems = "";
        }
      }
    }, (error => {
      this.ccapi.HandleHTTPError(error);
    }));
  }
  getAuditLog() {
    if (this.selectedItems == null || this.selectedItems.length == 0) {
      this.ccapi.openDialog("warning", "Select User"); return;
    }
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;

    let searchString = {
      startdate: formatDate(this.startdate[0], 'yyyy-MM-dd ', 'en-US', ''),
      enddate: formatDate(this.startdate[1], 'yyyy-MM-dd ', 'en-US', ''),
      loginid: this.selectedItems[0].loginId,
      length: this.pageObject.pageSize,
      start: start
    }
    this.ccapi.postData('reports/getcmslogs', searchString).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200" && (response.data !== undefined && response.data.length > 0)) {
        this.dataSource = new MatTableDataSource(response.data);
        this.pageObject.totalRecords = response.recordsTotal;
        this.pageObject.totalPages = response.recordsFiltered;
        this.dataSource.sort = this.sort;
      }
      else {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0; this.dataSource.sort = this.sort;
        this.ccapi.openSnackBar("No Records Found");
      }
    }, (error => {

    }));

  }
}