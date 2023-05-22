import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from '../../../shared/services/common.service';
import { MatDialog } from '@angular/material';



@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})



export class MyprofileComponent implements OnInit {
  public userinfo: any;
  public pwdinfo: any;
  public showuserInfo: boolean = true;
  public showpwdInfo: boolean = false;
  public pwdPolicy: string;
  public langlist: any[] = [{ name: 'English', value: 'en' }, { name: 'Indonasian', value: 'id'}];
  public enableedit: boolean = true;
  public getrole: any = "";
  constructor(private router: Router, private activeRoute: ActivatedRoute, private ccapi: CommonService, private dialog: MatDialog) {
    this.userinfo = {
      userid: 0,
      uname: "",
      uemail: "",
      uloginid: "",
      umobileno: "",
      uusertype: "",
      udisplayname: "",
      udepartment: "",
      udesignation: "",
      languageid: "en",
      urole: "",
      authtype: "",
      dtlastlogin:"",
    };
    this.pwdinfo = {
      oldpassword: "",
      newpassword: "",
      rnewpassword: ""
    }
  }

  ngOnInit() {
    this.getrole = this.ccapi.getRole();
    this.GetUserDetails();
    //this.PasswordPolicy();
    this.pwdPolicy = this.ccapi.PasswordPolicy();
  }
  displayTab(tab) {
    if (tab == 'info') {
      this.showuserInfo = true;
      this.showpwdInfo = false;
    }
    else if (tab == 'pwd') {
      this.showuserInfo = false;
      this.showpwdInfo = true;
    }
  }
  GetUserDetails() {
    let req = {
      loginid : this.ccapi.getloginid()
    }
    this.ccapi.postData("user/userinfo",req).subscribe((response: any) => {
      if (response.code == "200") {
        var userdet = response.data;
        //this.loadLanguages();
        if (userdet != undefined) {
          this.userinfo.userid = userdet.userid;
          this.userinfo.uname = userdet.name;
          this.userinfo.uemail = userdet.email;
          this.userinfo.uloginid = userdet.loginid;
          this.userinfo.umobileno = userdet.mobileno;
          this.userinfo.uusertype = userdet.roleid;
          this.userinfo.dtlastlogin = userdet.dtlastlogin;
          this.userinfo.udisplayname = userdet.username;
          this.userinfo.languageid = userdet.lang;
          this.userinfo.urole = userdet.rolename;
          this.userinfo.authtype = userdet.authtype;
        }
        this.userinfo.languageid = 'en';
      }
      else {
        if (response.code != "401") {
          this.ccapi.openDialog('error', "Dear User, Currently we cannot process your request");
          return;
        }
      }
    });
  }
  PasswordPolicy() {
    this.ccapi.postData('login/GetPasswordPolicy', {}).subscribe((response: any) => {
      this.pwdPolicy = "";
      var policy = response.data;
      if (policy.MaxCharsInName != undefined && policy.MaxCharsInName > 0) {
        this.pwdPolicy += "<p>Characters in LoginID should not be present in Password.</p>";
      }
      this.pwdPolicy += "<p>Password should contain atleast " + policy.MinLength + " characters.</p>";
      this.pwdPolicy += "<p>It has not been used in the past " + policy.RestrictNoOfPrevMatches + " Passwords.</p>";
      this.pwdPolicy += "<dl><dt> It Contains the following character groups - </dt>";
      if (policy.IsUpperCaseRequired == "True") {
        this.pwdPolicy += "<dd>English Uppercase Characters [A-Z], </dd>";
      }
      if (policy.IsLowerCaseRequired == "True") {
        this.pwdPolicy += "<dd>English Lower case Characters [a-z],</dd>";
      }
      if (policy.IsNumericsRequired == "True") {
        this.pwdPolicy += "<dd>Numerals[0-9],</dd>";
      }
      if (policy.IsSpecialCharsRequired == "True") {
        var strSplChars = policy.SpecialCharactersAllowed;
        this.pwdPolicy += "<dd> Non - alphabetic characters [" + strSplChars + "],</dd>";
      }
      this.pwdPolicy += "</dl>";
    });
  }
  loadLanguages() {
    this.ccapi.postData("master/languages", {}).subscribe((response: any) => {
      if (response.code == 200) {
        this.langlist = response.data;
      }
    });
  }
  UpdateUser() {
    if (this.userinfo.uname == undefined || this.userinfo.uname == "") {
      this.ccapi.openDialog('error', "Please enter name");
      return;
    }
    if (this.userinfo.uemail == undefined || this.userinfo.uemail == "") {
      this.ccapi.openDialog('error', "Please enter valid user emailid");
      return;
    }
    if (this.userinfo.umobileno == undefined || this.userinfo.umobileno == "") {
      this.ccapi.openDialog('error', "Please enter mobileno");
      return;
    }
    if (this.userinfo.umobileno.length < 10) {
      this.ccapi.openDialog('error', "Please enter valid mobileno");
      return;

    }
    if (this.userinfo.uloginid == undefined || this.userinfo.uloginid == "") {
      this.ccapi.openDialog('error', "Please enter loginid.");
      return;
    }
    if (this.userinfo.uusertype == undefined || this.userinfo.uusertype == "") {
      this.ccapi.openDialog('error', "Please select usertype");
      return;

    }
    var url = "user/updateuser";
    var postData = {
      userId: parseInt(this.userinfo.userid), userStatus: 1, name: this.userinfo.uname, email: this.userinfo.uemail, loginid: this.userinfo.uloginid,
      mobileno: this.userinfo.umobileno, roleid: parseInt(this.userinfo.uusertype), parentId : 0,
      displayname: this.userinfo.udisplayname, department: this.userinfo.udepartment, designation: this.userinfo.udesignation, sendemail: this.userinfo.sendemail,
      lang: this.userinfo.languageid
    };
    this.ccapi.postData("user/updateuser", postData).subscribe((resp: any) => {
      if (resp.code == "200" && resp.status == 'success') {
        this.ccapi.openDialog('success', resp.message);
      }
      else {
        this.ccapi.openDialog('error', resp.message);
      }
    });
  }
  UpdatePwd() {
    if (this.pwdinfo.oldpassword == "" || this.pwdinfo.oldpassword == undefined) {
      this.ccapi.openDialog('error', "Please enter Old Password");
      return;
    }
    if (this.pwdinfo.newpassword == "" || this.pwdinfo.newpassword == undefined) {
      this.ccapi.openDialog('error', "Please enter new Password");
      return;
    }
    if (this.pwdinfo.rnewpassword == "" || this.pwdinfo.rnewpassword == undefined) {
      this.ccapi.openDialog('error', "Please re-enter new Password");
      return;
    }
    if (this.pwdinfo.oldpassword == this.pwdinfo.newpassword) {
      this.ccapi.openDialog('error', "Old and new password should not be same");
      return;
    }
    var data = {
      userid: this.userinfo.userid,
      oldPassword: btoa(this.pwdinfo.oldpassword),
      newPassword: btoa(this.pwdinfo.newpassword),
      emailId: this.userinfo.uemail
    };
    this.ccapi.postData("user/changepassword", data).subscribe((resp: any) => {
      if (resp.code == "200" && resp.status.toLowerCase() == "success") {
        this.ccapi.openDialog('success', resp.message);
        this.pwdinfo.oldpassword="";
        this.pwdinfo.newpassword="";
        this.pwdinfo.rnewpassword="";
      }
      else {
        this.ccapi.openDialog('error', resp.message);
        return;
      }
    })
  }

 
}
