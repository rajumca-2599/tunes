import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SocialAuthService } from 'angularx-social-login';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
} from 'angularx-social-login';
declare var $: any;
import { IfStmt } from '@angular/compiler';
import { debug } from 'console';
import { ApidataService } from 'src/app/shared/apidata.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
})
export class UserprofileComponent implements OnInit, OnDestroy {
  userinfo: any = '';
  public minDate: Date;
  public maxDate: Date;
  msg = '';
  bsConfig: Partial<BsDatepickerConfig>;
  userimage = '';
  userProfile: any = {};
  accountype: string = '';
  msisdn = '';
  helpurl = '';
  msgheader = '';
  deletemessage = '';
  userdetailsModified: boolean = false;
  text = '';
  constructor(
    private router: Router,
    public env: EnvService,
    private spinner: NgxSpinnerService,
    private imiapi: IMIapiService,
    private authService: SocialAuthService,
    private apidata: ApidataService
  ) {
    this.userinfo = {
      name: '',
      email: '',
      dob: '',
      refcode: '12345',
    };
    this.msg = '';

    let min = new Date();
    let max = new Date();
    let minYr = env.dob_min_year; // min.getFullYear() - env.dob_min_year;
    min.setFullYear(minYr);
    min.setMonth(0);
    min.setDate(1);

    let maxYr = max.getFullYear() - env.dob_max_year;
    max.setFullYear(maxYr);
    max.setMonth(max.getMonth());
    max.setDate(max.getDate());

    this.minDate = min;
    this.maxDate = max;

    this.bsConfig = Object.assign(
      {},
      {
        containerClass: 'theme-default',
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        showWeekNumbers: false,
      }
    );
  }

  ngOnInit(): void {
    this.setFooter();
    // this.getCustomerImage();
    this.msisdn = this.imiapi.getMSISDN();
    this.accountype = this.imiapi.getSubstype().toUpperCase();
    this.helpurl = this.imiapi.getglobalsettings();
    let useredited = this.imiapi.getSession('userupdated');
    if (useredited != 'NA' && useredited != '' && useredited != undefined)
      this.userdetailsModified = JSON.parse(useredited);
    if (this.userdetailsModified) {
      if (this.imiapi.getSelectedLanguage() == 'EN') {
        this.msgheader = 'PROFILE SUCCESSFULLY CHANGED 👌';
        this.deletemessage = 'You successfully change your profile information';
      } else {
        this.msgheader = 'PROFIL BERHASIL DIUBAH 👌';
        this.deletemessage = 'Informasi profil kamu berhasil diubah';
      }
      $('#deletesucess').modal('show');
    }
    this.getProfile();
    this.getProfileImage();
  }
  getProfile() {
    this.spinner.show();
    this.imiapi.postData('v1/profile/get', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        if ((response.status = '0' && response.data != null)) {
          this.userinfo = response.data;
          if (this.userdetailsModified) {
            this.imiapi.setSession('oauth', this.userinfo);
            window.location.reload;
            $('#deletesucess').modal('show');
            this.userdetailsModified = false;
          }
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  // getCustomerImage() {
  //   this.userimage = this.env.cdnurl + 'assets/images/img-prifile.jpg';
  //   this.userProfile = this.imiapi.getUserProfile();
  //   if (
  //     !(
  //       this.userProfile == null ||
  //       this.userProfile == 'undefined' ||
  //       this.userProfile == 'NA'
  //     )
  //   )
  //     //this.userimage = this.userProfile.imagelocation;
  // }
  goback() {
    this.router.navigate(['/more']);
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  navigateToEditProfile() {
    this.router.navigate(['/editprofile']);
  }
  connectWithSocialAccount(data: any) {
    let socialPlatformProvider;
    if (data === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (data === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    console.log(data);
    this.authService.signIn(socialPlatformProvider).then((socialusers) => {
      console.log('Inside authservice');
      console.log(socialusers);
      this.Savesresponse(socialusers, data);
    });
  }
  Savesresponse(socialusers: any, logintype: any) {
    console.log(socialusers);
    var obj = { socialtype: logintype, socialid: socialusers.id };
    this.spinner.show();
    this.imiapi.postData('v1/profile/connect', obj).subscribe(
      (response: any) => {
        this.spinner.hide();
        if ((response.status = '0' && response.data != null)) {
          if (this.imiapi.getSelectedLanguage() == 'EN') {
            this.msgheader = 'ACCOUNT SUCCESSFULLY LINKED 👌';
            this.deletemessage =
              logintype == 'google'
                ? 'our account successfully linked to Google'
                : 'Your account successfully linked to Facebook';
          } else {
            this.msgheader = 'AKUN BERHASIL DIHUBUNGKAN 👌';
            this.deletemessage =
              logintype == 'google'
                ? 'Akun kamu berhasil duhubungkan dengan Google'
                : 'Akun kamu berhasil duhubungkan dengan Facebook';
          }
          $('#deletesucess').modal('show');
          this.getProfile();
        } else {
          this.msgheader = '';
          this.deletemessage = response.message;
          $('#deletesucess').modal('show');
          return;
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  disconnectWithSocialAccount(data: any) {
    this.authService.signOut();
    var obj = { socialtype: data };
    this.spinner.show();
    this.imiapi.postData('v1/profile/disconnect', obj).subscribe(
      (response: any) => {
        this.spinner.hide();
        if ((response.status = '0')) {
          if (this.imiapi.getSelectedLanguage() == 'EN') {
            this.msgheader = 'ACCOUNT SUCCESSFULLY DISCONNECTED';
            this.deletemessage =
              data == 'google'
                ? 'Your account is not linked to Google account'
                : 'Your account is not linked to Facebook account';
          } else {
            this.msgheader = 'AKUN BERHASIL DIPUTUSKAN';
            this.deletemessage =
              data == 'google'
                ? 'Akun kamu berhasil diputuskan dengan Google'
                : 'Akun kamu berhasil diputuskan dengan Facebook';
          }
          $('#deletesucess').modal('show');
          this.getProfile();
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  openPopUp() {
    $('#emailverify').modal('show');
    if (this.imiapi.getSelectedLanguage() == 'EN')
      this.text =
        'We’ve sent verification ' +
        this.userProfile.email +
        ' Please confirm it by clicking the button provided inside the email';
    else
      this.text =
        'Email verifikasi sudah dikirim ke ' +
        this.userProfile.email +
        ' Lakukan konfirmasi dengan menekan tombol di dalam email';
  }
  verifyEmail() {
    var obj = { email: this.userinfo.emailid };
    this.spinner.show();
    this.imiapi.postData('v1/profile/verifyemail;', obj).subscribe(
      (response: any) => {
        this.spinner.hide();
        if ((response.status = '0' && response.data != null)) {
          this.getProfile();
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  closeModal() {
    $('#deletesucess').modal('hide');
  }
  ngOnDestroy() {
    this.imiapi.removeSession('userupdated');
  }
  setFooter() {
    this.apidata.footerstateName.next('more');
    this.imiapi.setStorageValue('footerstateName', 'more');
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
}
