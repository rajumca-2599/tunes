import {  Component,
  OnInit,
  ChangeDetectorRef,
  Input, } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';

@Component({
  selector: 'app-only-for-you',
  templateUrl: './only-for-you.component.html',
  styleUrls: ['./only-for-you.component.css']
})
export class OnlyForYouComponent implements OnInit {

  placeholders: any[] = [];
  popularcontents: any = [];
  index = 0;
  config: SwiperConfigInterface = {
    slidesPerView: 1.25,
    spaceBetween: 0,
    breakpoints: {
      991.98: {
        slidesPerView: 2.25,
        spaceBetween: 0,
      },
      767.98: {
        slidesPerView: 1.25,
        spaceBetween: 0,
      },
      575.98: {
        slidesPerView: 1.25,
        spaceBetween: 0,
      },
    },
  };
  selectedlanguage = 'ID';
  public hasContent: number = 0;
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private router: Router,
    private apidata: ApidataService
  ) {
    this.placeholders = ['0', '1', '2'];
  }
  ngOnInit(): void {
    this.setFooter();
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.getcontents();
  }
  getcontents() {
    this.imiapi.postData('v1/offer/getlist', {}).subscribe(
      (response: any) => {
        if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
        }
        if (response.status != null && response.data != undefined) {
          if (response.status == '0') {
            this.popularcontents = response.data;
            if (this.popularcontents.commercialPackages.length > 0) {
              this.hasContent = 1;
              this.popularcontents.commercialPackages.forEach((element) => {
                element.traiffdisplay = element.tariff_display.replace(
                  'Rp',
                  ''
                );
              });
            } else this.hasContent = 2;
          } else if (response.status == '10002' || response.status == '11111') {
            this.imiapi.clearSession();
            // this.router.navigate(['/login']);
            // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
          }
        } else {
          this.hasContent = 2;
        }
      },
      (error) => {
       // console.log(error);
        this.hasContent = 2;
      }
    );
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  gotpayment(item: any) {
    let footer = this.imiapi.getStorage('footerstateName');
    if (footer != undefined && footer != 'NA') footer = footer;
    else footer = 'package';
    this.apidata.footerstateName.next('package');
    this.imiapi.setSession('pvrcode', item);
    this.imiapi.setSession('navigationfrom', 'onlyforyou');
    this.imiapi.setStorageValue('footerstateName', 'package');
    this.imiapi.setSession('commerical_package', item);
    this.router.navigate(['/viewpackage']);
  }
  navigatetoHotPromo() {
    this.apidata.footerstateName.next('home');
    this.imiapi.setStorageValue('footerstateName', 'home');
    this.router.navigate(['/onlyforyou']);
  }
  setFooter() {
    this.apidata.footerstateName.next('home');
    this.imiapi.setStorageValue('footerstateName', 'home');
  }

}
