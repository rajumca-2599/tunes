import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ApidataService } from 'src/app/shared/apidata.service';
import { CtaModalComponent } from 'src/app/shared/cta-modal/cta-modal.component';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { WelcomeModalComponent } from 'src/app/shared/welcome-modal/welcome-modal.component';
declare var $: any;
@Component({
  selector: 'app-more-landing',
  templateUrl: './more-landing.component.html',
  styleUrls: ['./more-landing.component.css'],
})
export class MoreLandingComponent implements OnInit {
  config: SwiperConfigInterface = {};
  constructor(
    public env: EnvService,
    public imiapi: IMIapiService,
    private translate: TranslateService,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private apidata: ApidataService,
    private cd: ChangeDetectorRef
  ) {
    this.setFooter();
    this.intializeSwipper();
  }
  msisdn: string = '';
  accountype: string = '';
  modalRef: BsModalRef;
  userimage = '';
  userProfile: any = {};
  webbookingurl = '';
  userName = '';
  simResp: any = '';
  simMsg: string = '';
  roamingInfo: any = '';
  alertsResp: any = [];
  index = 0;
  simstatus = '';
  // config: SwiperConfigInterface = {
  //   slidesPerView: 1,
  //   spaceBetween: 20,
  //   pagination: {
  //     el: '.swiper-pagination1',
  //     clickable: true,
  //   },
  // };
  ngOnInit(): void {
    //Added on 22-may-21 to display modal popup when url contains // http://localhost:4200/#/login/?showpopup=true&source=sms&tid=campaign1000
    let showwelcomemodal = window.localStorage.getItem('displaywelcomemodal');
    try {
      if (
        showwelcomemodal != undefined &&
        showwelcomemodal != '' &&
        showwelcomemodal != 'NA'
      )
        showwelcomemodal = JSON.parse(showwelcomemodal);
    } catch (ex) {
      console.log(ex);
    }
    //Added on 11-nov-20 to display modal popup when user redirected from website
    let frmwebio = this.imiapi.getSession('isSSO');
    if (frmwebio != undefined && frmwebio != '' && frmwebio != 'NA') {
      try {
        frmwebio = JSON.parse(frmwebio);
      } catch (error) {
        console.log(error);
        // alert(error);
      }
    }
    let isSSO;
    if (frmwebio || showwelcomemodal) {
      let sso = this.imiapi.getSession('displaywelcomemodal');
      if (sso == undefined || sso == '' || sso == 'NA') {
        isSSO = 'Y';
        this.imiapi.setSession('displaywelcomemodal', isSSO);
      } else {
        try {
          isSSO = sso;
          isSSO = isSSO.replace(/^\"(.+)\"$/, '$1');
        } catch (e) {
          isSSO = 'Y';
          console.log(e);
        }
      }
      // alert('displaywelcomemodal value:' + isSSO);

      if (isSSO == 'Y' || isSSO == 'YY') {
        if (isSSO == 'Y') {
          this.imiapi.setSession('displaywelcomemodal', 'YY');
        }
        if (isSSO == 'YY') {
          this.imiapi.setSession('displaywelcomemodal', 'YYY');
          this.openmodal();
        }
      }
    }
    this.intializeSwipper();
    this.msisdn = this.imiapi.getMSISDN();
    this.accountype = this.imiapi.getSubstype().toUpperCase();
    this.userName = this.imiapi.getUserName();
    this.userProfile = this.imiapi.getUserProfile();
    //this.getCustomerImage();
    this.navigateToTop();
    this.checkSimStatus();
    this.checkRoamingStatus();
    this.webbookingurl =
      'https://media.kloc.co/webview/faq.html?lang=' +
      this.imiapi.getSelectedLanguage() +
      '&platform=' +
      this.imiapi.getOSVersion() +
      '&username=' +
      this.imiapi.getUserName() +
      '&ver=v3&msisdn=' +
      this.imiapi.getMSISDN();
    this.getCustomerProfile();
    console.log('In ngOnInit');
    this.getProfileImage();
  }
  show() {
    $('#popup001').modal('show');
  }
  // getMultiAlerts() {
  //   this.alertsResp = this.imiapi.getAlerts();
  //   console.log(this.alertsResp);
  // }
  navigateToTop() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
  logout() {
    this.spinner.show();
    this.imiapi.postData('v1/profile/logout', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        let displaymodal = this.imiapi.getSession('displaywelcomemodal');
        if (displaymodal != '' && displaymodal != 'NA')
          displaymodal = displaymodal.replace(/^\"(.+)\"$/, '$1');
        window.localStorage.clear();
        window.sessionStorage.clear();
        this.imiapi.setSession('displaywelcomemodal', displaymodal);
        window.location.reload();
      },
      (error) => {
        this.spinner.hide();
        window.location.reload();
      }
    );
  }
  getCustomerImage() {
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
  openNewTab(item: any) {
    let url = '';
    if (item == 'buynewnumber') {
      url = this.env.buynewnumber;
    } else if (item == 'prepaidactivation') {
      url = this.env.prepaidactivation;
    } else if (item == 'webbooking') {
      url = this.webbookingurl;
    } else if (item == 'aboutmyimi') {
      url = this.env.aboutmyimi;
    }
    if (url.indexOf('http') == 0 || url.indexOf('https') == 0) {
      window.open(url);
    } else {
      this.openCTAModal();
    }
  }
  openCTAModal() {
    this.modalRef = this.modalService.show(CtaModalComponent, {
      class: 'modal-dialog-centered',
    });
  }
  setFooter() {
    this.apidata.footerstateName.next('more');
    this.imiapi.setStorageValue('footerstateName', 'more');
  }
  checkSimStatus() {
    this.spinner.show();
    this.imiapi.postData('v1/customerprofile/get', {}).subscribe(
      (response: any) => {
        if ((response.status = '0' && response.data != null)) {
          this.simResp = response.data;
          if (this.imiapi.getSelectedLanguage() == 'EN') {
            this.simMsg =
              'Your phone number ' +
              this.simResp.custphonenumber +
              ' has been registered on ' +
              this.simResp.custname;
            this.simstatus =
              this.simResp.dukapilstatus == 'Registered'
                ? 'Registered'
                : 'Unregistered';
          } else {
            this.simMsg =
              'Nomor ' +
              this.simResp.custphonenumber +
              '  sudah terdaftar di ' +
              this.simResp.custname;
            this.simstatus =
              this.simResp.dukapilstatus == 'Registered'
                ? 'Terdaftar'
                : 'Belum terdaftar';
          }
          this.spinner.hide();
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  openSimCardPopUP() {
    $('#simstatuspopup').modal('show');
    return;
  }
  checkRoamingStatus() {
    this.spinner.show();
    this.imiapi.postData('v1/profile/roaminginfo', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        if ((response.status = '0' && response.data != null)) {
          this.roamingInfo = response.data;
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  navigatetoManageNo() {
    this.router.navigate(['/managenumber']);
  }
  navigatetoPartnerList(){
 this.router.navigate(['/partnerlist']);
  }
  navigateToPinInfo() {
    this.router.navigate(['/pinpuk']);
  }
  navigateToReadines() {
    this.router.navigate(['/4greadiness']);
  }
  openRoamingPopUP() {
    $('#roamingstatuspopup').modal('show');
    return;
  }
  navigateToProfile() {
    this.router.navigate(['/userprofile']);
  }
  navigateToStoreLocator() {
    this.router.navigate(['/storelocators']);
  }

  openUrl() {
    window.open(this.env.simRegistrationUrl);
  }
  naviagateUrl(url) {
    if ((url = 'socialconnect')) {
      this.router.navigate(['/userprofile']);
    }
  }
  getCustomerProfile() {
    this.spinner.show();
    this.imiapi.postData('v1/profile/get', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        try {
          if (response.status == '0') {
            this.alertsResp = response.data.alerts;
          }
        } catch (e) {
          console.log(e);
        }
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }
  ngAfterViewInit() {
    this.cd.detectChanges();
    this.intializeSwipper();
  }
  intializeSwipper() {
    this.config = {
      slidesPerView: 1,
      spaceBetween: 10,
      direction: 'horizontal',
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        991.98: {
          slidesPerView: 1.5,
          spaceBetween: 10,
        },
        767.98: {
          slidesPerView: 1.5,
          spaceBetween: 10,
        },
        575.98: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
      },
    };
  }
  getProfileImage() {
    this.userimage = this.env.cdnurl + 'assets/images/nophoto.jpg';
    let profileImage = this.imiapi.getSession('userprofileimage');
    if (
      profileImage != 'undefined' &&
      profileImage != 'NA' &&
      profileImage != ''
    ) {
      this.userimage = JSON.parse(profileImage);
    } else {
      this.spinner.show();
      try {
        this.imiapi
          .postData('v1/profile/downloadphoto/v2', {})
          .toPromise()
          .then((response: any) => {
            this.spinner.hide();
            this.imiapi.setSession('userprofileimage', response);
            this.userimage = response;
          })
          .catch((error) => {
            this.spinner.hide();
            console.log(error);
          });
      } catch (e) {
        this.spinner.hide();
        console.log(e);
      }
    }
  }
  openmodal() {
    this.modalRef = this.modalService.show(WelcomeModalComponent, {
      class: 'modal-dialog-centered',
    });
  }
}
