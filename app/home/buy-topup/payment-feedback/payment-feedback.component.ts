import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { Options } from 'ng5-slider';
import { ApidataService } from 'src/app/shared/apidata.service';
declare var $: any;
@Component({
  selector: 'app-payment-feedback',
  templateUrl: './payment-feedback.component.html',
  styleUrls: ['./payment-feedback.component.css'],
})
export class PaymentFeedbackComponent implements OnInit, OnDestroy {
  txtopnion = '';
  totalstar = 5;
  answer1 = '4';
  answer2 = '4';
  ratingmood =  this.imiapi.getSelectedLanguage() == 'EN' ? 'Good' : 'Baik';
  satisfied=this.imiapi.getSelectedLanguage()=="EN"?"Unsatisfied":"Sangat Tidak Puas";
  unsatisfied=this.imiapi.getSelectedLanguage()=="EN"?"Very Satisfied":"Sangat Puas";
  likely=this.imiapi.getSelectedLanguage()=="EN"?"Very Likely":"Sangat Mau";
  unlikely=this.imiapi.getSelectedLanguage()=="EN"?"Very Unlikely":"Sangat Tidak Mau";
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number = 4;
  sourceScreen="";
  options: Options = {
    floor: 0,
    ceil: 250,
    showTicksValues: true,
    stepsArray: [
      { value: 1, legend:this.satisfied },
      { value: 2, legend: '' },
      { value: 3, legend: '' },
      { value: 4, legend: '' },
      { value: 5, legend: this.unsatisfied },
    ],
  };
  unlikeyoptions: Options = {
    floor: 0,
    ceil: 250,
    showTicksValues: true,
    stepsArray: [
      { value: 1, legend: this.unlikely},
      { value: 2, legend: '' },
      { value: 3, legend: '' },
      { value: 4, legend: '' },
      { value: 5, legend: this.likely },
    ],
  };
  constructor(
    private translate: TranslateService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public imiapi: IMIapiService,
    public env: EnvService,
    private apidata: ApidataService
  ) {}

  ngOnInit(): void {
    let screen=this.imiapi.getSession('feedbackscreen');
    if(screen!=undefined && screen!="NA" && screen!="")
    this.sourceScreen=JSON.parse(screen);
  }
  giveFeedback() {
    this.spinner.show();
    let transid = this.imiapi.getSession('transid');
    if (transid != 'NA' && transid != undefined && transid != '')
      transid = JSON.parse(transid);
    let productid = this.imiapi.getSession('productid');
    if (productid != 'NA' && productid != '' && productid != undefined)
      productid = JSON.parse(productid);
    let paymentchannel = this.imiapi.getSession('paymentchannel');
    if (
      paymentchannel != undefined &&
      paymentchannel != 'NA' &&
      paymentchannel != ''
    )
      paymentchannel = JSON.parse(paymentchannel);
    var obj = {
      payment_transid: transid,
      rating: this.selectedValue,
      answer1: this.answer1,
      answer2: this.answer2,
      feedback: this.txtopnion,
      paymentchannel: paymentchannel,
      paymenttype: paymentchannel,
      productid: productid,
      productname: productid,
    };
    this.imiapi.postData('v1/feedback/payment', obj).subscribe(
      (response: any) => {        
        this.spinner.hide();
         if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
             this.router.navigate(['/pwa']);
        } 
        if (response.status != null && response.status == '0') {
          $('#sucess').modal('show');
        }
        
      },
      (error) => {
        // console.log(error);
      }
    );
  }
  ngOnDestroy() {
    this.imiapi.removeSession('paymentchannel');
    this.imiapi.removeSession('transid');
    this.imiapi.removeSession('productid');
  }
  navigateToHome() {
    this.imiapi.setStorageValue('footerstateName', 'home');
    this.apidata.footerstateName.next('home');
    
    this.router.navigate(['/home']);
  }
  countStar(star) {
    this.selectedValue = star;
    if (
      this.selectedValue == 1 ||
      this.selectedValue == 2 ||
      this.selectedValue == 3
    ) {
      this.ratingmood =
        this.imiapi.getSelectedLanguage() == 'EN' ? 'Not Good' : 'Kurang Baik';
    } else if (this.selectedValue == 4)
      this.ratingmood =
        this.imiapi.getSelectedLanguage() == 'EN' ? 'Good' : 'Baik';
    else if (this.selectedValue == 5)
      this.ratingmood =
        this.imiapi.getSelectedLanguage() == 'EN' ? 'Awesome' : 'Keren';
  }

  addClass(star) {
    console.log('star', star);
    console.log('selectedvalue', this.selectedValue);
    let ab = '';
    for (let i = 0; i < star; i++) {
      console.log('star i', star);
      ab = 'starId' + i;
      document.getElementById(ab).classList.add('selected');
    }
  }
  removeClass(star) {
    console.log('removestar', star);
    let ab = '';
    for (let i = star - 1; i >= this.selectedValue; i--) {
      console.log('star i', star);
      ab = 'starId' + i;
      document.getElementById(ab).classList.remove('selected');
    }
  }
  titleCheck(event) {
    // var k;
    // k = event.charCode; //         k = event.keyCode;  (Both can be used)
    // return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 32; e.keyCode || e.which
    console.log(event.charCode +" - "+ event.which);
    var regex = new RegExp("^[a-z A-Z 0-9]");
    var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
  }
}

