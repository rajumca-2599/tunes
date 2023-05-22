import { Component, OnInit, NgZone, HostListener, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../shared/services/common.service';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent, MatTableDataSource, MatPaginator } from '@angular/material';
import { MsgdialogueboxComponent } from '../../../shared/msgdialoguebox/msgdialoguebox.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddUserComponent } from '../add-user/add-user.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { userclass } from '../../../shared/models/enum.models';


@Component({
  selector: 'app-offer-packs',
  templateUrl: './offer-packs.component.html',
  styleUrls: ['./offer-packs.component.css']
})
export class OfferPacksComponent implements OnInit {

  displayedColumns: string[] = ["offerid", "type", "name", "class", "description", "logo", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;

  public draw: any;
  public serviceProvidersList: any;
  public permission: any;
  public loginRole: any;
  public showBU = '1';
  public userType: any;
  public userTypesList: any;
  public searchString: any = "";
  public usp: any = "";
  public fusp: any = "";
  public resetpwdinfo: any;
  public userObj: any;
  public fstatus: any = "";
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog, private zone: NgZone) {
    this.resetpwdinfo = {
      newpswd: "",
      confirmpswd: "",
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
    this.orderByObject.direction = column.direction;

    this.gettransactions();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  ngOnInit() {
    this.GetRoles();
    this.pageObject.pageNo = 1;
    this.pageObject.pageSize = 20;
    this.pageObject.totalPages = 0;
    this.pageObject.totalRecords = 0;

    this.orderByObject.ordercolumn = "";
    this.orderByObject.direction = "";

    this.draw = "";
    this.loginRole = this.ccapi.getRole();

    this.GetParentUserList();
    this.ShowBusinessUnit();
    this.gettransactions();

  }

  addofferpack(id: any): void {
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
        data: this.userObj,
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
    else {
      let url = "user/GetUserDetailsByID/" + id;
      this.ccapi.postData(url, {}).subscribe((resp: any) => {
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
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
          });
        }
        else {
          this.ccapi.openDialog('error', "Dear User, Currently we cannot process your request");
          return;
        }
      });
    }
  }

  manageUserRights(userid: any) {
    this.router.navigate(["/home/managerights/" + userid]);
  }
  resetPassword(userid: any, loginid: any) {
    let resetpwdinfo = {
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
    let postdata = {
      email: emailid,
      captcha: '',
      userrole: userrole,
      id: userid
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
        this.ccapi.postData("user/SendPassword", postdata).subscribe((resp: any) => {
          console.log(resp);
          if (resp.code == "200") {
            this.ccapi.openDialog('success', 'Password reset mail sent to User email.');
          }
        });
      }
    });
  }



  gettransactions() {

    let requesrParams = {
      pageno: this.pageObject.pageNo,
      pagesize: this.pageObject.pageSize,
      ordercolumn: this.orderByObject.ordercolumn,
      order: this.orderByObject.direction,

    }
    this.ccapi.postData('user/offerspacklist', requesrParams).subscribe((response: any) => {
      if (response.code == "500" && response.status == "error") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200" && response.status == "success") {
        if (response && response.data && response.data) {
          this.dataSource = new MatTableDataSource(response.data);
          this.pageObject.totalRecords = response.pageinfo.totalrecords;
          this.pageObject.totalPages = response.pageinfo.totalpages;
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;

        }
      }
      else {
        alert();
      }
    });
  };


  getUsersData() {
    this.gettransactions();
  }


  public GetParentUserList() {
    let postData = { userrole: parseInt('1010002'), username: "", pageno: 1, pagesize: 1000 };
    this.ccapi.postData("user/GetParentUserList", postData).subscribe((response: any) => {
      if (response.code == '200' && response.status == 'success') {
        this.serviceProvidersList = response.data;
        try {
          this.permission = response.permission;
        } catch (e) { }
      }
      else {
        this.ccapi.openDialog('error', "No service providers found");
      }
    });
  }

  public ShowBusinessUnit() {

    if (this.loginRole == '1010005') {
      this.showBU = "0";
      // buadmin = true;
    }
    else {

      if (this.userType == "1010003" || this.userType == "1010004" || this.userType == "1010005"
        || this.userType == "1010010" || this.userType == "1010012" || this.userType == "1010013"
        || this.userType == "1010014" || this.userType == "1010015" || this.userType == "1010016") {
        this.showBU = "1";
      }
      else {
        this.showBU = "0";
      }
    }
  }

  public GetRoles() {
    let roles = this.ccapi.GetRoles().then(
      (res: any) => { // Success
        if (res.code != null && res.code == "200") {
          this.userTypesList = res.data;
          if (this.loginRole == '1010005') {
            for (let i = 0; i < this.userTypesList.length; i++) {
              if (this.userTypesList[i].id != '1010012') {
                this.userTypesList.splice(i, 1);
                i--;
              }
            }
          }
          else {
            for (let i = 0; i < this.userTypesList.length; i++) {
              if (this.userTypesList[i].id != '1010012' && this.userTypesList[i].id != '1010005') {
                this.userTypesList.splice(i, 1); i--;
              }
            }
          }
          if (this.userTypesList.length > 0) {
            this.userType = this.userTypesList[0].id;
          }
          //this.gettransactions();

          this.getPage({ pageIndex: (this.pageObject.pageNo), pageSize: this.pageObject.pageSize });

        }
        else {
          this.ccapi.openDialog("error", "No this.usertypes found.");
        }
      },
      (msg: any) => { // Error
        this.ccapi.openDialog("error", "No this.usertypes found.");
      }
    );
  }



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
  public direction: string = "";
}

