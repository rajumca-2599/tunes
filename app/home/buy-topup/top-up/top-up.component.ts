import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ApidataService } from 'src/app/shared/apidata.service';
import { AmountConverterPipe } from 'src/app/shared/directives/amount-converter.pipe';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SharedService } from 'src/app/shared/SharedService';

@Component({
  selector: 'app-top-up',
  templateUrl: './top-up.component.html',
  styleUrls: ['./top-up.component.css'],
  providers: [AmountConverterPipe],
})
export class TopUpComponent implements OnInit, OnDestroy {
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private convertor: AmountConverterPipe,
    private apidata: ApidataService,
    private shareddata: SharedService
  ) {}
  selectedlanguage = 'ID';
  isFragmentsExist: boolean = true;
  txtMobileNumber: string = '';
  txtvochercode: string = '';
  showerror = false;
  msg: string = '';
  show: boolean = false;
  public topupResp: any = {};
  public selectedamount = '';
  helpurl: string = '';
  ngOnInit(): void {
    this.helpurl = this.imiapi.getglobalsettings();
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.txtMobileNumber = this.imiapi.getValidMobileNumber(
      this.imiapi.getMSISDN(),
      true
    );
    this.getamount();
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
  gotopayments() {
    this.topupResp.forEach((element) => {
      if (element.normal_price == this.selectedamount) {
        this.imiapi.setSession(
          'paymentmethod',
          element.commercial_attribute.payment_method
        );
        this.imiapi.setSession('selectedamount', element.normal_price);
        this.imiapi.setSession(
          'topupnumber',
          this.imiapi.getValidMobileNumber(this.txtMobileNumber)
        );
        this.imiapi.setSession('topupvouchercode', this.txtvochercode);
        this.imiapi.setSession('sourcescreen', 'topup');
        this.imiapi.setSession('denomresponse', element);
      }
    });
    this.imiapi.removeSession('gift');
    this.router.navigate(['/topuppayment']);
  }
  getamount() {
    this.spinner.show();
    this.imiapi.postData('v1/payment/getdenoms', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
        }
        if (response.status != null && response.data != undefined) {
          if (response.status == '0') {
            this.topupResp = response.data.denomResponse;
            this.topupResp.forEach((element) => {
              element.convertedamount = this.convertor.transformAmount(
                element.normal_price
              );
              if (element.convertedamount.includes(',')) {
                element.topupamount = element.convertedamount.split(',')[0];
                element.topupdecimal =
                  '.' + element.convertedamount.split(',')[1];
              } else {
                element.topupamount = element.convertedamount.split('.')[0];
                element.topupdecimal =
                  '.' + element.convertedamount.split('.')[1];
              }
            });
          }
          if (response.code == '10002' || response.code == '11111') {
            this.imiapi.clearSession();
            // this.router.navigate(['/login']);
            // Added on 27thjune to redirect to HE 
            this.router.navigate(['/pwa']);
          }
        }
        
        let selectedamount = this.imiapi.getSession('buyagainamount');
        if (
          selectedamount != '' &&
          selectedamount != undefined &&
          selectedamount != 'NA'
        ) {
          selectedamount = JSON.parse(selectedamount);
          this.topupResp.forEach((element) => {
            if (element.normal_price == selectedamount) {
              this.selectTopUpAmount(element);
            }
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  selectTopUpAmount(item: any) {
    if (this.selectedamount == item.normal_price) this.selectedamount = '';
    else this.selectedamount = item.normal_price;
  }
  voucherreload() {
    var obj = {
      vouchercode: this.txtvochercode,
      target_msisdn: this.imiapi.getValidMobileNumber(this.txtMobileNumber),
      name: '',
    };
    this.spinner.show();
    this.imiapi.postData('v1/prepaid/voucherreload', obj).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
        }
        if (response.status != null && response.data != undefined) {
          var obj = {
            status: response.status,
            data: response.data,
            msisdn:this.txtMobileNumber,
            transid:response.transid,
            vouchercode:this.txtvochercode
          };
          this.shareddata.setOption('voucherresponse', obj);
          this.router.navigate(['/voucher']);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  disable() {
    this.txtvochercode = '';
    this.show = !this.show;
  }
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
}
