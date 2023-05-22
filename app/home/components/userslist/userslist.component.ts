
import { Component, OnInit, NgZone, HostListener, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../shared/services/common.service';
//import { CcfactoryService } from "../../../shared/services/ccfactory.service";
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MsgdialogueboxComponent } from '../../../shared/msgdialoguebox/msgdialoguebox.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddUserComponent } from '../add-user/add-user.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
//import { element } from '@angular/core/src/render3';
import { userclass } from '../../../shared/models/enum.models';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-userslist',
  templateUrl: './userslist.component.html',
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
  styleUrls: ['./userslist.component.css']
})




// declare var require: any;
// var $ = require('jquery');
// var dt = require('datatables.net');
// var dd = require('datatables-fixedcolumns');

export class UserslistComponent implements OnInit {

  displayedColumns: string[] = ["id", "name", "mobileNo", "emailid", "loginid", "userrole", "createddate", "status", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;

  public draw: any;
  public serviceProvidersList: any;
  public permission: any;
  public loginRole: any;
  public showBU = '1';
  public userTypesList: any;
  public usp: any = "";
  public resetpwdinfo: any;
  public userObj: any;
  public searchObj: any;
  showreset: Boolean = false;
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog, private zone: NgZone) {
    // let loginrole:any = IMIapp.getRole();
    this.resetpwdinfo = {
      newpswd: "",
      confirmpswd: "",
    }
    this.searchObj = {
      fstatus: '',
      searchString: "",
      userType: "",
      fusp: ""
    }

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
    this.gettransactions();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.gettransactions();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.orderDir = column.direction;

    this.gettransactions();
  }
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit() {
    this.searchObj.fstatus = 1;
    this.GetRoles();
    this.pageObject.pageNo = 1;
    this.pageObject.pageSize = 20;
    this.pageObject.totalPages = 0;
    this.pageObject.totalRecords = 0;

    this.orderByObject.ordercolumn = "";
    this.orderByObject.orderDir = "";

    this.draw = "";
    this.loginRole = this.ccapi.getRole();
    if (this.loginRole == 101000) {
      this.showreset = true;
    }

  }

