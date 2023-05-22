import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EnvService } from 'src/app/shared/env.service';
import { TranslateService } from '@ngx-translate/core';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { CtaModalComponent } from 'src/app/shared/cta-modal/cta-modal.component';
import { Router } from '@angular/router';
import { ApidataService } from 'src/app/shared/apidata.service';
@Component({
  selector: 'app-popular-package',
  templateUrl: './popular-package.component.html',
  styleUrls: ['./popular-package.component.css'],
})
export class PopularPackageComponent implements OnInit {
  placeholders: any[] = [];
  popularpackages: any = [];
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
  modalRef: BsModalRef;
  @Input() public source: string = '';
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private modalService: BsModalService,
    private router: Router,
    private apidata: ApidataService
  ) {
    this.placeholders = ['0', '1', '2'];
  }
  ngOnInit(): void {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.getpopularpackage();   
  }
  getpopularpackage() {
    this.imiapi.postData('v1/packages/popular', {}).subscribe(
      (response: any) => {
        if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
        }
        if (response.status != null && response.data != undefined) {
          if (response.status == '0') {
            this.popularpackages = response.data;
            if (this.popularpackages.length > 0) {
              this.hasContent = 1;
              this.popularpackages.forEach(element => {
                element.traiffdisplay= element.tariff_display.replace('Rp', '');
              });
            } else this.hasContent = 2;
          } else if (response.status == '10002' || response.status == '11111') {
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
       // console.log(error);
        this.hasContent = 2;
      }
    );
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  openCTAModal() {
    this.modalRef = this.modalService.show(CtaModalComponent, {
      class: 'modal-dialog-centered',
    });
  }
  gotpayment(item: any) {
    let footer = this.imiapi.getStorage('footerstateName');
    if (footer != undefined && footer != 'NA') footer = footer;
    else footer = 'package';
    this.apidata.footerstateName.next('package');
    //this.imiapi.setSession('selectedpackage',item);
    this.imiapi.setSession('pvrcode', item.pvr_code);
    this.imiapi.setSession('navigationfrom',footer);
    this.router.navigate(['/viewpackage']);
  }
  navigatetoBuy() {
    this.apidata.footerstateName.next('package');
    this.router.navigate(['/package']);
  }
}
