import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { EnvService } from 'src/app/shared/env.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { ApidataService } from '../shared/apidata.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { WelcomeModalComponent } from '../shared/welcome-modal/welcome-modal.component';
declare const clevertap: any;
@Component({
  selector: 'app-myacc',
  templateUrl: './myacc.component.html',
  styleUrls: ['./myacc.component.css'],
})
export class MyaccComponent implements OnInit {
  public promotionssourceid: string = '';
  public accpromobannersourceid: string = '';
  isShow = false;
  selectedlanguage = 'ID';
  modalRef: BsModalRef;
  constructor(
    private env: EnvService,
    private imiapi: IMIapiService,
    private translate: TranslateService,
    private title: Title,
    private apidata: ApidataService,
    private cd: ChangeDetectorRef,
    private modalService: BsModalService
  ) {
    this.promotionssourceid = this.env.account_promotions_sourceid;
    this.accpromobannersourceid = this.env.accpromobannersourceid;
    this.setFooter();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.title.setTitle('Indosat Selfcare - Account');

    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    try {
      clevertap.event.push('Myaccount');
    } catch (e) {
      console.log('Clevertap:' + e);
    }
    let token = window.sessionStorage.getItem('fbtokenId');
    let tokenupdated = window.sessionStorage.getItem('fbtokenupdated');
    if (token != '' && token != null && tokenupdated != 'true') {
      this.updatetoken(token);
    }
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
    this.apidata.footerstateName.next('myaccount');
    this.imiapi.setStorageValue('footerstateName', 'myaccount');
  }
  ngAfterViewInit() {
    this.cd.detectChanges();
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
  openmodal() {
    this.modalRef = this.modalService.show(WelcomeModalComponent, {
      class: 'modal-dialog-centered',
    });
  }
}
