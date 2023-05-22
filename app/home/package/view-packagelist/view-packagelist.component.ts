import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
declare var $: any;

@Component({
  selector: 'app-view-packagelist',
  templateUrl: './view-packagelist.component.html',
  styleUrls: ['./view-packagelist.component.css'],
})
export class ViewPackagelistComponent implements OnInit, OnDestroy {
  constructor(
    private translate: TranslateService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public imiapi: IMIapiService,
    public env: EnvService,
    private apidata: ApidataService
  ) {}
  catgId = '';
  packageList: any[] = [];
  selectedlanguage = 'ID';
  helpurl: string = '';
  ngOnInit(): void {
    this.helpurl = this.imiapi.getglobalsettings();
    this.navigateToTop();
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.setFooter();
    this.catgId = JSON.parse(this.imiapi.getSession('catgId'));
    this.getPakageList();
  }
  navigateToTop() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
  getPakageList() {
    var obj = { servicename: 'GET PACKAGE', CATEGORY_ID: this.catgId };
    this.spinner.show();
    this.imiapi.postData('v1/packages/getpackagelist', obj).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.status != null) {
          if (response.data.commercial_package_category != null) {
            this.packageList = response.data.commercial_package_category;
            this.packageList[0].commercial_package.forEach((element) => {
              if (
                element.validity == 'undefined' ||
                element.validity == null ||
                element.validity == 'NA' ||
                element.validity == ''
              )
                element.isvalidityexist = false;
              else element.isvalidityexist = true;
            });
          } else {
            $('#myModal3').modal('show');
            return;
          }
        }
      },
      (error) => {
        //console.log(error);
      }
    );
  }
  getpackage(item: any) {
    this.imiapi.setSession('pvrcode', item.pvr_code);
    this.imiapi.setSession('navigationfrom', 'viewpackagelist');
    this.router.navigate(['/viewpackage']);
  }
  gotoprevious() {
    this.apidata.footerstateName.next('package');
    this.imiapi.setStorageValue('footerstateName', 'package');
    this.router.navigate(['/package']);
  }
  gotopackage(model: any) {
    $('#' + model).modal('hide');
    this.apidata.footerstateName.next('package');
    this.imiapi.setStorageValue('footerstateName', 'package');
    this.router.navigate(['/package']);
  }
  reloadpackage(model: any) {
    $('#' + model).modal('hide');
    //this.getPakageList();
  }
  setFooter() {
    this.apidata.footerstateName.next('package');
    this.imiapi.setStorageValue('footerstateName', 'package');
  }
  enablefavourite(item: any) {
    if (!item.isfavourite) var url = 'v1/favourites/add';
    else url = 'v1/favourites/delete';
    var obj = { packageid: item.pvr_code };
    this.spinner.show();
    this.imiapi.postData(url, obj).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
        }
        if (response.status == 0) {
          if (!item.isfavourite) {
            this.packageList[0].commercial_package.forEach((element, index) => {
              if (element.pvr_code == item.pvr_code) {
                element.isfavourite = true;
              }
            });
            $('#viewpackagesucess').modal('show');
            return;
          } else {
            this.packageList[0].commercial_package.forEach((element, index) => {
              if (element.pvr_code == item.pvr_code) {
                element.isfavourite = false;
              }
            });
            $('#viewpackageremove').modal('show');
            return;
          }
        }
      },
      (error) => {
       // console.log(error);
      }
    );
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  ngOnDestroy() {
    $('#myModal3').modal('hide');
    $('#viewpackageremove').modal('hide');
    $('#viewpackagesucess').modal('hide');
  }
}
