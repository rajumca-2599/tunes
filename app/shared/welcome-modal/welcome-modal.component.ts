import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { EnvService } from '../env.service';
import { IMIapiService } from '../imiapi.service';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApidataService } from '../apidata.service';
declare var $: any;
@Component({
  selector: 'app-welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.css'],
})
export class WelcomeModalComponent implements OnInit, OnDestroy {
  public redirecthtml: any;
  notificationList;
  public stateName: string = 'Home';
  previousUrl = '';
  enablemodal: any = false;
  public anchors;
  constructor(
    private imiapi: IMIapiService,
    private env: EnvService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private zone: NgZone,
    private modalService: BsModalRef,
    private apidata:ApidataService
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.stateName = this.imiapi.getState(event['url']);
      }
    });
  }

  ngOnInit(): void {
  //  alert('In WelcomeModal');
    console.log('In welcome modal');
    let isSSO = this.imiapi.getSession('displaywelcomemodal');
    console.log('isSSO :' + isSSO);
    this.previousUrl = this.imiapi.getSession('refererurl');
    if (
      this.previousUrl != '' &&
      this.previousUrl != undefined &&
      this.previousUrl != 'NA'
    )
      this.previousUrl = JSON.parse(this.previousUrl);
    else if (this.previousUrl == 'NA') this.previousUrl = '';
    console.log(this.previousUrl);
   // alert(this.previousUrl);
    // if (isSSO != undefined && isSSO != 'NA' && isSSO != '')
    //   isSSO = JSON.parse(isSSO);
    // if (isSSO)
    this.getRedirectNotification();

    this.zone.runOutsideAngular(() => {
      window['redirect'] = this.redirectToWebsite.bind(this);
      window['expolrepwa'] = this.onredirectModalClose.bind(this);
    });
  }

  getRedirectNotification() {
    let getTemplateParam = this.env.getTemplateParam;
    this.imiapi
      .postData('v1/template/get?type=' + getTemplateParam + '', {})
      .subscribe(
        (response: any) => {
          console.log(response.code);
          if (response.code == '10002' || response.code == '11111') {
            this.imiapi.clearSession();
            this.router.navigate(['/login']);
            this.enablemodal = false;
            this.modalService.hide();
          }
          if (response != undefined && response != '' && response != null) {
            this.enablemodal = true;
            this.redirecthtml = response; // bind html
            $('#divredirectModal').modal('show'); //showing redirect popup
          }
        },
        (error) => {
          console.log('getRedirectNotification', { error });
        }
      );
  }
  onredirectModalClose() {
    this.enablemodal = false;
    this.modalService.hide();
    // this.imiapi.removeSession('displaywelcomemodal');
    //   $('#divredirectModal').modal('hide');
    console.log('onredirectModalClose clicked');
    // calling api trans logs once redirect popup closed
    try {
      let stateName = this.imiapi.getSession('pwa_url');
      if (stateName != undefined && stateName != 'NA' && stateName != '')
        this.stateName = JSON.parse(stateName);
      console.log(this.stateName);
      let postlog = {
        event_name: 'Welcome Popup',
        event_attributes: {
          screen_name: this.stateName,
          title: 'Continue/Explore Clicked',
        },
      };
      this.imiapi.postData('v1/userjourney/addlog', postlog).subscribe(
        (response: any) => {
          if (
            response.status == null ||
            response.status != '0' ||
            response.code != '26000'
          ) {
            this.imiapi.log('addlog:' + response);
          }
        //this.navigateToHome();
        },
        (error) => {
          this.imiapi.log('addlog:' + error);
         // this.navigateToHome();
        }
      );
    } catch (error) {
      this.imiapi.log('addlog:' + error);
      //this.navigateToHome();
    }
  }
  // navigateToHome() {
  //     this.imiapi.setStorageValue('footerstateName', 'home');
  //     this.apidata.footerstateName.next('home');
  //     this.router.navigate(['/home']);
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 1);
  //   }
  redirectToWebsite() {
    this.enablemodal = false;
    this.modalService.hide();
    // this.imiapi.setSession('displaywelcomemodal', false);
    //  $('#divredirectModal').modal('hide');
    // calling api trans logs
    console.log('redirectToWebsite clicked');
    // calling api trans logs once redirect popup closed
    try {
      let stateName = this.imiapi.getSession('pwa_url');
      if (stateName != undefined && stateName != 'NA' && stateName != '')
        this.stateName = JSON.parse(stateName);

      console.log(this.stateName);
      let postlog = {
        event_name: 'Redirect To WEBIO',
        event_attributes: {
          screen_name: this.stateName,
          title: 'Indosat Redirect',
        },
      };
      this.imiapi.postData('v1/userjourney/addlog', postlog).subscribe(
        (response: any) => {
          if (
            response.status != null &&
            response.status == '0' &&
            response.code == '26000'
          ) {
            if (this.previousUrl == '') location.href = this.env.hdr_back_url;
            else {
              this.redirectToBack();
            }
            // this.previousUrl == '' ? this.env.hdr_back_url : this.previousUrl;
          } else {
            this.imiapi.log('addlog:' + response);
            if (this.previousUrl == '') location.href = this.env.hdr_back_url;
            else {
              this.redirectToBack();
            }
            // location.href =
            //   this.previousUrl == '' ? this.env.hdr_back_url : this.previousUrl;
          }
        },
        (error) => {
          this.imiapi.log('addlog:' + error);
          if (this.previousUrl == '') location.href = this.env.hdr_back_url;
          else {
            this.redirectToBack();
          }
          // location.href =
          //   this.previousUrl == '' ? this.env.hdr_back_url : this.previousUrl;
        }
      );
    } catch (error) {
      this.imiapi.log('addlog:' + error);
      if (this.previousUrl == '') location.href = this.env.hdr_back_url;
      else {
        this.redirectToBack();
      }

      // location.href =
      //   this.previousUrl == '' ? this.env.hdr_back_url : this.previousUrl;
    }
  }
  ngOnDestroy() {
    window['redirect'] = null;
    window['expolrepwa'] = null;
  }
  redirectToBack() {
    console.log('In redirectToBack');
    let tokenId = this.imiapi.getSession('token');
    console.log(tokenId);
    console.log(this.previousUrl);
    if (tokenId != 'NA' && tokenId != undefined && tokenId != '') {
      try {
        let _webtoken = this.imiapi.getSession('webtoken');
        // let _url =
        //   this.previousUrl +
        //   this.imiapi.RC4EncryptDecrypt(data) +
        //   '/' +
        //   this.imiapi.RC4EncryptDecrypt(_webtoken + '|' + tokenId);
        let _url =this.previousUrl;         
        console.log(_url);
        //alert(_url);
        location.href = _url;
      } catch (e) {
        console.log(e);
      }
    }
  }
}
