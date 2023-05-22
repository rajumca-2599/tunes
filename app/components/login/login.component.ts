import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors, FormBuilder } from '@angular/forms';
// import * as sha512 from "js-sha512";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  phnumber: string = "";
  mobile: string = "";

  password: string = "";

  mobileError: string = "";

  passworderror: string = "";

  showMobileError: boolean = false;

  showPasswordError: boolean = false;

  showMobilePattern: boolean = false;

  disabled: boolean = false;
  transid: any;
  validatetokenData: any;
  validateOTPdata: any;
  constructor(private _service: CommonService, private router: Router) {
    // this.validateOTPdata=[{
    //   status: "0",
    //   code: "10006",
    //   message: "OTP has been sent successfully TO 720****702 number. please enter the same OTP below",
    //   transid: "0001002401669720105933323",
    //   data: {
    //     tokenid: "75879996c4599fb92zb898249b",
    //     status: "true",
    //     newuser: false,
    //     transid: "0001002401669720105933323",
    //     expiry: 10
    //   }
    // }]
  }

  ngOnInit() {

    this.validateToken();

  }
  // getSHA512(s: any): string {
  //   try {
  //     return sha512.sha512(s);
  //   } catch (e) {
  //     return "";
  //   }
  // }
  mobileNum(event: any) {

    if (this.phnumber.length < 8) {

      this.showMobileError = true

      var charCode = (event.which) ? event.which : event.keyCode;

      // Only Numbers 0-9 //

      if ((charCode < 48 || charCode > 57)) {

        event.preventDefault();

        return false;

      } else {

        return true;

      }

    } else {

      this.showMobileError = false;

    }



    return true;

  }


  loginportal() {

    // console.log(this.phnumber)
    let _msisdn = this._service.RC4EncryptDecryptph(this.phnumber)
    sessionStorage.setItem('Msisdn_id', this.phnumber)
    if (this.phnumber == "") {
      this._service.openDialog("warning", 'Please enter Phone Number');
      return;
    }
    // if(true){
    //   // this._service.setSession("otpdata",this.validateOTPdata);
    //   localStorage.setItem('token',JSON.stringify(this.validateOTPdata))
    //   // this._service.validatedata=this.validateOTPdata
    //   this.router.navigate(["/validateOTP"]);
    // }


    let postdata = {
      action: "register",
      msisdn: _msisdn
    }
    this._service.postData("/otp/send", postdata).subscribe((response: any) => {


      if (response.code != null && response.status == "0") {
        this._service.validatedata = response
        window.sessionStorage.setItem("tokenId", JSON.stringify(response));
        this.router.navigate(["validateotp"]);

        try {
          // this._service.getAlertConfigurations("alertconfigurations");
        } catch (e) {
        }

      }
      else {

        this._service.openDialog("warning", response.message);
      }
    }, (error => {

      if (error.status == 0 || error.status == 404) {
        this._service.openDialog("warning", 'Application Currently down. Please try after sometime');
      }
      console.log(error);
    }));


  }
  validateToken() {

    this._service.postData("/token/get", {}).subscribe((response: any) => {

      if (response.code == "500") {
        this._service.openDialog("warning", response.message);
        return;
      }
      else if (response !=null) {

        if (response.status == 0) {
          this.validatetokenData = response.data
          // let _token_id=response.data.tokenid
          // window.sessionStorage.setItem("tokenId", _token_id);
          //  window.sessionStorage.getItem("tockenid",_token_id)
          //  window.localStorage.setItem("tockenid", _token_id);
          this._service.token_id = response.data.tokenid
          //  this._service.setSession("tockenid",response.data.tokenid)
          sessionStorage.setItem('token_id', response.data.tokenid)


        }
        else {

          this._service.openDialog("warning", response.message);
        }
      }
      else {
        this._service.openDialog("warning", response.message);
      }
    }, (err => {
      console.log(err);
      this._service.HandleHTTPError(err);
    }));
  };


}
