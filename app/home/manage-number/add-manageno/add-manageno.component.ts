import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';

@Component({
  selector: 'app-add-manageno',
  templateUrl: './add-manageno.component.html',
  styleUrls: ['./add-manageno.component.css'],
})
export class AddManagenoComponent implements OnInit {
  selectedlanguage = 'ID';
  isFragmentsExist: boolean = false;
  txtMobileNumber: string = '';
  showerror = false;
  msg: string = '';
  helpurl = '';
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.helpurl = this.imiapi.getglobalsettings();
  }
  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  goback() {
    this.router.navigate(['/managenumber']);
  }
  validatefragment(event) {
    //alert('HI');
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
      // this.imiapi.log("showErr:"+this.showerror)
      if (this.showerror && this.txtMobileNumber.length == 0) {
        this.showerror = false;
        this.msg = '';
      }
    }

    return;
  }
  Login() {
    if (this.txtMobileNumber == '') {
      return;
    }
    if (this.txtMobileNumber.length < 9) {
      return;
    }

    if (
      this.txtMobileNumber.length < this.env.mobileNo_MinLength ||
      this.txtMobileNumber.length > this.env.mobileNo_MaxLength
    ) {
      this.showerror = true;
      if (this.selectedlanguage.toUpperCase() == 'EN')
        this.msg = 'your IM3 Number is invalid';
      else this.msg = 'Nomor IM3 kamu salah';
      return;
    }
    var requestObj = {
      msisdn: this.txtMobileNumber,
      action: 'addnumber',
    };
    requestObj.msisdn = this.imiapi.getValidMobileNumber(requestObj.msisdn);
    this.imiapi.log('MSISDN:' + requestObj.msisdn);
    this.isFragmentsExist = false;
    this.env.fragmentlist.forEach((element) => {
      if (
        requestObj.msisdn
          .substring(2, requestObj.msisdn.length)
          .startsWith(element)
      ) {
        this.isFragmentsExist = true;
      }
    });

    if (this.isFragmentsExist) {
      this.showerror = false;
      this.spinner.show();
      this.imiapi.postData('v1/otp/send', requestObj).subscribe(
        (response: any) => {
          this.spinner.hide();
          try {
            if (response.code == '10002' || response.code == '11111') {
              this.imiapi.clearSession();
              // this.router.navigate(['/login']);
              // Added on 27thjune to redirect to HE 
              this.router.navigate(['/pwa']);
            }
            if (response.status == '0' && response.data.status == 'true') {
              this.imiapi.setSession('managenumber', requestObj.msisdn);
              this.imiapi.setSession('transid', response.transid);
              this.router.navigate(['/managevalidateotp']);
              this.isFragmentsExist = false;
            } else {
              this.showerror = true;
              this.msg = response.message;
            }
          } catch (e) {
            this.showerror = true;
            this.msg =
              'Sorry, we could not process your request. Please try later!';
         //   console.log(e);
          }
        },
        (error) => {
          this.spinner.hide();
         // console.log(error);
        }
      );
    } else {
      this.showerror = true;
      if (this.selectedlanguage.toUpperCase() == 'EN')
        this.msg = 'your IM3 Number is invalid';
      else this.msg = 'Nomor IM3 kamu salah';
      return;
    }
  }

  openNewtab() {
    window.open(this.helpurl);
  }
}
