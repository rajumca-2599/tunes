import {
  Component,
  OnInit,
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
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-accdashboard',
  templateUrl: './accdashboard.component.html',
  styleUrls: ['./accdashboard.component.css'],
})
export class AccdashboardComponent implements OnInit, AfterViewInit {
  public hasContent: number = 0;
  placeholders: any[] = [];
  public dashboardResp: any = {};
  userProfile: any = {};
  ispostpaid: boolean = false;
  selectedlanguage = 'ID';
  modalRef: BsModalRef;
  userimage:any;
  constructor(
    public env: EnvService,
    public imiapi: IMIapiService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private modalService: BsModalService,
    private router: Router,
    private spinner:NgxSpinnerService
  ) {
    this.placeholders = ['1', '2', '3'];
  }

  ngOnInit(): void {
    this.getDashboard();

    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    if (this.imiapi.getSubstype().toUpperCase() == 'POSTPAID')
      this.ispostpaid = true;
  }
  getDashboard() {
    //this.imiapi.log("DashBoard" + this.imiapi.getStorage("dashboard"));
    this.hasContent = 2;
    this.userProfile = this.imiapi.getUserProfile();
    this.dashboardResp = this.imiapi.getStorage('dashboard');
    //  console.log(this.dashboardResp);
    if (
      !(
        this.dashboardResp == undefined ||
        this.dashboardResp == '' ||
        this.dashboardResp == 'NA'
      )
    ) {
      this.dashboardResp = JSON.parse(this.imiapi.getStorage('dashboard'));
      this.hasContent = 1;
      // this.dashboardResp.packdata.msisdn = this.imiapi.formatMobileNo(this.dashboardResp.packdata.msisdn)
    } else {
      this.imiapi.log('Calling:DashBoard');
      this.imiapi.postData('v1/dashboard/get/v2', {}).subscribe(
        (response: any) => {
          if (response.status != null && response.data != undefined) {
            if (response.status == '0') {
              this.dashboardResp = response.data;
              this.hasContent = 1;
              this.imiapi.setStorage('dashboard', response.data);
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  openCTAModal() {
    this.modalRef = this.modalService.show(CtaModalComponent, {
      class: 'modal-dialog-centered',
    });
  }
  navigatetoTopUP() {
    this.router.navigate(['/topup']);
  }
  navigatetopaybill() {
    this.router.navigate(['/paybill']);
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
}
