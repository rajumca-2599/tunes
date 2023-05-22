import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApidataService } from 'src/app/shared/apidata.service';
import { AmountConverterPipe } from 'src/app/shared/directives/amount-converter.pipe';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SharedService } from 'src/app/shared/SharedService';
import * as moment from 'moment';
@Component({
  selector: 'app-paybill',
  templateUrl: './paybill.component.html',
  styleUrls: ['./paybill.component.css'],
  providers: [AmountConverterPipe],
})
export class PaybillComponent implements OnInit {
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private convertor: AmountConverterPipe,
    private shareddata: SharedService
  ) {}
  selectedlanguage = 'ID';
  isFragmentsExist: boolean = true;
  txtMobileNumber: string = '';
  showuserImage: boolean = false;
  showerror = false;
  msg: string = '';
  public topupResp: any = {};
  public selectedamount = '';
  helpurl: string = '';
  userimage = '';
  userProfile: any = {};
  duedate: string = '';
  ngOnInit(): void {
    if (this.imiapi.getSubstype().toUpperCase() != 'POSTPAID') {
      
      this.router.navigate(['/home']);
      return;
    }
    this.helpurl = this.imiapi.getglobalsettings();
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.txtMobileNumber = this.imiapi.getValidMobileNumber(
      this.imiapi.getMSISDN()
    );
    this.showImage();
    this.getInquiryBill();
  }
  validatefragment() {
    this.isFragmentsExist = false;
    if (this.txtMobileNumber.length >= 3) {
      this.env.fragmentlist.forEach((element) => {
        if (this.txtMobileNumber.startsWith(element)) {
          this.isFragmentsExist = true;
        }
      });
      if (!this.isFragmentsExist) {
        this.showerror = true;

        if (this.selectedlanguage.toUpperCase() == 'EN')
          this.msg = 'your IM3 Number is invalid';
        else this.msg = 'Nomor IM3 kamu salah';

        return;
      } else {
        this.imiapi.log('FragshowErr:' + this.showerror);
        if (this.showerror) {
          this.showerror = false;
          this.msg = '';
        }
      }
    } else {
      if (this.showerror && this.txtMobileNumber.length == 0) {
        this.showerror = false;
        this.msg = '';
      }
    }

    return;
  }
  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  showImage() {
    this.showuserImage = true;
    this.userimage = this.env.cdnurl + 'assets/images/img-prifile.jpg';
    this.userProfile = this.imiapi.getUserProfile();
    if (
      !(
        this.userProfile == null ||
        this.userProfile == 'undefined' ||
        this.userProfile == 'NA'
      )
    )
      this.userimage = this.userProfile.imagelocation;
  }
  gotopayments() {
    if (!this.isEmptyObject(this.topupResp)) {
      this.imiapi.setSession('paymentmethod', this.topupResp.paymentchannels);
      this.imiapi.setSession('selectedamount', this.topupResp.amount);
      this.imiapi.setSession(
        'topupnumber',
        this.imiapi.getValidMobileNumber(this.txtMobileNumber)
      );
      this.imiapi.setSession('topupvouchercode', '');
      this.imiapi.setSession('sourcescreen', 'paybill');
      this.topupResp.duedate = this.duedate;
      this.imiapi.setSession('denomresponse', this.topupResp);
      this.imiapi.removeSession('gift');
      this.router.navigate(['/topuppayment']);
    }
  }
  isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0;
  }

  getInquiryBill() {
    this.spinner.show();
    this.imiapi.postData('v1/payment/inquirybill', {}).subscribe(
      (response: any) => {
        if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
             this.router.navigate(['/pwa']);
        }
        if (response.status != null && response.data != undefined) {
          if (response.status == '0') {
            this.topupResp = response.data.inquiryBillResp;
            let convertedamount = this.convertor.transformAmount(
              this.topupResp.amount
            );
            if (typeof convertedamount === 'string') {
              if (convertedamount.includes(',')) {
                this.topupResp.topupamount = convertedamount.split(',')[0];
                this.topupResp.topupdecimal =
                  '.' + convertedamount.split(',')[1];
              } else {
                this.topupResp.topupamount = convertedamount.split('.')[0];
                this.topupResp.topupdecimal =
                  '.' + convertedamount.split('.')[1];
              }
            } else {
              this.topupResp.topupamount = convertedamount;
            }
            this.getDuedate();
            this.selectedamount = this.topupResp.amount;
          } else {
            this.spinner.hide();
          }
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }
  // selectTopUpAmount() {
  //   this.selectedamount = this.topupResp.amount;
  // }
  gotoHome() {
    this.imiapi.setStorageValue('footerstateName', 'home');
   
    this.router.navigate(['/home']);
  }
  ngOnDestroy() {
    this.imiapi.removeSession('buyagainamount');
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  getDuedate() {
    this.imiapi
      .postData('v1/invoice/getlist', {})
      .subscribe((response: any) => {
        this.spinner.hide();
        if (
          response.status &&
          response.status === '0' &&
          response.data &&
          response.data.invoiceslist &&
          response.data.invoiceslist.length > 0
        ) {
          let invoicelist = response.data.invoiceslist;
          invoicelist.forEach((element) => {
            if (element.invoicenumber == this.topupResp.billReference) {
              let date = element.invoicedate;
              var dateParts = date.split('/');
              let formatdate =
                dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
              this.duedate = moment(formatdate).format('MMM DD, yyyy');
            }
          });
        }
        else if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
            this.router.navigate(['/pwa']);
        } 
      });
  }
}
