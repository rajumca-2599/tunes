import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
  IterableDiffers,
} from '@angular/core';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay, first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { CtaModalComponent } from '../../shared/cta-modal/cta-modal.component';
import { Router } from '@angular/router';
import { ApidataService } from 'src/app/shared/apidata.service';
declare var $: any;
@Component({
  selector: 'app-top-slider',
  templateUrl: './top-slider.component.html',
  styleUrls: ['./top-slider.component.css'],
})
export class TopSliderComponent implements OnInit, AfterViewInit {
  @Input() public groupname: string;
  hasContent: boolean = false;
  placeholders: any[] = [];
  banners: any = [];
  index = 0;
  config: SwiperConfigInterface = {
    autoplay: true,
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };
  selectedlanguage = 'ID';
  modalRef: BsModalRef;
  constructor(
    private env: EnvService,
    private imiapi: IMIapiService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private modalService: BsModalService,
    private router: Router,
    private apidata: ApidataService
  ) {
    this.placeholders = ['0', '1', '2'];
    this.banners = [];
  }
  ngOnInit() {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    // this.getTobBanners();
  }
  ngAfterViewInit() {
    this.getTobBanners();
    this.cd.detectChanges();
  }
  LoadbannerData(response) {
    try {
      this.spinner.hide();
      if (
        response.status != null &&
        response.status == '0' &&
        response.data != undefined
      ) {
        let banners = response.data.filter(
          (a) => a.groupname == this.groupname
        );
        if (
          banners.length > 0 &&
          banners != undefined &&
          banners[0].banner_info != undefined
        ) {
          this.banners = banners[0].banner_info;
          this.hasContent = true;
          // this.banners.forEach(function (item) {
          //   if (item.url.indexOf("http") == 0 || item.url.indexOf("https") == 0) {
          //     item.opennewtab = true;
          //   }
          //   else item.opennewtab = true;
          // });
        } else this.hasContent = false;
      } else {
        this.hasContent = false;
      }
    } catch (e) {}
  }
  getTobBanners() {
    // this.spinner.show();
    this.banners = [];
    this.imiapi.postData('v1/banners/top', {}).subscribe(
      (response: any) => {
        if (
          response.status != null &&
          response.status == '0' &&
          response.data != undefined
        ) {
          this.LoadbannerData(response);
          this.imiapi.setSessionValue(
            'topbannerdata',
            JSON.stringify(response)
          );
        } else {
          this.hasContent = false;
        }
      },
      (error) => {
        this.spinner.hide();
        this.hasContent = false;
        try {
          let _jsondata = this.imiapi.getSession('topbannerdata');
          if (_jsondata != null && _jsondata.length > 10) {
            this.LoadbannerData(JSON.parse(_jsondata));
          }
        } catch (e) {}
      }
    );
  }
  getbannerredircturl(bannerid:any){
    this.imiapi.postData('v1/banners/getredirecturl', {"bannerid":bannerid.toString()}).subscribe(
      (response: any) => {
        if (
          response.status != null &&
          response.status == '0' &&
          response.data != undefined
        ) {
          console.log(response.data)
          window.open(response.data.redirecturl);
        } 
      },
    );

  }
  openNewtab(url: any,id:any) {
    
    console.log(url)
    const decodedName = decodeURIComponent(url);
    if (url.indexOf('http') == 0 || url.indexOf('https') == 0) {
      if(decodedName.indexOf('!JWTTOKEN!')>=0){
        this.getbannerredircturl(id)
      }
      else{
        this.navigatetoInner(url);
      }
    
    } else {
      // this.openCTAModal();
      this.navigatetoInner(url);
    }
  }
  openCTAModal() {
    this.modalRef = this.modalService.show(CtaModalComponent, {
      class: 'modal-dialog-centered',
    });
  }
  navigatetoInner(url: any) {
   // url= "redirect##packagedetail##FID1GB_1_LTS";
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
    }
   else if (url.toLowerCase().includes('more')) {
      this.apidata.footerstateName.next('more');
      this.router.navigate(['/more']);
    } else {
      // this.apidata.footerstateName.next('home');
      // this.router.navigate(['/home']);
      this.openCTAModal();
    }
  }
}
