import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from '../../../shared/services/common.service';
import { EnvService } from '../../../shared/services/env.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  pwdPolicy:string;
  userdetails: any;
  constructor(private router: Router , private ccapi: CommonService, private activeRoute : ActivatedRoute,public env:EnvService) {
    this.userdetails = {
      newpaswd : "",
      reseterpswd : ''
    };
    this.pwdPolicy = this.ccapi.PasswordPolicy();
  }
  resetpassword() {
    if(!this.userdetails.newpaswd){
      this.ccapi.openDialog("warning", 'Enter the New Password to Reset');
      return;
    }
    if(!this.userdetails.reenterpswd){
      this.ccapi.openDialog("warning", 'Please Re-Enter Password to Reset');
      return;
    }
    if(this.userdetails.newpaswd != this.userdetails.reenterpswd){
      this.ccapi.openDialog("warning", 'New and Confirm password does not match');
      return;
    }

    if (!this.ccapi.validatepassword(this.userdetails.newpaswd)) {
      this.ccapi.openDialog('error', "Enter Valid Password");
      return;
    }
    let req =  {
      resetKey : this.resetKey,
      encryptKey : btoa(this.userdetails.newpaswd)
    };
    this.ccapi.postData('values/resetpassword', req).subscribe((response: any) => {
        if (response.code == "500" || response.status == "error") {
            this.ccapi.openDialog("warning", response.message);
            return;
        }
        else if (response.code == "200" || response.status == "success" || response.status == "Success") {
            this.ccapi.openDialog("success", response.message);
            this.router.navigate(["/"]);
        }
      //var policy = response.data.data;
    },(error => {
      if (error.status == 0 || error.status == 404) {
        this.ccapi.openDialog('error', 'Application Currently down. Please try after sometime');
      }
    }));
  }
  resetKey : any = 0;
  ngOnInit() {
    this.resetKey = this.activeRoute.snapshot.params['id'];
  }

}
