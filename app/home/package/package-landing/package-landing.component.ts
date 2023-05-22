import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { WelcomeModalComponent } from 'src/app/shared/welcome-modal/welcome-modal.component';
declare var $: any;
import { slideInAnimation } from '../../../../animations/index';

@Component({
  selector: 'app-package-landing',
  templateUrl: './package-landing.component.html',
  styleUrls: ['./package-landing.component.css'],
  animations: [slideInAnimation],
})
export class PackageLandingComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public imiapi: IMIapiService,
    public env: EnvService,
    private apidata: ApidataService,
    private modalService: BsModalService
  ) {}
  packageList: any[] = [];
  contentList: any[] = [];
  favouriteList: any[] = [];
  catgList: any = [];
  selectedlanguage = 'ID';
  selectedtab = '';
  enablepackagetab: boolean = true;
  enablecontenttab: boolean = false;
  enablefavouritetab: boolean = false;
  public promotionssourceid: string = '';
  public promotionbannerssourceid: string = '';
  modalRef: BsModalRef;
  ngOnInit(): void {
    this.navigateToTop();
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.setFooter();
    this.promotionssourceid = this.env.package_promotions_sourceid;
    this.promotionbannerssourceid = this.env.package_promotionbanner_sourceid;
    if (this.imiapi.getSession('recommendedtab') != 'NA')
      this.selectedtab = JSON.parse(this.imiapi.getSession('recommendedtab'));
    this.packageCategories();
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
  navigateToTop() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  packageCategories() {
    var obj = { servicename: 'GET PACKAGE CATEGORY' };
    this.spinner.show();
    this.imiapi.postData('v1/packages/getpackagecategory', obj).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
        }
        if (response.status != null && response.data != undefined) {
          if (response.status == '0') {
            let arr = [];
            for (var key of Object.keys(response.data.packages)) {
              arr.push(response.data.packages[key]);
            }
            this.packageList = this.sortByKey(arr, 'order');
            this.contentList = response.data.contents.content.categories;
            if (this.selectedtab == '')
              this.selctedPackageCategory(this.packageList[0]);
            else {
              if (this.selectedtab == 'Content') {
                this.getselectedtab('step-2');
              }
              if (this.selectedtab == 'favourite') {
                this.getselectedtab('step-3');
              } else {
                var result = this.packageList.filter(
                  (x) => x.title.toLowerCase() == this.selectedtab.toLowerCase()
                )[0];
                if (result != undefined && result != '')
                  this.selctedPackageCategory(result);
              }
            }
          }
        }
      },
      (error) => {
        // console.log(error);
      }
    );
  }
  sortByKey(array, key) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }
  getfavourite() {
    this.spinner.show();
    this.imiapi.postData('v1/favourites/get', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
        }
        if (response.status != null && response.data != undefined) {
          if (response.status == '0') {
            this.favouriteList = response.data;
          }
        }
      },
      (error) => {
        //console.log(error);
      }
    );
  }
  selctedPackageCategory(item: any) {
    this.selectedtab = item.title;
    this.catgList = item.categories;
  }
  getpackagelist(catgId: any) {
    this.imiapi.setSession('catgId', catgId);
    this.imiapi.setSession('navigationfrom', 'package');
    this.router.navigate(['/viewpackagelist']);
  }

  getselectedtab(item: any) {
    if (item == 'step-1') {
      this.enablepackagetab = true;
      this.enablecontenttab = false;
      this.enablefavouritetab = false;
      if (this.packageList == null || this.packageList.length < 0)
        this.packageCategories();
    } else if (item == 'step-2') {
      this.enablepackagetab = false;
      this.enablecontenttab = true;
      this.enablefavouritetab = false;
      if (this.contentList == null || this.contentList.length < 0)
        this.packageCategories();
    } else if (item == 'step-3') {
      this.enablepackagetab = false;
      this.enablecontenttab = false;
      this.enablefavouritetab = true;
      this.getfavourite();
    }
  }
  getstyle(item: any) {
    return (
      'linear-gradient(to right,' +
      item.content_gradient_start +
      ',' +
      item.content_gradient_end +
      ')'
    );
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
            // this.getfavourite();
            this.favouriteList.forEach((element) => {
              if (element.commercial_package.pvr_code == item.pvr_code) {
                element.commercial_package.isfavourite = true;
              }
            });
            $('#packagesucess').modal('show');
            return;
          } else {
            //this.getfavourite();
            this.favouriteList.forEach((element, index) => {
              if (element.commercial_package.pvr_code == item.pvr_code) {
                element.commercial_package.isfavourite = false;
                this.favouriteList.splice(index, 1);
              }
            });
            $('#packageremove').modal('show');
            return;
          }
        }
      },
      (error) => {
        //console.log(error);
      }
    );
  }
  navigateToBuy(item: any) {
    // this.imiapi.setSession('selectedpackage', item);
    this.imiapi.setSession('pvrcode', item.pvr_code);
    this.imiapi.setSession('navigationfrom', 'package');
    this.router.navigate(['/viewpackage']);
  }
  closeModal(model: any) {
    $('#' + model).modal('hide');
  }
  ngOnDestroy() {
    this.imiapi.removeSession('recommendedtab');
    $('#myModal3').modal('hide');
    $('#packageremove').modal('hide');
    $('#packagesucess').modal('hide');
  }
  setFooter() {
    this.apidata.footerstateName.next('package');
    this.imiapi.setStorageValue('footerstateName', 'package');
  }
  openmodal() {
    this.modalRef = this.modalService.show(WelcomeModalComponent, {
      class: 'modal-dialog-centered',
    });
  }
}
