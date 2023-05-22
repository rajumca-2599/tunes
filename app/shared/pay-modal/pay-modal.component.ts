import { Component, Input, OnInit } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApidataService } from '../apidata.service';
import { SharedService } from '../SharedService';
declare var $: any;
@Component({
  selector: 'app-pay-modal',
  templateUrl: './pay-modal.component.html',
  styleUrls: ['./pay-modal.component.css'],
})
export class PayModalComponent implements OnInit {
  selectedlanguage = 'ID';
  appRedircttxt: string = 'gotoplaystore';
  @Input() item: any = {};
  content = '';
  isSubscription: boolean = false;
  modalRef: BsModalRef;
  popupdata: string = '';
  constructor(
    public bsModalRef: BsModalRef,
    public env: EnvService,
    public imiapi: IMIapiService,
    private translate: TranslateService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private apidata: ApidataService,
    private sharedService:SharedService
  ) {}
  public dashboardResp: any = {};
  public enableoptions: any = {};
  ngOnInit(): void {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    if (this.imiapi.getOS().toUpperCase() == 'IOS')
      this.appRedircttxt = 'gotoappstore';
    this.getDashboard();
    this.isSubscription = this.item.isSubscription;
  }
  navigatetobuy() {
    this.apidata.footerstateName.next('package');
    this.imiapi.setStorageValue('page', 'package');
    this.imiapi.setStorageValue('footerstateName', 'package');
    this.bsModalRef.hide();
    this.router.navigate(['/package']);
  }
  navigatetoPackageList() {
    this.apidata.footerstateName.next('package');
    this.imiapi.setStorageValue('page', 'package');
    this.imiapi.setStorageValue('footerstateName', 'package');
    this.imiapi.setSession('catgId', 'EXTRA QUOTA');
    this.bsModalRef.hide();
    this.router.navigate(['/viewpackagelist']);
  }
  deactivatePackage() {
    $('#popup001').modal('hide');
    this.bsModalRef.hide();
    let url = '';
    if (this.isSubscription) {
      url = 'v1/vaspackages/deactivate';
      var obj = {
        offerid: this.item.PackageCode,
        keyword: this.item.UnregKeyword,
        shortcode: this.item.UnregShortcode.toString(),
        operationtype: '',
        tomsisdn: '',
        packagename: this.item.PackageName,
      };
    } else {
      url = 'v1/packages/deactivate';
      var obj = {
        offerid: this.item.packagedetails.PackageCode,
        keyword: this.item.packagedetails.UnregKeyword,
        shortcode: this.item.packagedetails.UnregShortcode.toString(),
        operationtype: '',
        tomsisdn: '',
        packagename: this.item.packagedetails.PackageName,
      };
    }
    this.spinner.show();
    this.imiapi.postData(url, obj).subscribe((response: any) => {
      this.spinner.hide();
      if (response.status != null) {
        this.apidata.deactivateresp.next(response.message);
        this.router.navigate(['/myaccount']);
      }
    }),
      (error) => {
        console.log(error);
        this.router.navigate(['/myaccount']);
      };
  }
  getDashboard() {
    this.dashboardResp = this.imiapi.getStorage('dashboard');
    if (
      !(
        this.dashboardResp == undefined ||
        this.dashboardResp == '' ||
        this.dashboardResp == 'NA'
      )
    ) {
      this.dashboardResp = JSON.parse(this.imiapi.getStorage('dashboard'));
      this.checkavailability(this.dashboardResp);
    } else {
      this.spinner.show();
      this.imiapi.postData('v1/dashboard/get/v2', {}).subscribe(
        (response: any) => {
          this.spinner.hide();
          if (response.status != null && response.data != undefined) {
            if (response.status == '0') {
              this.dashboardResp = response.data;
              this.checkavailability(this.dashboardResp);
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  checkavailability(dashboardresp: any) {
    dashboardresp.packdata.packageslist.forEach((element) => {
      if (element.PackageCode == this.item.packagedetails.PackageCode) {
        this.enableoptions = element;
      }
    });
  }
  openModal() {
    if (this.isSubscription) {
      this.content =
        'Are you sure want to remove package ' + this.item.ServiceDescription + '?';
    } else {
      this.content =
        'Are you sure want to remove package ' +
        this.item.packagedetails.ServiceDescription +
        '?';
    }
    $('#popup001').modal('show');
  }
  closeresponsepopup() {
    $('#reponsepopup').modal('hide');
  }
}
