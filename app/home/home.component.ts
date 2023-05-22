import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { EnvService } from 'src/app/shared/env.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { ApidataService } from '../shared/apidata.service';
import { PlatformLocation } from '@angular/common';
import { UserFeedbackComponent } from '../shared/user-feedback/user-feedback.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import {
  Router,
  NavigationStart,
  ActivatedRoute,
  NavigationEnd,
} from '@angular/router';
import { WelcomeModalComponent } from '../shared/welcome-modal/welcome-modal.component';
import { CtaModalComponent } from '../shared/cta-modal/cta-modal.component';
import { filter } from 'rxjs/operators';
declare const clevertap: any;
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  notificationList;
  firstLogin = false;
  public promotionssourceid: string = '';
  public advancepromotionsourceid: string = '';
  public promobannersourceid: string = '';
  selectedlanguage: any;
  modalRef: BsModalRef;
  index = 0;
  config: SwiperConfigInterface = {
    slidesPerView: 1,
    spaceBetween: 10,
    observer: true,
    observeParents: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };
  public redirecthtml: any;
  public stateName: string = '';
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private translate: TranslateService,
    private title: Title,
    private apidata: ApidataService,
    location: PlatformLocation,
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.promotionssourceid = this.env.home_promotions_sourceid;
    this.advancepromotionsourceid = this.env.home_advance_promotions_sourceid;
    this.promobannersourceid = this.env.home_promobannersourceid;
    this.setFooter();
    location.onPopState(() => {
      // console.log("In location onPopState");
      this.setFooter();
    });
    try {
      clevertap.event.push('Home');
    } catch (e) {
      //console.log('Clevertap:' + e);
    }
    setTimeout(() => {
      // alert('Hidden');
      document.body.style.overflow = 'auto';
    }, 1000);
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.stateName = this.imiapi.getState(event['url']);
      }
    });
  }
  ngOnInit(): void {
    // this.imiapi.setSession('displaywelcomemodal', 'YYY');
    window.scrollTo(0, 0);
    this.title.setTitle('Indosat Selfcare - Home');
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    //this.openNotifications();
    this.getAppNotifications();
    let token = window.sessionStorage.getItem('fbtokenId');
    let tokenupdated = window.sessionStorage.getItem('fbtokenupdated');
    if (token != '' && token != null && tokenupdated != 'true') {
      this.updatetoken(token);
    }
    // this.imiapi.setSession('isSSO', true);

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
    //  alert('Home webio:' + frmwebio);
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
  }
  setFooter() {
    this.apidata.footerstateName.next('home');
    this.imiapi.setStorageValue('footerstateName', 'home');
  }
  openNotifications() {
    let firstlogin = this.imiapi.getSession('firstlogin');
    if (firstlogin != 'NA' && firstlogin != undefined && firstlogin != '') {
      this.firstLogin = JSON.parse(firstlogin);
    }
    if (this.firstLogin == false) {
      this.imiapi.setSession('firstlogin', true);
      this.getAppNotifications();
    }
  }
  getAppNotifications() {
    this.imiapi.postData('v1/notifications/inapp', {}).subscribe(
      (response: any) => {
        if (
          response.status != null &&
          response.status == '0' &&
          response.data != ''
        ) {
          this.notificationList = response.data;
          $('#smallModal').modal('show');
        }
      },
      (error) => {
        // console.log(error);
      }
    );
  }
  closeDiv(div) {
    $('#' + div).modal('hide');
  }
  activateOffer() {
    $('#smallModal').modal('hide');
    var obj = { pushid: 'ACQUISITION' };
    this.imiapi.postData('v1/packages/offer', obj).subscribe(
      (response: any) => {
        if (
          response.status != null &&
          response.status == '0' &&
          response.data != ''
        ) {
          $('#offeractivated').modal('show');
          this.modalRef = this.modalService.show(UserFeedbackComponent, {
            class: 'modal-dialog-centered',
          });
        }
      },
      (error) => {
        // console.log(error);
      }
    );
  }
  updatetoken(token: any) {
    console.log('Inside updatetoken' + token);
    var obj = { pushnotificationid: token };
    this.imiapi.postData('v1/notifications/pwa/updatetoken', obj).subscribe(
      (response: any) => {
        if ((response.status = '0' && response.data != null))
          window.sessionStorage.setItem('fbtokenupdated', 'true');
      },
      (error) => {
        //  console.log(error);
      }
    );
  }
  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  //DIGITAL-6706|venkatarao.m|PWA Redirection|2021-09-28
  // openRedirectModel() {
  //   let firstlogin = this.imiapi.getSession('firstlogin');
  //   if (firstlogin != 'NA' && firstlogin != undefined && firstlogin != '') {
  //     this.firstLogin = JSON.parse(firstlogin);
  //   }
  //   if (this.firstLogin == false) {
  //     this.imiapi.setSession('firstlogin', true);
  //     this.getRedirectNotification(); // get redirect notifications based on first login
  //   }
  // }
  // getRedirectNotification() {
  //   let getTemplateParam = this.env.getTemplateParam;
  //   this.imiapi.postData('v1/template/get?type=' + getTemplateParam + '', {}).subscribe(
  //     (response: any) => {
  //       if (response != undefined && response != '' && response != null) {
  //         this.redirecthtml = response; // bind html
  //         $('#divredirectModal').modal('show'); //showing redirect popup
  //       }
  //       else {
  //         // showing app notification popup if user first login
  //         if (this.firstLogin == false) {
  //           this.getAppNotifications();
  //         }
  //       }
  //     }, (error) => {
  //       console.log("getRedirectNotification", { error })
  //       // showing app notification popup if user first login
  //       if (this.firstLogin == false) {
  //         this.getAppNotifications();
  //       }
  //     }
  //   );
  // }
  // //DIGITAL-6706|venkatarao.m|PWA Redirection|2021-09-28
  // onredirectModalClose() {
  //   $('#divredirectModal').modal('hide');
  //   // calling api trans logs once redirect popup closed
  //   try {
  //     if ((this.stateName === "" || this.stateName === undefined) && this.activeRoute.snapshot.url != undefined) {
  //       this.stateName = this.activeRoute.snapshot.url[0].path;
  //     }

  //     let postlog = {
  //       "event_name": "Home Popup",
  //       "event_attributes": {
  //         "screen_name": this.stateName,
  //         "title": "PWA Home Popup Close"
  //       }
  //     }
  //     this.imiapi.postData('v1/userjourney/addlog', postlog).subscribe((response: any) => {
  //       if (response.status == null || response.status != '0' || response.code != '26000') {
  //         this.imiapi.log('addlog:' + response);
  //       }
  //     }, (error) => {
  //       this.imiapi.log('addlog:' + error);
  //     });
  //   }
  //   catch (error) {
  //     this.imiapi.log('addlog:' + error);
  //   }
  //   // showing app notification popup if user first login once redirect popup closed
  //   if (this.firstLogin == false) {
  //     this.getAppNotifications();
  //   }
  // }
  openmodal() {
    this.modalRef = this.modalService.show(WelcomeModalComponent, {
      class: 'modal-dialog-centered',
    });
  }
}
