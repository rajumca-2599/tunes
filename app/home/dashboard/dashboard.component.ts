import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  TemplateRef,
} from '@angular/core';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { CtaModalComponent } from '../../shared/cta-modal/cta-modal.component';
import { PayModalComponent } from '../../shared/pay-modal/pay-modal.component';

import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ApidataService } from '../../shared/apidata.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  public hasContent: number = 0;
  public dashboardResp: any = {};
  userProfile: any = {};
  ispostpaid: boolean = false;
  selectedlanguage = 'ID';
  index = 0;
  config: SwiperConfigInterface = {
    slidesPerView: 2.25,
    spaceBetween: 0,

    breakpoints: {
      991.98: {
        slidesPerView: 3.25,
        spaceBetween: 0,
      },
      767.98: {
        slidesPerView: 3.25,
        spaceBetween: 0,
      },
      575.98: {
        slidesPerView: 2.25,
        spaceBetween: 0,
      },
    },
  };
  modalRef: BsModalRef;
  constructor(
    public env: EnvService,
    public imiapi: IMIapiService,
    private cd: ChangeDetectorRef,
    private modalService: BsModalService,
    private translate: TranslateService,
    private router: Router,
    private apiData: ApidataService
  ) {}

  ngOnInit(): void {
    if (this.imiapi.getSubstype().toUpperCase() == 'POSTPAID')
      this.ispostpaid = true;

    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.getDashboard();
    this.imiapi.log('DB -Completed.');
  }

  getDashboard() {
    this.userProfile = this.imiapi.getUserProfile();
    this.hasContent = 2;
    //console.log("DashBoard"+ this.imiapi.getStorage("dashboard"));
    // console.log("msisdn:"+this.imiapi.getMSISDN());
    /*  this.dashboardResp = this.imiapi.getStorage("dashboard");
     if (!(this.dashboardResp == undefined || this.dashboardResp == "" || this.dashboardResp == "NA")) {
       console.log("DashBoard From Cache");
       this.dashboardResp = JSON.parse(this.imiapi.getStorage("dashboard"));
       this.dashboardResp.packdata.msisdn = this.imiapi.formatMobileNo(this.dashboardResp.packdata.msisdn)
       this.hasContent = 1;
     }
     else { */
    // console.log("Calling:DashBoard");
    //this.apiData.getDashboardData().subscribe((response: any) => {
    this.imiapi.removeStorage('dashboard');
    this.imiapi.postData('v1/dashboard/get/v2', {}).subscribe(
      (response: any) => {
        // this.apiData.getDashboardResp(false).subscribe((response: any) => {
        //this.imiapi.log("Component_DB:"+response);
        if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
        }
        if (response.status != null && response.data != undefined) {
          if (response.status == '0') {
            this.dashboardResp = response.data;
            try{
            this.imiapi.setStorage('dashboard', response.data);}
            catch(error) {
              console.log(error);
            }
            //this.dashboardResp.packdata.msisdn = this.imiapi.formatMobileNo(this.dashboardResp.packdata.msisdn)
            this.hasContent = 1;
          } else if (response.code == '10002' || response.code == '11111') {
            this.imiapi.log('Clear Session');
            this.imiapi.clearSession();
            // this.router.navigate(['/login']);
            // Added on 27thjune to redirect to HE 
            this.router.navigate(['/pwa']);
          } else this.hasContent = 2;

          //this.username =this.imiapi.getUserName();
          //console.log(this.username)
          // this.imiapi.setStorage("dashboard", response.data);
        } else if(response.code == '10002' || response.code == '11111'){
          this.imiapi.log('Clear Session');
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
        }
        else this.hasContent = 2;
      },
      (error) => {
        this.hasContent = 2;

        console.log(error);
      }
    );
    // }
  }
  getStyle(r, t) {
    try {
      if (r.toString().indexOf('k') != -1) {
        r = r.toString().replace('k', '');
        t = t.toString().replace('k', '');
      }
      //this.imiapi.log(r+' - '+t)
      return 'width:' + Math.round((r * 100) / t) + '%';
    } catch (e) {}

    // return "width:25%";
  }
  getPercentVal(r, t) {
    try {
      if (r.toString().indexOf('k') != -1) {
        r = r.toString().replace('k', '');
        t = t.toString().replace('k', '');
      }
      // this.imiapi.log(r+' - '+t)
      //console.log('Style_DBgetPercentVal'+ r+'|'+t +'|'+ Math.round((r*100)/t))
      return Math.round((r * 100) / t);
    } catch (e) {}
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  navigateToAccount() {
    this.imiapi.setStorageValue('page', 'myaccount');
    this.imiapi.setStorageValue('footerstateName', 'myaccount');
    this.apiData.footerstateName.next('myaccount');
    this.router.navigate(['/myaccount']);
  }

  openCTAModal() {
    this.modalRef = this.modalService.show(CtaModalComponent, {
      class: 'modal-dialog-centered',
    });
  }

  openPayModal() {
    //ModalOptions
    this.modalRef = this.modalService.show(PayModalComponent, {
      class: 'modal-dialog-centered',
    });
  }
  navigatetoTopUP() {
    this.router.navigate(['/topup']);
  }
  naviagtetopaybill() {
    this.router.navigate(['/paybill']);
  }
}
