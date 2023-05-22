import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  Output
} from '@angular/core';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { CtaModalComponent } from '../../shared/cta-modal/cta-modal.component';
import { Router } from '@angular/router';
import { ApidataService } from 'src/app/shared/apidata.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css'],
})
export class RecommendationsComponent implements OnInit, AfterViewInit {
  hasContent: number = 0;
  placeholders: any[] = [];
  recommendations: any[] = [];
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
        slidesPerView: 2.25,
        spaceBetween: 0,
      },
      575.98: {
        slidesPerView: 1.25,
        spaceBetween: 0,
      },
    },
  };
  selectedlanguage = 'ID';
  modalRef: BsModalRef;
  constructor(
    private env: EnvService,
    private imiapi: IMIapiService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private modalService: BsModalService,
    private router: Router,
    private apidata: ApidataService
  ) {
    this.placeholders = ['0', '1', '2'];
    this.recommendations = [];
    this.hasContent = 0;
  }
  ngOnInit(): void {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.getRecommendations();
  }
  ngAfterViewInit() {
    // setTimeout(()=>{
    this.cd.detectChanges();
    //}, 5000);
  }
  getRecommendations() {
    this.imiapi.postData('v1/packages/getrecommendations', {}).subscribe(
      (response: any) => {
        if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
        }
        if (response.status != null && response.data != undefined) {
          if (response.status == '0') {
            this.recommendations = response.data;
            if (this.recommendations.length > 0) this.hasContent = 1;
            else this.hasContent = 2;
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
        this.hasContent = 2;
        //console.log(error);
      }
    );
  }

  openCTAModal() {
    this.modalRef = this.modalService.show(CtaModalComponent, {
      class: 'modal-dialog-centered',
    });
  }
  navigate(data:any) {
    this.apidata.footerstateName.next('package');
    this.imiapi.setStorageValue('footerstateName','package');
    this.imiapi.setSession('recommendedtab',data)
    this.router.navigate(['/package']);
  }
}
