import { Component, NgZone, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { EnvService } from './shared/env.service';
import { IMIapiService } from './shared/imiapi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { SwUpdate } from '@angular/service-worker';
import { slideInAnimation } from '../animations/index';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { id } from 'date-fns/locale';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation],
})
export class AppComponent implements OnInit {
  title = 'selfcareportal';
  updateAvailable: boolean = false;
  message: string = '';
  stateName: string = '';
  disableAnimation: boolean = true;
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private spinner: NgxSpinnerService,
    public router: Router,
    public location: Location,
    public translate: TranslateService,
    private swUpdate: SwUpdate,
    private ngZone: NgZone
  ) {
    swUpdate.available.subscribe((event) => {
      this.updateAvailable = true;
      this.message = 'Update is available please wait.';
      //alert(this.message);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    });
    translate.addLangs(['EN', 'ID']);
    var lang = this.imiapi.getSelectedLanguage();
    this.imiapi.log('Lang (APP):' + lang);
    if (lang == null || lang == 'undefined' || lang == 'NA') {
      translate.setDefaultLang('ID');
      this.imiapi.setSessionValue('lang', 'ID');
    } else {
      translate.setDefaultLang(lang);
    }

    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.stateName = this.getState(event['url']);
        console.log(this.stateName);
        this.disableAnimation = this.imiapi.getOS() == 'BROWSER';
      }
    });

    // window['angularComponentReference'] = { component: this, zone: this.ngZone,
    //   loadAngularFunction: () => this.updatetoken(this), };
    //this.ngZone.runOutsideAngular()=>this.updatetoken

    //window['angularComponentReference']
  }
  ngOnInit() {  
  }
  
  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }

  showHeader(rurl: string) {
    if (
      rurl == '/' ||
      rurl.toLowerCase().startsWith('/login') ||
      rurl.toLowerCase().startsWith('/partnerlogin') ||
      rurl.toLowerCase().startsWith('/partnervalidateotp') ||
      rurl.toLowerCase().startsWith('/partnerdashboard') ||
      rurl.toLowerCase().startsWith('/partnerterms&conditions') ||
      rurl.toLowerCase().startsWith('/he') ||
      rurl.toLowerCase().startsWith('/updateprofile') ||
      rurl.toLowerCase().startsWith('/validateotp') ||
      rurl.toLowerCase().startsWith('/topup') ||
      rurl.toLowerCase().startsWith('/transdetails') ||
      rurl.toLowerCase().startsWith('/inbox') ||
      rurl.toLowerCase().startsWith('/viewmessage') ||
      rurl.toLowerCase().startsWith('/managenumber') ||
      rurl.toLowerCase().startsWith('/addnumber') ||
      rurl.toLowerCase().startsWith('/managevalidateotp') ||
      rurl.toLowerCase().startsWith('/voucher') ||
      rurl.toLowerCase().startsWith('/packagesearch') ||
      rurl.toLowerCase().startsWith('/paybill') ||
      rurl.toLowerCase().startsWith('/paymentfeedback') ||
      rurl.toLowerCase().startsWith('/failed') ||
      rurl.toLowerCase().startsWith('/sucess') ||
      rurl.toLowerCase().startsWith('/ocwlogin')||
      rurl.toLowerCase().startsWith('/sso')||
      rurl.toLowerCase().startsWith('/webpkg')
    ) {
      return false;
    }
    return true;
  }
  private getState(url: string): string {
    if (url.trim().length > 0)
      url = url.indexOf('/') > 0 ? url.split('/')[0] : url.split('/')[1];
    if (url.trim().length == 0) url = 'login';
    return url.toLowerCase().trim();
  }
}
