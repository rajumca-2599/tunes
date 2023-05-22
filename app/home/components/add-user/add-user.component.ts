import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
//import { MyErrorStateMatcher } from '../../../shared/services/error-match/error-match.component';
import { FormControl, Validators, FormGroupDirective, NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from '../../../shared/services/common.service';
import { EnvService } from '../../../shared/services/env.service';

declare var require: any;
let $ = require('jquery');

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})

export class AddUserComponent implements OnInit {

  dropdownList = [];
  selectedItems: any = [];
  dropdownSettings = {};

  allowedChars = new Set('0123456789'.split('').map(c => c.charCodeAt(0)));
  public loginRole: any;
  public authtypelist: any[] = [];
  public masters: any;
  public servicegrouplist: any[] = [];
  public selectedservicegroups: any[] = [];
  public rolesList: any[] = [];
  public buunits: any[] = [];
  public buadmin: boolean = false;
  public isbuadmin: boolean = false;
  public OperatorsList: any[] = [];
  public usp: any;
  public userobj: any;
  public mode: string = 'insert';
  public title: string = "ADD USER";
  public servicegroups: any[] = [];
  public userservicegroups: any;
  public userid: number = 0;
  public currentUser: any;
  constructor(private ccapi: CommonService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddUserComponent>, @Inject(MAT_DIALOG_DATA) data,
  public env:EnvService) {
    dialogRef.disableClose = true;
    this.authtypelist = [{ istatus: false, authloginid: "", authtype: "ADFS", oldauthloginid: '' }, { istatus: false, authloginid: "", authtype: "LDAP", oldauthloginid: '' }];
    this.userobj = {
      uname: "",
      uusertype: "",
      status: 1,
      udepartment: "",
      uemail: "",
      umobileno: "",
      udesignation: "",
      usp: "",
      operators: "",
      uloginid: "",
      sps: "",
      loginid: "",
      uaddress: "",
      channels: [],
      selectedservicegroups: ""
    };
    this.rolesList = data.roles;
    this.buunits = data.buunits;
    this.mode = data.mode;

    if (data.user != undefined && data.user != null) {
      this.userid = data.userid
      this.title = "UPDATE USER :" + data.user.name;
      this.currentUser = data.user;
      this.GetUserDetails(data.user);
    }
    else {
      this.userobj.status = 1;
    }
  }
  GetUserDetails(userdet) {
    this.userobj.uname = userdet.userName;
    this.userobj.uemail = userdet.email;
    this.userobj.uloginid = userdet.loginId;
    this.userobj.umobileno = userdet.mobileNo;
    this.userobj.uusertype = userdet.roleId;
    this.userobj.buname = userdet.buname;
    this.userobj.status = userdet.userstatus;
    this.userobj.prevStatus = userdet.userstatus;
    this.userobj.uaddress = userdet.address;
    this.userobj.channels = userdet.channels;

    this.userobj.languageid = userdet.lang;
    if (userdet.authtype == "0") {
      userdet.authtype = "1";
    }

    if (this.userobj.uusertype == 1010013 || this.userobj.uusertype == 1010014) {
      $("#divServGroup").show();
      this.servicegroups = (userdet.servicegroup != undefined && userdet.servicegroup != null) ? userdet.servicegroup.split(',') : [];
      this.userservicegroups = userdet.servicegroup;
      //    $scope.resetselect2('ddlservicegroups', $scope.userdet.servicegroup.split(','));
    }
    else {
      $("#divServGroup").hide();
    }

    this.userobj.selectedservicegroups = [];

    if (userdet.servicegroup != undefined && userdet.servicegroup != null) {
      this.userservicegroups = userdet.servicegroup;
      let _userservicegroups = userdet.servicegroup.split(',');
      this.servicegroups = _userservicegroups;
      for (let i = 0; i < _userservicegroups.length; i++) {
        for (let j = 0; j < this.servicegrouplist.length; j++) {
          let _id = _userservicegroups[i];
          let _data2 = this.servicegrouplist[j];
          if (_id == _data2.id) {
            this.userobj.selectedservicegroups.push(this.servicegrouplist[j].id);
          }
        }
      }
    }
    this.userobj.usp = userdet.parentid;

    for (let i = 0; i < this.authtypelist.length; i++) {
      let _x = this.authtypelist[i];
      if (userdet.length > 1) {
        for (let j = 1; j < userdet.length; j++) {
          if (userdet[j] != undefined && userdet[j].authtype != null && userdet[j].authtype != undefined && userdet[j].authtype.length > 2) {
            if (userdet[j].authtype == _x.authtype && userdet[j].istatus == "1") {

              this.authtypelist[i].istatus = true;
              if (userdet[j].authloginid != undefined) {
                this.authtypelist[i].authloginid = userdet[j].authloginid;
                this.authtypelist[i].oldauthloginid = userdet[j].authloginid;
              }
            }
          }
        }
      }
    }
  }

