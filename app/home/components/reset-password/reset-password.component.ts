import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from '../../../shared/services/common.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MsgdialogueboxComponent } from '../../../shared/msgdialoguebox/msgdialoguebox.component';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})




export class ResetPasswordComponent implements OnInit {
  public resetForm: any;
  public pwdPolicy: string;
  public userid: number = 0;
  public loginid: string = "";
  constructor(private router: Router, private activeRoute: ActivatedRoute, private ccapi: CommonService, private dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    dialogRef.disableClose = true;
    this.resetForm = {
      password: "",
      confirmpassword: ""
    }
    this.loginid = data.loginid;
    this.userid = data.userid;
  }
  close() {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.PasswordPolicy();
  }
  resetpassword() {

    if (this.resetForm.password == "" || this.resetForm.password == undefined) {
      this.ccapi.openDialog('error', "Please enter new Password");
      return;
    }
    if (this.resetForm.confirmpassword == "" || this.resetForm.confirmpassword == undefined) {
      this.ccapi.openDialog('error', "Please re-enter new Password");
      return;
    }
    if (this.resetForm.password != this.resetForm.confirmpassword) {
      this.ccapi.openDialog('error', "New and Confirm password does not match");
      return;
    }
    if (!this.ccapi.validatepassword(this.resetForm.password)) {
      this.ccapi.openDialog('error', "Enter Valid Password. Password policy validation failed.");
      return;
    }
    var postdata = {
      userid: this.userid,
      newpassword: btoa(this.resetForm.password),
      resetKey: btoa(this.resetForm.password),
      encryptKey: btoa(this.resetForm.password),
      loginId: this.loginid
    };
    console.log(postdata);
    this.ccapi.postData("user/resetpassword", postdata).subscribe((resp: any) => {
      if (resp.code == "200" && resp.status == "success") {
        this.ccapi.openDialog('success', resp.message);
        this.resetForm.confirmpassword = '';
        this.resetForm.password = '';
        this.dialogRef.close();
      }
      else {
        this.ccapi.openDialog('error', resp.message);
        return;
      }
    })
  }
  PasswordPolicy() {
    // this.ccapi.postData('login/GetPasswordPolicy', {}).subscribe((response: any) => {
    //   this.pwdPolicy = "";
    //   var policy = response.data;
    //   if (policy.MaxCharsInName != undefined && policy.MaxCharsInName > 0) {
    //     this.pwdPolicy += "<p>Characters in LoginID should not be present in Password.</p>";
    //   }
    //   this.pwdPolicy += "<p>Password should contain atleast " + policy.MinLength + " characters.</p>";
    //   this.pwdPolicy += "<p>It has not been used in the past " + policy.RestrictNoOfPrevMatches + " Passwords.</p>";
    //   this.pwdPolicy += "<dl><dt> It Contains the following character groups - </dt>";
    //   if (policy.IsUpperCaseRequired == "True") {
    //     this.pwdPolicy += "<dd>English Uppercase Characters [A-Z], </dd>";
    //   }
    //   if (policy.IsLowerCaseRequired == "True") {
    //     this.pwdPolicy += "<dd>English Lower case Characters [a-z],</dd>";
    //   }
    //   if (policy.IsNumericsRequired == "True") {
    //     this.pwdPolicy += "<dd>Numerals[0-9],</dd>";
    //   }
    //   if (policy.IsSpecialCharsRequired == "True") {
    //     var strSplChars = policy.SpecialCharactersAllowed;
    //     this.pwdPolicy += "<dd> Non - alphabetic characters [" + strSplChars + "],</dd>";
    //   }
    //   this.pwdPolicy += "</dl>";
    // });
  }


}
