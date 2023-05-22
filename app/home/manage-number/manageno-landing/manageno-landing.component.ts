import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { REPL_MODE_STRICT } from 'repl';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
declare var $: any;
import { HostListener } from '@angular/core';
import { PlatformLocation } from '@angular/common';
@Component({
  selector: 'app-manageno-landing',
  templateUrl: './manageno-landing.component.html',
  styleUrls: ['./manageno-landing.component.css'],
})
export class ManagenoLandingComponent implements OnInit, OnDestroy {
  data: any[] = [];
  parentdata: any[] = [];
  config: SwiperConfigInterface = {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: '.swiper-pagination1',
      clickable: true,
    },
  };
  selectedlanguage = 'ID';
  modalRef: BsModalRef;
  content: string;
  deletemsisdn: string = '';
  desc: string = '';
  helpurl: string = '';
  enablemanagenumber: boolean = false;
  childno: string = '';
  deletemessage: string = '';
  userimage: any;
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private modalService: BsModalService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private apidata: ApidataService,
    private platformLocation: PlatformLocation
  ) {
    platformLocation.onPopState(() => this.closeModal());
  }

  ngOnInit(): void {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.helpurl = this.imiapi.getglobalsettings();
    this.enablemanagenumber = this.imiapi.getEnableManageNumber();
    this.getdata();
  }
  getdata() {
    if (
      this.imiapi.getSession('primarylines') != '' &&
      this.imiapi.getSession('primarylines') != 'NA' &&
      this.imiapi.getSession('primarylines') != undefined
    ) {
      this.closeModal();
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
      this.spinner.show();
      this.imiapi.postData('v1/primary/lines', {}).subscribe(
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
              if (
                response.data != undefined &&
                response.data.lines != undefined
              ) {
                this.data = response.data.lines;
                this.parentdata.push(response.data.parent);
                this.data.forEach((element) => {
                  element.msisdn = this.imiapi.formatMobileNo(element.msisdn);
                  if (element.name == '')
                    element.name = this.imiapi.addDefaultName();
                });
                this.imiapi.setSession('primarylines', this.data);
                this.imiapi.setSession('parentinfo', this.parentdata);
                let childadded = this.imiapi.getSession('numberadded');
                if (
                  childadded != 'undefined' &&
                  childadded != 'NA' &&
                  childadded != ''
                ) {
                  this.childno = JSON.parse(this.imiapi.getSession('childno'));

                  $('#addsucess').modal('show');
                } else {
                  $('#deletepopup').modal('hide');
                  this.closeModal();
                }
                this.cd.detectChanges();
              }
            }
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }
  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  backtoHome() {
    let footer = this.imiapi.getStorage('footerstateName');
    this.imiapi.setStorageValue('footerstateName', footer);
    this.apidata.footerstateName.next(footer);
    this.router.navigate(['/' + footer]);
  }
  addnewnumber() {
    if (this.enablemanagenumber) this.router.navigate(['/addnumber']);
  }
  deleteNumber() {
    var requestobj = {
      childmsisdn: this.imiapi.getValidMobileNumber(this.deletemsisdn),
    };
    this.spinner.show();
    this.imiapi.postData('v1/primary/removeline', requestobj).subscribe(
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
            this.imiapi.removeSession('primarylines');
            // this.desc = response.message;
            if (this.selectedlanguage == 'EN')
              this.deletemessage =
                "you've remove " + this.deletemsisdn + ' from your account';
            else
              this.deletemessage =
                'Kamu menghapus ' + this.deletemsisdn + ' dari akunmu';
            $('#deletesucess').modal('show');
            this.getdata();
          }
        }
      },
      (error) => {
        //   console.log(error);
      }
    );
  }
  show(name, msisdn) {
    if (name == 'No account name' || name == 'Belum ada nama') name = '';
    this.deletemsisdn = msisdn;
    if (this.selectedlanguage == 'EN') {
      this.content =
        'Are you sure want to remove ' +
        name +
        ' ' +
        msisdn +
        ' from this account ?';
    } else {
      this.content =
        'Yakin ingin menghapus nomor ' + name + ' ' + msisdn + ' ?';
    }
    $('#deletepopup').modal('show');
  }
  addChildNumber(data: any) {
    this.imiapi.setSession('childno', data.msisdn);
    this.imiapi.setStorageValue('footerstateName', 'home');
    
    this.router.navigate(['/home']);
  }
  closeModal() {
    $('#deletesucess').modal('hide');
    $('#addsucess').modal('hide');
    $('#deletepopup').modal('hide');
    this.imiapi.removeSession('numberadded');
    this.imiapi.removeSession('childno');
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  ngOnDestroy() {
    $('#deletesucess').modal('hide');
    $('#addsucess').modal('hide');
    $('#deletepopup').modal('hide');
    this.imiapi.removeSession('numberadded');
    this.imiapi.removeSession('childno');
  }
  getProfileImage() {
    this.userimage = this.env.cdnurl + 'assets/images/nophoto.jpg';
    let profileImage = this.imiapi.getSession('userprofileimage');
    if (
      profileImage != 'undefined' &&
      profileImage != 'NA' &&
      profileImage != ''
    ) {
      this.userimage =JSON.parse(profileImage);
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
