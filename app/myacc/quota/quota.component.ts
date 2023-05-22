import { Component, OnInit } from '@angular/core';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { EnvService } from '../../shared/env.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { from, of, zip, iif } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { TranslateService } from '@ngx-translate/core';

import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { PayModalComponent } from '../../shared/pay-modal/pay-modal.component';
import { ApidataService } from '../../shared/apidata.service';
import { SharedService } from 'src/app/shared/SharedService';
declare var $: any;

@Component({
  selector: 'app-quota',
  templateUrl: './quota.component.html',
  styleUrls: ['./quota.component.css'],
})
export class QuotaComponent implements OnInit {
  public remainingData: any[] = [];
  public remainingVoice: any[] = [];
  public remainingSMS: any[] = [];
  public remainingRupiah: any[] = [];

  public specialData: any[] = [];
  public specialVoice: any[] = [];
  public specialSMS: any[] = [];
  public specialRupiah: any[] = [];

  public packQuotas: any[] = [];
  public hasContent: number = 0;
  index = 0;
  placeholders: any[] = [];
  config: SwiperConfigInterface = {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };
  selectedlanguage = 'ID';
  modalRef: BsModalRef;
  message = '';
  constructor(
    public env: EnvService,
    public imiapi: IMIapiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    public translate: TranslateService,
    private modalService: BsModalService,
    private apiData: ApidataService,
    private sharedservice: SharedService
  ) {
    this.placeholders = ['0'];
    this.hasContent = 0;
    this.apiData.deactivateresp.subscribe((msg) => {
      this.message = msg.toString();
      if(this.message!=undefined && this.message!="NA")
      { $('#deactivatesucess').modal('show');}
    });
  } 
  closeModal() {
    this.getDashboardData();
    $('#deactivatesucess').modal('hide');
  }
  ngOnInit(): void {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);

    this.getDashboardData();
   
