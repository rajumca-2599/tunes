import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { WelcomeModalComponent } from 'src/app/shared/welcome-modal/welcome-modal.component';
declare var $: any;
@Component({
  selector: 'app-rewards-landing',
  templateUrl: './rewards-landing.component.html',
  styleUrls: ['./rewards-landing.component.css'],
})
export class RewardsLandingComponent implements OnInit {
  mgmInfo: any = '';
  mgmText: any = '';
  content = '';
  msisdn = '';
  modalRef: BsModalRef;
  stateName = '';
  constructor(
    public env: EnvService,
    public imiapi: IMIapiService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private apidata: ApidataService,
    private modalService: BsModalService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Added on 22-may-21 to display modal popup when url contains // http://localhost:4200/#/login/?showpopup=true&source=sms&tid=campaign1000
    // let showwelcomemodal = window.localStorage.getItem('showwelcomepopup');
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
    this.msisdn = this.imiapi.getMSISDN();
    this.setFooter();
    this.getMgmInfo();
  }
  setFooter() {
    this.apidata.footerstateName.next('rewards');
    this.imiapi.setStorageValue('footerstateName', 'rewards');
  }
  getMgmInfo() {
    this.spinner.show();
    this.imiapi.postData('v1/profile/mgm', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        if ((response.status = '0' && response.data != null)) {
          this.mgmInfo = response.data;
          this.imiapi.setSession('redeem_code', this.mgmInfo.redeemcode);
          if (this.imiapi.getSelectedLanguage() == 'EN') {
            this.mgmText = response.data.meta.en;
            this.imiapi.setSession('redeem_mgmdata', response.data.meta.en);
          } else {
            this.mgmText = response.data.meta.id;
            this.imiapi.setSession('redeem_mgmdata', response.data.meta.id);
          }
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  navigateToFriends() {
    if (
      this.mgmInfo.limit_settings[0].current ==
      this.mgmInfo.limit_settings[0].max
    ) {
      if (this.imiapi.getSelectedLanguage() == 'EN')
        this.content =
          this.msisdn + ', seems like you’ve reached daily limit quota earned';
      else
        this.content =
          this.msisdn + ', limit bonus kuota harian kamu sudah maksimal';
      $('#rewardsexceedpopup').modal('show');
      return;
    }
    if (
      this.mgmInfo.limit_settings[1].current ==
      this.mgmInfo.limit_settings[1].max
    ) {
      if (this.imiapi.getSelectedLanguage() == 'EN')
        this.content =
          this.msisdn +
          ', seems like you’ve reached maximum bonus quota earned';
      else
        this.content =
          this.msisdn + ', kamu sudah mencapai maksimal bonus kuota didapa';
      $('#rewardsexceedpopup').modal('show');
      return;
    }

    this.router.navigate(['/invitefriends']);
  }
  navigate() {
    this.router.navigate(['/invitefriends']);
  }
  openmodal() {
    this.modalRef = this.modalService.show(WelcomeModalComponent, {
      class: 'modal-dialog-centered',
    });
  }
}
