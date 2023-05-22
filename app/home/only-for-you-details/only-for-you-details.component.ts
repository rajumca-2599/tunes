import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';

@Component({
  selector: 'app-only-for-you-details',
  templateUrl: './only-for-you-details.component.html',
  styleUrls: ['./only-for-you-details.component.css']
})
export class OnlyForYouDetailsComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public imiapi: IMIapiService,
    public env: EnvService,
    private apidata: ApidataService
  ) {}
  packageList: any = "";
  selectedlanguage = 'ID';
  helpurl: string = '';
  showTransactions: boolean = false;
  ngOnInit(): void {
    this.helpurl = this.imiapi.getglobalsettings();
    this.navigateToTop();
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.setFooter();
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
  setFooter() {
    this.apidata.footerstateName.next('home');
    this.imiapi.setStorageValue('footerstateName', 'home');
  }
  getPakageList() {
    this.spinner.show();
    this.imiapi.postData('v1/offer/getlist',{}).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.status != null) {
          this.showTransactions=true;
          if (response.data.commercialPackages != null) {
            this.packageList = response.data;
            this.packageList.commercialPackages.forEach((element) => {
              element.traiffdisplay = element.tariff_display.replace(
                'Rp',
                ''
              );
            });
          } else {
            //$('#myModal3').modal('show');
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
    this.imiapi.setSession('commerical_package', item);
    this.imiapi.setSession('navigationfrom', 'onlyforyou');
    this.router.navigate(['/viewpackage']);
  }
  gotoprevious() {
    this.apidata.footerstateName.next('home');
    this.imiapi.setStorageValue('footerstateName', 'home');
    
    this.router.navigate(['/home']);
  }
  openNewtab() {
    window.open(this.helpurl);
  }

}