    // let dashboardResp = this.imiapi.getStorage("dashboard");
    // if (dashboardResp == undefined || dashboardResp == "" || dashboardResp == "NA") {
    //   this.imiapi.postData("v1/dashboard/get/v2", {}).subscribe((response: any) => {
    //     if (response.status != null && response.status == "0" && response.data != undefined) {
    //       this.packQuotas = this.getpackQuotas(response.data)
    //       if (this.packQuotas.length == 0) { this.hasContent = 2; }
    //       else { this.formatresult(); this.hasContent = 1; }
    //     }
    //   });
    // }
    // else {
    //   this.packQuotas = this.getpackQuotas(JSON.parse(dashboardResp));
    //   if (this.packQuotas.length == 0) this.hasContent = 2;
    //   else { this.formatresult(); this.hasContent = 1; }
    // }
  }
  getDashboardData() {
    /* this.imiapi.postData("v1/dashboard/get/v2", {}).subscribe((response: any) => {
      if (response.status != null && response.status == "0" && response.data != undefined) {
        this.packQuotas = this.getpackQuotas(response.data)
        if (this.packQuotas.length == 0) { this.hasContent = 2; }
        else { this.formatresult(); this.hasContent = 1; }
      }
      else 
      {
        this.hasContent = 2;
      }
    }); */

    let dashboardResp = this.imiapi.getStorage('dashboard');
    if (
      !(
        dashboardResp == undefined ||
        dashboardResp == '' ||
        dashboardResp == 'NA'
      )
    ) {
      this.packQuotas = this.getpackQuotas(JSON.parse(dashboardResp));
      if (this.packQuotas.length == 0) {
        this.hasContent = 2;
      } else {
        this.formatresult();
        this.hasContent = 1;

        let packCodes = [];
        this.packQuotas.forEach(function (item) {
          if (item.PackageCode != '' && item.PackageCode != undefined) {
            packCodes.push(item.PackageCode);
          }
        });
        if (packCodes.length > 0) this.getspecialpackages(packCodes);
      }
    } else {
      this.hasContent = 2;
    }
  }
 
  getpackQuotas(data): any[] {
    let quotaData = [];
    try {
      if (data == undefined || data.length == 0) return quotaData;
      if (
        data.packdata != undefined &&
        data.packdata.packageslist != undefined &&
        data.packdata.packageslist.length > 0
      ) {
        // data.packdata.packageslist.forEach(function (item) {
        //   if (item.Quotas != undefined && item.Quotas != [] && item.Quotas.length > 0) {
        //     packdat.push(item)
        //   }
        // });
        let _pcgSub = from(data.packdata.packageslist)
          .pipe(
            mergeMap((v) =>
              iif(
                () =>
                  v['Quotas'] != undefined &&
                  v['Quotas'] != [] &&
                  v['Quotas'].length > 0,
                of(v)
              )
            )
          )
          .subscribe((val) => {
            quotaData.push(val);
          });
        if (_pcgSub != undefined) {
          _pcgSub.unsubscribe();
        }
        //this.imiapi.log("Quotas_length:" + quotaData.length)
      }
    } catch (e) {}
    return quotaData;
  }
  formatresult() {
    let data: any = [];
    let voice: any = [];
    let sms: any = [];
    let rupiah: any = [];

    try {
      for (let item of this.packQuotas) {
        if (
          item.Quotas != undefined &&
          item.Quotas != [] &&
          item.Quotas.length > 0
        ) {
          var _quotaSub = from(item.Quotas)
            .pipe(
              groupBy(
                (bt) => bt['benefitType'].toUpperCase(),
                (p) => p
              ),
              mergeMap((group) => zip(of(group.key), group.pipe(toArray())))
            )
            .subscribe((val) => {
              let values: any = {};
              values.packagedetails = item;
              if (val[0] == 'DATA') {
                values.data = val[1];
                data.push(values);
              }
              if (val[0] == 'VOICE') {
                values.voice = val[1];
                voice.push(values);
              }
              if (val[0] == 'SMS') {
                values.sms = val[1];
                sms.push(values);
              }
              if (val[0] == 'RUPIAH') {
                values.rupiah = val[1];
                rupiah.push(values);
              }
            });
          if (_quotaSub != undefined) {
            _quotaSub.unsubscribe();
          }
        }
      }
    } catch (e) {}
    this.remainingData = data;
    this.remainingVoice = voice;
    this.remainingSMS = sms;
    this.remainingRupiah = rupiah;
    this.hasContent = 1;
  }
  getStyle(usedval, initval) {
    let w = 0;
    w = Math.round((usedval * 100) / initval);
    return 'width:' + w + '%';
  }

  getBarPointStyle(usedval, initval) {
    let w = 0;
    w = Math.round((usedval * 100) / initval);
    return 'left:' + w + '%';
  }
  getPercentVal(initval, usedval) {
    let w = 0;
    w = Math.round((usedval * 100) / usedval);
    return w;
  }
  openPayModal(item: any) {
    item.isSubscription = false;
    //this.modalRef = this.modalService.show(PayModalComponent, { class: 'modal-dialog-centered' }, { initialState: { item }});
    this.modalRef = this.modalService.show(PayModalComponent, {
      initialState: { item },
      class: 'modal-dialog-centered',
    });
  }
  getspecialpackages(packagecodes) {
    //let packagecodes = this.packagecodes;
    try {
      let tmpSplData = [];
      let tmpSplSMS = [];
      let tmpSplVoice = [];
      // Getting Special Pakages
      //this.imiapi.postData("v1/packages/getspecialpackages", {}).subscribe((response: any) => {
      this.apiData.getSpecialPackages(false).subscribe(
        (response: any) => {
          if (
            response.status != null &&
            response.status == '0' &&
            response.data != undefined
          ) {
            response.data.forEach(function (item) {
              if (item.pvr_id != undefined && item.pvr_id.length > 0) {
                for (var i = 0; i < item.pvr_id.length; i++) {
                  let haspack = packagecodes.includes(item.pvr_id[i]);
                  if (haspack && item.attributes != undefined) {
                    if (
                      item.attributes.isDisplayUnlimitedDataBar &&
                      item.attributes.isDisplayUnlimitedDataBar.toUpperCase() ==
                        'TRUE'
                    )
                      tmpSplData.push({
                        pvr_id: item.pvr_id[i],
                        isDisplayUnlimitedDataBar:
                          item.attributes.isDisplayUnlimitedDataBar,
                        UnlimitedDataBarString:
                          item.attributes.UnlimitedDataBarString,
                      });

                    if (
                      item.attributes.isDisplayUnlimitedSMSBar &&
                      item.attributes.isDisplayUnlimitedSMSBar.toUpperCase() ==
                        'TRUE'
                    )
                      tmpSplSMS.push({
                        pvr_id: item.pvr_id[i],
                        UnlimitedSMSBarString:
                          item.attributes.UnlimitedSMSBarString,
                        isDisplayUnlimitedSMSBar:
                          item.attributes.isDisplayUnlimitedSMSBar,
                      });

                    if (
                      item.attributes.isDisplayUnlimitedPhoneBar &&
                      item.attributes.isDisplayUnlimitedPhoneBar.toUpperCase() ==
                        'TRUE'
                    )
                      tmpSplVoice.push({
                        pvr_id: item.pvr_id[i],
                        UnlimitedPhoneBarString:
                          item.attributes.UnlimitedPhoneBarString,
                        isDisplayUnlimitedPhoneBar:
                          item.attributes.isDisplayUnlimitedPhoneBar,
                      });

                    /* else if (item.attributes.isDisplayUnlimitedDataBar
                    && item.attributes.isDisplayUnlimitedDataBar.toUpperCase() == "TRUE")
                    this.specialData.push({ "UnlimitedDataBarString": item.attributes.UnlimitedDataBarString, "isDisplayUnlimitedSMSBar": item.attributes.isDisplayUnlimitedSMSBar }); */
                    break;
                  }
                }
              }
            });
            this.specialData = tmpSplData;
            this.specialSMS = tmpSplSMS;
            this.specialVoice = tmpSplVoice;
            //this.imiapi.log("specialData:" + this.specialData.length)
            //this.imiapi.log("specialSMS:" + this.specialSMS.length)
            //this.imiapi.log("specialVoice:" + this.specialVoice.length)
          }
        },
        (error) => {
          //console.log(error);
        }
      );
    } catch (e) {}
  }
}