  createuserDialog(id: any): void {
    if (id == null && id == undefined) {
      this.userObj = {
        userid: 0,
        user: null,
        roles: this.userTypesList,
        buunits: this.serviceProvidersList,
        mode: "insert"
      }
      const dialogRef = this.dialog.open(AddUserComponent, {
        width: '850px',
        minHeight: '550px',
        data: this.userObj,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.gettransactions();
        }
        console.log('The dialog was closed');
      });
    }
    else {
      var url = "user/getbyuserid";
      let obj = {
        "userId": id, "userid": id
      };
      this.ccapi.postData(url, obj).subscribe((resp: any) => {
        if (resp.code == "200") {
          this.userObj = {
            userid: id,
            user: resp.data,
            roles: this.userTypesList,
            buunits: this.serviceProvidersList,
            mode: "update"
          }
          const dialogRef = this.dialog.open(AddUserComponent, {
            width: '850px',
            data: this.userObj,
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result != undefined) {
              this.gettransactions();
            }
            console.log('The dialog was closed');
          });
        }
        else {
          this.ccapi.openDialog('error', "Dear User, Currently we cannot process your request");
          return;
        }
      }, (error => {
        this.ccapi.HandleHTTPError(error);
      }));
    }
  }
  getStatus(status: any): string {
    if (status == "1") {
      return "Active";
    } else {
      return "Inactive";
    }
  };

  manageUserRights(userid: any) {
    this.router.navigate(["/home/managerights/" + userid]);
  }
  resetPassword(userid: any, loginid: any) {
    var resetpwdinfo = {
      loginid: loginid,
      userid: userid
    }
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '850px',
      data: resetpwdinfo,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


  sendPassword(emailid: any, userrole: any, userid: any) {
    var postdata = {
      email: emailid,
      captcha: '',
      userrole: userrole,
      loginId: userid
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      width: '400px',
      data: {
        message: 'Are you sure to send reset password link to  - ' + emailid + '?',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.ccapi.postData("user/forgotpassword", postdata).subscribe((resp: any) => {
          if (resp.code == "200") {
            this.ccapi.openDialog('success', 'Password reset mail sent to User email.');
          }
          else {
            this.ccapi.openDialog('error', resp.message);
          }
        }, (error => {
          this.ccapi.HandleHTTPError(error);
        }));
      }
    });
  }

  //ngAfterViewInit() {

  //  $('#users_grid').on("click", ".edituser", function () {
  //    window["edituser"]($(this).attr("data-id"));
  //  });
  //  $('#users_grid').on("click", ".manageuserrights", function () {
  //    window["manageuserrights"]($(this).attr("data-id"));
  //  });
  //  $('#users_grid').on("click", ".resetpassword", function () {
  //    window["resetpassword"]($(this).attr("data-id"), $(this).attr("data-loginid"));
  //  });
  //  $('#users_grid').on("click", ".sendpassword", function () {
  //    window["sendpassword"]($(this).attr("data-emailid"), $(this).attr("data-userrole"), $(this).attr("data-id"));
  //  });
  //}


  gettransactions() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;

    var fstatus = this.searchObj.fstatus;
    // if (this.searchObj.fstatus == "") {
    //   fstatus = "0,1,2,3";
    // }

    let requesrParams = {
      parentid: "",
      search: this.searchObj.searchString,
      status: fstatus,
      roleId: this.searchObj.userType,
      //startdate: this.dateObject.startDate.format('YYYY-MM-DD HH:mm').toString(),
      //enddate: this.dateObject.endDate.format('YYYY-MM-DD HH:mm').toString(),
      start: start,
      length: this.pageObject.pageSize,
      ordercolumn: this.orderByObject.ordercolumn,
      orderDir: "desc"

    }
    //this.spinner.show();
    this.ccapi.postData('user/userlist', requesrParams).subscribe((response: any) => {
      //response = messageTrans;  //TEMP
      this.ccapi.hidehttpspinner();
      if (response.code == "500" && response.status == "error") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.data != null && response.data.length > 0) {
          this.dataSource = new MatTableDataSource(response.data);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          this.dataSource.sort = this.sort;
          //this.pageObject.totalRecords = response.data.length;
          //this.pageObject.totalPages = response.data.length;
          //this.pageObject.pageSize = dataTablesParameters.length;

        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.ccapi.openSnackBar("No Records Found");

        }
      }
    }, (error => {

      this.ccapi.HandleHTTPError(error);
    }));
  };

  getUsersDataList(){
    this.paginator.pageIndex = 0;
    this.pageObject.pageNo = 1;
    this.gettransactions();
  }
  getUsersData() {
    this.gettransactions();
  }





  getchannel(channels: any): string {
    let str: string = '';
    if (channels != undefined && channels != null && channels.length > 0) {
      str = channels[0];
    }
    return str;
  }

  public GetRoles() {
    let _ustypes = this.ccapi.getSession("userroleslist")
    if (_ustypes == null || _ustypes == undefined || _ustypes == "") {
      var roles = this.ccapi.GetRoles().then(
        (res: any) => { // Success
          if (res.code != null && res.code == "200") {
            this.userTypesList = res.data;

            if (this.userTypesList.length > 0) {
              for (let i = this.userTypesList.length - 1; i >= 0; i--) {
                if (this.userTypesList[i].roleId == this.ccapi.getRole() || this.userTypesList[i].roleId == 101000) {
                  this.userTypesList.splice(i, 1);
                }
              }
            }

            this.searchObj.userType = this.userTypesList[0].roleId;
            this.ccapi.setSession("userroleslist", JSON.stringify(this.userTypesList));
            this.getUsersData();
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
      this.userTypesList = JSON.parse(this.ccapi.getSession("userroleslist"));
      this.searchObj.userType = this.userTypesList[0].roleId;
      this.gettransactions();
      this.getPage({ pageIndex: (this.pageObject.pageNo), pageSize: this.pageObject.pageSize });

    }
  }

  GetUserStatus() {

  }

  //dispFixedCols() {
  //  if (1) {
  //    return {
  //      leftColumns: 1,

  //    };
  //  } else {
  //    return false;
  //  }

  //}
  toggle() {
    this.isOpen = !this.isOpen;
  }
}

export class PageObject {
  public pageNo: number = 0;
  public pageSize: number = 10;
  public totalRecords: number = 0;
  public totalPages: number = 0;
}


export class OrderByObject {
  public ordercolumn: string = "";
  public orderDir: string = "";
}

