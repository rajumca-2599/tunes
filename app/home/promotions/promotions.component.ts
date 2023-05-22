import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { CtaModalComponent } from '../../shared/cta-modal/cta-modal.component';
import { Router } from '@angular/router';
import { ApidataService } from 'src/app/shared/apidata.service';

declare var $: any;

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css'],
})
export class PromotionsComponent implements OnInit, AfterViewInit {
  @Input() public sourceid: string;
  promotions: any[] = [];
  index = 0;
  public hasContent: number = 0;
  placeholders: any[] = [];
  config: SwiperConfigInterface = {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: '.swiper-pagination1',
      clickable: true,
    },
  };
  selectedlanguage = 'ID';
  modalRef: BsModalRef;
  title: string = '';
  @Input() public source: string;
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private modalService: BsModalService,
    private router: Router,
    private apidata: ApidataService
  ) {
    this.placeholders = ['0'];
    this.promotions = [];
    this.hasContent = 0;
  }

  ngOnInit(): void {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.getpromotions();
  }
  getpromotions() {
    this.imiapi
      .postData('v1/banners/getbyid', { sourceid: this.sourceid })
      .subscribe(
        (response: any) => {
          if (response.code == '10002' || response.code == '11111') {
            this.imiapi.clearSession();
            // this.router.navigate(['/login']);
            // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
          }
          if (response.status != null && response.data != undefined) {
            if (response.status == '0') {
              if (
                response.data[0] != undefined &&
                response.data[0].banner_info != undefined
              ) {
                this.title = response.data[0].title;
                this.promotions = response.data[0].banner_info;
                if (this.promotions.length > 0) {
                  this.hasContent = 1;
                  this.cd.detectChanges();
                } else this.hasContent = 2;
              } else {
                this.hasContent = 2;
              }
            } else if (
              response.status == '10002' ||
              response.status == '11111'
            ) {
              this.imiapi.clearSession();
              // this.router.navigate(['/login']);
              // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
            } else {
              this.hasContent = 2;
            }
          } else {
            this.hasContent = 2;
          }
        },
        (error) => {
          this.hasContent = 2;
         // console.log(error);
        }
      );
  }
  openNewtab(url: any) {
    if (url.indexOf('http') == 0 || url.indexOf('https') == 0) {
      window.open(url);
    } else {
      //this.openCTAModal();
      this.navigatetoInner(url);
    }
  }
  openCTAModal() {
    this.modalRef = this.modalService.show(CtaModalComponent, {
      class: 'modal-dialog-centered',
    });
  }
  navigatetoInner(url: any) {
    if (url == 'account') {
      this.apidata.footerstateName.next('myaccount');
      this.router.navigate(['/myaccount']);
    } else if (url == 'usagehistory') {
      this.apidata.footerstateName.next('myaccount');
      this.router.navigate(['/transhistory']);
    } else if (url == 'search') {
      let stateName = this.imiapi.getStorage('footerstateName');
      if (stateName == '' || stateName == undefined) stateName = 'home';
      this.apidata.footerstateName.next(stateName);
      this.router.navigate(['/packagesearch/' + stateName]);
    } else if (url == 'home') {
      this.apidata.footerstateName.next('home');
     
      this.router.navigate(['/home']);
    } else if (url == 'inbox') {
      let stateName = this.imiapi.getStorage('footerstateName');
      if (stateName == '' || stateName == undefined) stateName = 'home';
      this.apidata.footerstateName.next(stateName);
      this.router.navigate(['/inbox/' + stateName]);
    } else if (url == 'billinghistory') {
      this.apidata.footerstateName.next('myaccount');
      this.router.navigate(['/billinghistory']);
    } else if (url.toLowerCase().includes('redirect')) {
      this.apidata.footerstateName.next('package');
      this.imiapi.setStorageValue('footerstateName','package');
      let stateName = this.imiapi.getStorage('footerstateName');
      if (stateName == '' || stateName == undefined) stateName = 'home';
      if (url.toLowerCase().includes('packagelist')) {
        this.imiapi.setSession('catgId', url.split('##')[2]);
        this.imiapi.setSession('navigationfrom', stateName);
        this.router.navigate(['/viewpackagelist']);
      } else {
        this.imiapi.setSession('pvrcode', url.split('##')[2]);
        this.imiapi.setSession('navigationfrom', stateName);
        this.router.navigate(['/viewpackage']);
      }
    } else if (url.toLowerCase().includes('more')) {
      this.apidata.footerstateName.next('more');
      this.router.navigate(['/more']);
    } else {
      // this.apidata.footerstateName.next('home');
      // this.router.navigate(['/home']);
      this.openCTAModal();
    }
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
