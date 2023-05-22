import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { json } from '@rxweb/reactive-form-validators';
import { NgOtpInputComponent } from 'ng-otp-input';
import { CommonService } from '../../shared/services/common.service';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  data: any;
  otp: any;
  showOtpComponent: boolean = true;
  message: string = "";
  transid: any;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '40px',
      'height': '40px'
    }
  };
  onOtpChange(otp: any) {
    this.otp = otp;
    // console.log(this.otp)
  }
  toggleDisable() {
    if (this.ngOtpInput.otpForm) {
      if (this.ngOtpInput.otpForm.disabled) {
        this.ngOtpInput.otpForm.enable();
      } else {
        this.ngOtpInput.otpForm.disable();
      }
    }
  }
  onConfigChange() {
    this.showOtpComponent = false;
    this.otp = null;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }
  setVal(val: any) {
    this.ngOtpInput.setValue(val);
  }
  constructor(private cservice: CommonService, private router: Router, private actroute: ActivatedRoute) {

  }

  ngOnInit() {
    // let data:any =localStorage.getItem('token')
    // let data2=JSON.parse(data)
    // console.log(data2,"data",typeof(data2))
    //  this.message=data2[0].message;
    //  this.transid=data2[0].transid;

    let data = window.sessionStorage.getItem("tokenId")
    this.message = this.cservice.validatedata.message;
    this.transid = this.cservice.validatedata.transid;

    // console.log(this.cservice.validatedata.data,typeof(this.cservice.validatedata),"validatedata")
  }
  validateotp() {

    this.cservice.postData("/otp/validate", { transid: this.transid, otp: this.otp }).subscribe((response: any) => {
// debugger;
      if (response.code == "500") {
        this.cservice.openDialog("warning", response.message);
        return;
      }
      else if (response.message == "Success") {
        if (response.status == "0") {
          this.cservice.token_id = response.data.tokenid
          sessionStorage.setItem('token_id', response.data.tokenid)
          sessionStorage.setItem('Zone_id', response.data.zoneid)
          sessionStorage.setItem('Msisdn_date', response.data.date)

          if(response.data.zoneid=="2" || response.data.zoneid=="4"){
            this.router.navigate(["dashboard"]);
          }
          else{
            this.cservice.openDialog("warning", "Your Not authorized for this page");
            this.router.navigate(["login"]);
          }
         
        
        }
        else {
          
          this.cservice.openDialog("warning", response.message);
          // this.ccapi.openSnackBar("No Records found");
        }
      }
      else{
        // sessionStorage.setItem('token_id', "9BX0LQITUDF9YTUIUTGULM4OG5NPIFIZ8036")
          this.router.navigate(["dashboard"]);
        // this.cservice.openDialog("warning", response.message);
      }
    }, (err => {
      console.log(err);
      this.cservice.HandleHTTPError(err);
    }));
  };
  

}
