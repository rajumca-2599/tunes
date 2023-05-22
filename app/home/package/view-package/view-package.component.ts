import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import {
  DomSanitizer,
} from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-view-package',
  templateUrl: './view-package.component.html',
  styleUrls: ['./view-package.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewPackageComponent implements OnInit {
  @ViewChild('pdf', { static: true }) pdf: ElementRef;
  constructor(
    private translate: TranslateService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public imiapi: IMIapiService,
    public env: EnvService,
    private apidata: ApidataService,
    public sanitizer: DomSanitizer
  ) {}
  selectedlanguage = 'ID';
  data: any;
  txtgiftMobileNumber = '';
  msg: string = '';
  isFragmentsExist: boolean = false;
  showerror = false;
  navigationFrom = '';
  html = '';
  show: boolean = false;
  helpurl: string = '';
  ngOnInit() {
    this.helpurl = this.imiapi.getglobalsettings();
    this.navigateToTop();
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.navigationFrom = JSON.parse(this.imiapi.getSession('navigationfrom'));
    this.setFooter();
    this.getpackage();
  }
  gotoprevious() {
    if (this.navigationFrom == 'transhistory') {
      this.apidata.footerstateName.next('myaccount');
      this.imiapi.setStorageValue('footerstateName', 'myaccount');
    } else {
      this.apidata.footerstateName.next(this.navigationFrom);
      this.imiapi.setStorageValue('footerstateName', this.navigationFrom);
    }
    this.router.navigate(['/' + this.navigationFrom]);
  }
  navigateToTop() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  getpackage() {
    console.log(this.imiapi.getSession('pvrcode'));
    if (this.navigationFrom != 'onlyforyou') {
      this.spinner.show();
      var obj = {
        servicename: 'GET PACKAGE',
        PVR_CODE: JSON.parse(this.imiapi.getSession('pvrcode')),
      };
      this.imiapi.postData('v1/packages/getpackage', obj).subscribe(
        (response: any) => {
          this.spinner.hide();
          if (response.status != null && response.data != undefined) {
            if (response.status == '0') {
              this.data = response.data.commercial_package;
              this.html = this.data.package_detail_content;
            }
            else{
              $('#myModal3').modal('show');
              return;
            }
          }
         
        },
        (error) => {
          //console.log(error);
        }
      );
    } else {
      let packagedata = this.imiapi.getSession('commerical_package');
      if (packagedata != undefined && packagedata != 'NA')
        this.data = JSON.parse(packagedata);
      this.html = this.data.package_detail_content;
    }
  }
  getTrustedUrl() {
    return this.sanitizer.bypassSecurityTrustUrl(
      this.data.package_detail_content
    );
  }
  setFooter() {
    this.apidata.footerstateName.next('package');
    this.imiapi.setStorageValue('footerstateName', 'package');
  }
  gotoPayment() {
    if (this.navigationFrom != 'onlyforyou') {
      var obj = {
        product_id: this.data.pvr_code,
        normal_price: this.data.original_tariff,
        discount_price: this.data.original_tariff - this.data.tariff,
      };
      this.imiapi.setSession(
        'paymentmethod',
        this.data.commercial_attribute.payment_methods
      );
      this.imiapi.setSession('selectedamount', this.data.tariff);
      this.imiapi.setSession(
        'topupnumber',
        this.txtgiftMobileNumber.length > 0
          ? this.txtgiftMobileNumber
          : this.imiapi.getMSISDN()
      );
      this.imiapi.setSession('topupvouchercode', this.data.package_name);
      this.imiapi.setSession('sourcescreen', 'viewpackage');
      this.imiapi.setSession('denomresponse', obj);
      this.imiapi.setSession('shortcode', this.data.shortcode);
      this.imiapi.setSession('keyword', this.data.keyword);
      this.imiapi.setSession(
        'gift',
        this.txtgiftMobileNumber.length > 0 ? 'Y' : 'N'
      );
      this.imiapi.setSession(
        'vascontent',
        this.data.offertype == 'content' ? 'Y' : 'N'
      );
    } else {
      var obj = {
        product_id: this.data.pvr_code,
        normal_price: this.data.original_tariff,
        discount_price: this.data.original_tariff - this.data.tariff,
      };
      this.imiapi.setSession('paymentmethod', this.data.paymentchannels);
      this.imiapi.setSession('selectedamount', this.data.tariff);
      this.imiapi.setSession(
        'topupnumber',
        this.txtgiftMobileNumber.length > 0
          ? this.txtgiftMobileNumber
          : this.imiapi.getMSISDN()
      );
      this.imiapi.setSession('topupvouchercode', this.data.package_name);
      this.imiapi.setSession('sourcescreen', 'viewpackage');
      this.imiapi.setSession('denomresponse', obj);
      this.imiapi.setSession('shortcode', this.data.shortcode);
      this.imiapi.setSession('keyword', this.data.keyword);
      this.imiapi.setSession('offertype', this.data.offertype);
    }
    this.router.navigate(['/topuppayment']);
  }
  validatefragment() {
    this.isFragmentsExist = false;
    if (this.txtgiftMobileNumber.length >= 3) {
      this.env.fragmentlist.forEach((element) => {
        if (this.txtgiftMobileNumber.startsWith(element)) {
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
      if (this.showerror && this.txtgiftMobileNumber.length == 0) {
        this.showerror = false;
        this.msg = '';
      }
    }

    return;
  }
  // enableGiftDiv() {
  //   $('#giftModal').modal('show');
  // }
  enableGift() {
    this.show = !this.show;
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  gotopackage(model: any) {
    $('#' + model).modal('hide');
    this.apidata.footerstateName.next('package');
    this.imiapi.setStorageValue('footerstateName', 'package');
    this.router.navigate(['/package']);
  }
}