  ngOnInit() {
    this.loginRole = this.ccapi.getRole();
    if (this.loginRole == '1010005') {
      this.buadmin = true;
    }
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'channelId',
      textField: 'channelName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 7,
      allowSearchFilter: true
    };
    this.loadChannels();
  }

  loadChannels() {
    let requesrParams = {
      orderDir: "desc",
      search: "",
      start: 1,
      status: 1,
      length: 100
    }
    let _actchannels = this.ccapi.getSession("activechannels");
    if (_actchannels != null && _actchannels != undefined && _actchannels.length > 5) {
      this.dropdownList = JSON.parse(_actchannels);
      if (this.mode == 'update') {
        let selectedArr = [];
        if (this.userobj.channels[0]) {
          selectedArr = this.userobj.channels[0].split(',');
          for (let i = 0; i < this.dropdownList.length; i++) {
            for (let j = 0; j < selectedArr.length; j++) {
              if (this.dropdownList[i].channelId == selectedArr[j]) {
                this.selectedItems.push(this.dropdownList[i]);
              }
            }
          }
        }
      }
      return;
    }
    this.ccapi.postData('channels/getchannel', requesrParams).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openSnackBar(response.message);
        return;
      }
      else if (response.code == "200") {
        let arr = response.data;
        for (let i = 0; i < arr.length; i++) {
          arr[i].id = i;
        }
        this.selectedItems = [];
        this.dropdownList = arr;
        this.ccapi.setSession("activechannels", JSON.stringify(this.dropdownList));
        if (this.mode == 'update') {
          let selectedArr = [];
          if (this.userobj.channels[0]) {
            selectedArr = this.userobj.channels[0].split(',');
            for (let i = 0; i < this.dropdownList.length; i++) {
              for (let j = 0; j < selectedArr.length; j++) {
                if (this.dropdownList[i].channelId == selectedArr[j]) {
                  this.selectedItems.push(this.dropdownList[i]);
                }
              }
            }
          }
        }
      }
    }, (error => {

      this.ccapi.HandleHTTPError(error);
    }));
  };

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  compareWithFunc(a, b) {
    return a === b;
  }
  check(event: KeyboardEvent) {
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode)) {
      event.preventDefault();
    }
  }

  submitUser(): void {
    if (this.mode == 'update' && this.userobj.status == "0") {
      let postData = {
        "parentId": 0,
        "loginId": this.currentUser.loginId,
        "name": this.currentUser.userName,
        "mobileNo": this.currentUser.mobileNo,
        "emailId": this.currentUser.email,
        "roleId": this.currentUser.roleId,
        "address": this.currentUser.address,
        "channels": this.currentUser.channels,
        "userStatus": this.userobj.status
      };
      this.ccapi.postData("user/update", postData).subscribe((res: any) => {
        if (res.code == "200" && res.status == "success") {
          this.ccapi.openDialog('success', res.message);
          this.dialogRef.close(res);
        }
        else {
          this.ccapi.openDialog('error', res.message);
          this.close();
        }
      }, (error => {

        this.ccapi.HandleHTTPError(error);
      }));
    }
    else {
      if (!this.ccapi.isvalidtext(this.userobj.uusertype, "Please select usertype")) return;

      if (!this.ccapi.isvalidtext(this.userobj.uname, "Please enter name")) return;


      if (this.userobj.uname.length <= 1) {
        this.ccapi.openDialog('error', "User name should be minimum 2 characters");
        return;
      }

      if (!this.ccapi.isvalidtext(this.userobj.uemail, "Please enter Email")) return;

      if (!this.ccapi.validateEmails(this.userobj.uemail)) {
        this.ccapi.openDialog('error', "Please valid Email");
        return;
      }
      if (!this.ccapi.isvalidtext(this.userobj.umobileno, "Please enter valid Mobile Number")) return;

      if (!this.ccapi.isvalidmsisdn(this.userobj.umobileno,this.env.countrycode)) {
        this.ccapi.openDialog('error', "Mobile Number Should Start with:"+this.env.countrycode);
        return;
      }

      if (!this.ccapi.isvalidtext(this.userobj.uloginid, "Please enter Login ID")) return;
      if (this.userobj.uloginid.length <= 1) {
        this.ccapi.openDialog('error', "User loginid should be minimum 2 characters");
        return;
      }

      if (this.selectedItems.length == 0) {
        this.ccapi.openDialog('error', "Please select atleast one channel.");
        return;
      }

      if (this.userobj.usp == undefined || this.userobj.usp == '' || this.userobj.usp == '0') {
        if (this.userobj.uusertype == "1010003")
          this.userobj.usp = '0';
      }


      let _authtypelist = "";
      for (let i = 0; i < this.authtypelist.length; i++) {
        if (this.authtypelist[i].istatus == "1" || this.authtypelist[i].istatus == true) {
          if (this.authtypelist[i].authloginid == null || this.authtypelist[i].authloginid == undefined || this.authtypelist[i].authloginid.length < 2) {
            this.ccapi.openDialog('error', "Please enter loginId for" + this.authtypelist[i].authtype);
            return;
          }
          _authtypelist += this.authtypelist[i].authtype + "~" + this.authtypelist[i].authloginid + "~" + this.authtypelist[i].oldauthloginid + "~" + this.authtypelist[i].istatus + ",";
        }
      }

      let arr: any = [];
      for (let i = 0; i < this.selectedItems.length; i++) {
        if (this.selectedItems[i].hasOwnProperty('channelId')) {
          arr.push(this.selectedItems[i].channelId);
        } else {
          arr.push(this.selectedItems[i]);
        }
      }
      let url = "";
      if (this.mode == 'insert') {
        url = 'user/create'
      }
      else {
        url = "user/update"
      }
      let postData = {
        "parentId": 0,
        "loginId": this.userobj.uloginid,
        "name": this.userobj.uname,
        "mobileNo": this.userobj.umobileno,
        "emailId": this.userobj.uemail,
        "roleId": this.userobj.uusertype,
        "address": this.userobj.uaddress,
        "channels": arr,
        "userStatus": this.userobj.status
      };
      this.ccapi.postData(url, postData).subscribe((res: any) => {
        if (res.code == "200" && res.status == "success") {
          this.ccapi.openDialog('success', res.message);
          this.dialogRef.close(res);
        }
        else {
          this.ccapi.openDialog('error', res.message);
          this.close();
        }
      }, (error => {

        this.ccapi.HandleHTTPError(error);
      }));
    }
  }
  close() {
    this.dialogRef.close();
  }
  LoadServiceGroups() {
    if (this.masters.hasOwnProperty("servicegroup")) {
      this.servicegrouplist = this.masters.servicegroup;
    }
    this.selectedservicegroups = [];
  }

  ChangeAType(itm) {
    if (itm.status == true)
      itm.status = false;
    else
      itm.status = true;
  }
  GetSps() {

  }
  getoperators() {
    this.ccapi.postData("master/operators", {}).subscribe((resp: any) => {
      if (resp.data.code == "200") {
        this.OperatorsList = resp.data.data;
      }
    }, (error => {
      this.ccapi.HandleHTTPError(error);
    }));
  }
  titlecheck(event) {
    let k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57) || k == 95 || k == 46);
  }

}
