import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { CtaModalComponent } from 'src/app/shared/cta-modal/cta-modal.component';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';

@Component({
  selector: 'app-advance-promotions',
  templateUrl: './advance-promotions.component.html',
  styleUrls: ['./advance-promotions.component.css'],
})
export class AdvancePromotionsComponent implements OnInit {
  @Input() public advancesourceid: string;
  promotions: any[] = [];
  index = 0;
  public hasContent: number = 0;
  placeholders: any[] = [];
  config: SwiperConfigInterface = {
    slidesPerView: 5.5,
    spaceBetween: 0,
    observer: true,
    observeParents: true,
    // slidesPerView: 5.5,
    // spaceBetween: 0,
    // breakpoints: {
    //   991.98: {
    //     slidesPerView: 5.5,
    //     spaceBetween: 0,
    //   },
    //   575.98: {
    //     slidesPerView: 4.5,
    //     spaceBetween: 0,
    //   },
    //   425: {
    //     slidesPerView: 3.5,
    //     spaceBetween: 0,
    //   },
    // },
  };
  selectedlanguage = 'ID';
  modalRef: BsModalRef;
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private modalService: BsModalService,
    private router: Router
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
      .postData('v1/banners/getbyid', { sourceid: this.advancesourceid })
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
                this.promotions = response.data[0].banner_info;
                if (this.promotions.length > 0) {
                  this.hasContent = 1;
                  this.cd.detectChanges();
                } else this.hasContent = 2;
              } else {
                this.hasContent = 2;
              }
            } else if (response.code == '10002' || response.code == '11111') {
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
      this.openCTAModal();
    }
  }
  openCTAModal() {
    this.modalRef = this.modalService.show(CtaModalComponent, {
      class: 'modal-dialog-centered',
    });
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
