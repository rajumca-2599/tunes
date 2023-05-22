import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { CtaModalComponent } from '../../shared/cta-modal/cta-modal.component';
import { ApidataService } from 'src/app/shared/apidata.service';

@Component({
  selector: 'app-popular-content',
  templateUrl: './popular-content.component.html',
  styleUrls: ['./popular-content.component.css'],
})
export class PopularContentComponent implements OnInit, AfterViewInit {
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
  modalRef: BsModalRef;
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
  @Input() source = '';
  ngOnInit(): void {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.getcontents();
  }
  getcontents() {
    this.imiapi.postData('v1/packages/popularcontent', {}).subscribe(
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
            if (this.popularcontents.length > 0) {
              this.hasContent = 1;
              this.popularcontents.forEach((element) => {
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
    this.imiapi.setSession('pvrcode', item.pvr_code);
    this.imiapi.setSession('navigationfrom', footer);
    this.imiapi.setStorageValue('footerstateName', 'package');
    this.router.navigate(['/viewpackage']);
  }
  navigatetoBuy() {
    this.apidata.footerstateName.next('package');
    this.imiapi.setStorageValue('footerstateName', 'package');
    this.router.navigate(['/package']);
  }
}
