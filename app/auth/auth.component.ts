import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CommonService } from '../shared/services/common.service';
import { MsgdialogueboxComponent } from "../shared/msgdialoguebox/msgdialoguebox.component";
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvService } from '../shared/services/env.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {


  public userobj: UserObject = new UserObject();
  NgxSpinnerService: any;
  constructor(private _service: CommonService, private router: Router, private dialog: MatDialog, 
    private spinner: NgxSpinnerService,public env:EnvService) {

  }
  ngOnInit() {
    window.sessionStorage.clear();
    this.userobj.loginId = "";
    this.userobj.encryptKey = "";
    this.userobj.password = "";
  }

  public Login() {
    if (this.userobj.loginId == "") {
      this._service.openDialog("warning", 'Please enter loginid');
      return;
    }
    if (this.userobj.password == "") {
      this._service.openDialog("warning", 'Please enter password');
      return;
    }
    this.userobj.encryptKey = btoa(this.userobj.password);
    //this.userobj.encryptkey = "QTFkbWluQDIzIzE=";
    this.userobj.password = "";
    this.spinner.show();
    this._service.postData("values/login", this.userobj).subscribe((response: any) => {
      // console.log("Resp" + response);

      if (response.code != null && response.code == "200") {
        this.spinner.show();
        this._service.setSession("lang", "en");
        this._service.setSession("oauth", JSON.stringify(response.data));
        // get alert configurations
        try {
          this._service.getAlertConfigurations("alertconfigurations");
        } catch (e) {
        }

        this.router.navigate(["/home"]);
      }
      else {
        this.spinner.hide();
        this.openDialog('error', response.message);
      }
    }, (error => {
      this.spinner.hide();
      if (error.status == 0 || error.status == 404) {
        this.openDialog('error', 'Application Currently down. Please try after sometime');
      }
      console.log(error);
    }));

  }
  titlecheck(event) {
    let k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57) || k == 95 || k == 46);
  }
  pwdcheck(event) {
    let k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    // console.log(k)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57) || (k == 64 || k == 35 || k == 36 || k == 37));
  }
  //----> Below Dialog Was Moved to Service
  openDialog(alert: string, txt: string) {
    this.dialog.open(MsgdialogueboxComponent, {
      disableClose: true,
      width: '400px',
      data: { type: alert, msg: txt }
    });
  }
}

export class UserObject {
  public loginId: string;
  public encryptKey: string;
  public password: string;
}

