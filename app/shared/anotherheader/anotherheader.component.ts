import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { EnvService } from '../env.service';
import { IMIapiService } from '../imiapi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { ApidataService } from '../apidata.service';

@Component({
  selector: 'app-anotherheader',
  templateUrl: './anotherheader.component.html',
  styleUrls: ['./anotherheader.component.css']
})
export class AnotherheaderComponent implements OnInit {

  @Input() public pgname: string;
  userimage = '';
  languagesList: any = [];
  selectedlanguage = 'ID';
  userProfile: any = {};
  showuserImage: boolean = true;
  helpurl = '';
  childnumber: string = '';
  data: any[] = [];
  parentdata: any[] = [];
  isShowPrimaryLinesDiv: boolean = false;
  enablemanagenumber: boolean = false;
  stateName: string = '';
  previousUrl = '';
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private apidata: ApidataService,
    private cd: ChangeDetectorRef,
    private activeRoute: ActivatedRoute
  ) {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.stateName = this.imiapi.getState(event['url']);
      }
    });
  }

  ngOnInit(): void {
    this.enablemanagenumber = this.imiapi.getEnableManageNumber();
    this.manageNumber();
    this.helpurl = this.imiapi.getglobalsettings();
    this.getProfileImage();
    this.previousUrl = this.imiapi.getSession('refererurl');
    if (
      this.previousUrl != '' &&
      this.previousUrl != undefined &&
      this.previousUrl != 'NA'
    )
      this.previousUrl = JSON.parse(this.previousUrl);
    else if (this.previousUrl == 'NA') this.previousUrl = '';
    console.log(this.previousUrl);
  }
  ngAfterContentChecked() {
    this.cd.detectChanges();
    // this.getCustomerImage();
    //this.getProfileImage();
  }
  // getCustomerImage() {
  //   let data = this.imiapi.getSession('primarylines');
  //   if (data != undefined && data != null && data != 'NA') {
  //     data = JSON.parse(data);
  //     if (data.length == 1) {
  //       this.showuserImage = true;
  //     } else this.showImage();
  //   } else {
  //     this.showImage();
  //   }
  // }
  showImage() {
    this.showuserImage = false;
    this.userimage = this.env.cdnurl + 'assets/images/img-prifile.jpg';
    this.userProfile = this.imiapi.getUserProfile();
    if (
      !(
        this.userProfile == null ||
        this.userProfile == 'undefined' ||
        this.userProfile == 'NA'
      )
    )
      this.userimage = this.userProfile.imagelocation;
  }
  switchLang(id: string) {
    if (navigator.onLine) {
      this.selectedlanguage = this.selectedlanguage == 'EN' ? 'ID' : 'EN';
      this.imiapi.setSessionValue('lang', id);
      this.imiapi.log('pgName:' + this.pgname);
      if (this.pgname.toLowerCase() == 'myaccount') {
        this.spinner.show();
        this.imiapi.postData('v1/dashboard/get/v2', {}).subscribe(
          (response: any) => {
            this.spinner.hide();
            if (response.code == '10002' || response.code == '11111') {
              this.imiapi.clearSession();
              this.router.navigate(['/login']);
            }
            if (response.status != null && response.data != undefined) {
              if (response.status == '0') {
                this.imiapi.removeStorage('dashboard');
                this.imiapi.setStorage('dashboard', response.data);
                window.location.reload();
              } else if (
                response.status == '10002' ||
                response.status == '11111'
              ) {
                this.imiapi.clearSession();
              }
            }
          },
          (error) => {
            this.spinner.hide();
            window.location.reload();
          }
        );
      } else {
        this.getCustomerProfile();
      }
    }
  }

  gotomessageInbox() {
    let stateName = this.imiapi.getStorage('footerstateName');
    if (stateName == '' || stateName == undefined) stateName = 'home';
    this.router.navigate(['/inbox/' + stateName]);
  }
  navigatetoSearch() {
    let stateName = this.imiapi.getStorage('footerstateName');
    if (stateName == '' || stateName == undefined) stateName = 'home';
    this.router.navigate(['/packagesearch/' + stateName]);
  }
  navigatetoManageno() {
    this.router.navigate(['/primarylines']);
  }
  navigatetoFavourite() {
    this.imiapi.setSession('recommendedtab', 'favourite');
    this.imiapi.setStorageValue('footerstateName', 'package');
    this.router.navigate(['/package']);
  }
  navigatetoManageNo() {
    this.router.navigate(['/managenumber']);
  }

  openNewtab() {
    if (
      this.helpurl == 'undefined' ||
      this.helpurl == 'NA' ||
      this.helpurl == ''
    )
      this.helpurl = this.imiapi.getglobalsettings();
    window.open(this.helpurl);
  }
  manageNumber() {
    let childno = this.imiapi.getSession('childno');
    if (childno != '' && childno != undefined && childno != 'NA') {
      this.childnumber = this.imiapi.formatMobileNo(JSON.parse(childno));
    } else {
      this.childnumber = this.imiapi.getMSISDN();
    }

    this.displayNumbers();
  }
  displayNumbers() {
    if (
      this.imiapi.getSession('primarylines') != '' &&
      this.imiapi.getSession('primarylines') != 'NA' &&
      this.imiapi.getSession('primarylines') != undefined
    ) {
      this.data = JSON.parse(this.imiapi.getSession('primarylines'));
      if (!this.enablemanagenumber) {
        let parentdata = this.imiapi.getSession('parentinfo');
        if (parentdata != '' && parentdata != 'NA') {
          this.parentdata = JSON.parse(parentdata);
        }
      }
      this.data.forEach((element) => {
        if (
          element.name == '' ||
          element.name == 'No account name' ||
          element.name == 'Belum ada nama'
        ) {
          element.name = this.imiapi.addDefaultName();
        }
      });
    } else {
      this.imiapi.postData('v1/primary/lines', {}).subscribe(
        (response: any) => {
          if (response.status != null && response.data != undefined) {
            if (response.status == '0') {
              this.data = response.data.lines;
              this.parentdata.push(response.data.parent);
              this.data.forEach((element) => {
                element.msisdn = this.imiapi.formatMobileNo(element.msisdn);
                if (element.name == '') {
                  if (this.selectedlanguage == 'ID')
                    element.name = 'No account name';
                  else if (this.selectedlanguage == 'EN')
                    element.name = 'Belum ada nama';
                }
              });
              this.imiapi.setSession('primarylines', this.data);
              this.imiapi.setSession('parentinfo', this.parentdata);
              //this.getCustomerImage();
              this.getProfileImage();
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  navigatetomanageno() {
    this.router.navigate(['/managenumber']);
  }
  addChildNumber(data: any) {
    let msisdn = this.imiapi.getValidMobileNumber(data.msisdn);
    this.imiapi.setSession('childno', msisdn);
    this.getCustomerProfile();
  }
  gotoHome() {
    this.imiapi.setStorageValue('footerstateName', 'home');
    this.apidata.footerstateName.next('home');
  
    this.router.navigate(['/home']);
  }
  getCustomerProfile() {
    this.spinner.show();
    this.imiapi.postData('v1/profile/get', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        try {
          let tabName =
            this.imiapi.getStorage('footerstateName') != ''
              ? this.imiapi.getStorage('footerstateName')
              : 'home';
          this.imiapi.setStorageValue('footerstateName', tabName);
          this.apidata.footerstateName.next(tabName);
          this.router.navigate(['/' + tabName]);
          if (response.status == '0') {
            response.data.msisdn = this.imiapi.formatMobileNo(
              response.data.msisdn
            );
            this.imiapi.setSession('oauth', response.data);
            window.location.reload();
          }
        } catch (e) {
          console.log(e);
          window.location.reload();
        }
      
        this.router.navigate(['/home']);
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
       
        this.router.navigate(['/home']);
      }
    );
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
  redirectToWebsite() {
    // calling api trans logs
    let stateName = this.imiapi.getSession('pwa_url');
      if (stateName != undefined && stateName != 'NA' && stateName != '')
        this.stateName = JSON.parse(stateName);
    try {
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
            else this.redirectToBack();
          } else {
            this.imiapi.log('addlog:' + response);
            if (this.previousUrl == '') location.href = this.env.hdr_back_url;
            else this.redirectToBack();
          }
        },
        (error) => {
          this.imiapi.log('addlog:' + error);
          if (this.previousUrl == '') location.href = this.env.hdr_back_url;
          else this.redirectToBack();
        }
      );
    } catch (error) {
      this.imiapi.log('addlog:' + error);
      if (this.previousUrl == '') location.href = this.env.hdr_back_url;
      else this.redirectToBack();
    }
  }
  redirectToBack() {
    console.log('In redirectToBack');
    let tokenId = this.imiapi.getSession('token');
    if (tokenId != 'NA' && tokenId != undefined && tokenId != '') {
      try {
        let _webtoken = this.imiapi.getSession('webtoken');
        // let _url =
        //   this.previousUrl +
        //   this.imiapi.RC4EncryptDecrypt(data) +
        //   '/' +
        //   this.imiapi.RC4EncryptDecrypt(_webtoken + '|' + tokenId);
        let _url =this.previousUrl;
        //alert(_url);
        console.log(_url);
        location.href = _url;
      } catch (e) {
        console.log(e);
      }
    }
  }

}
