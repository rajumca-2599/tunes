import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ApidataService } from '../apidata.service';
import { EnvService } from '../env.service';
import { IMIapiService } from '../imiapi.service';

@Component({
  selector: 'app-header-primarylines',
  templateUrl: './header-primarylines.component.html',
  styleUrls: ['./header-primarylines.component.css'],
})
export class HeaderPrimarylinesComponent implements OnInit {
  modalRef: BsModalRef;
  selectedlanguage = 'ID';
  data: any[] = [];
  childnumber: string = '';
  enablemanagenumber: boolean = false;
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private apidata: ApidataService
  ) {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
  }

  ngOnInit(): void {
    let childno = this.imiapi.getSession('childno');
    if (childno != '' && childno != undefined && childno != 'NA') {
      this.childnumber = this.imiapi.formatMobileNo(JSON.parse(childno));
    } else {
      this.childnumber = this.imiapi.getMSISDN();
    }
    this.enablemanagenumber = this.imiapi.getEnableManageNumber();
    this.displayNumbers();
  }
  displayNumbers() {
    if (
      this.imiapi.getSession('primarylines') != '' &&
      this.imiapi.getSession('primarylines') != 'NA' &&
      this.imiapi.getSession('primarylines') != undefined
    ) {
      this.data = JSON.parse(this.imiapi.getSession('primarylines'));
    } else {
      this.imiapi.postData('v1/primary/lines', {}).subscribe(
        (response: any) => {
          if (response.status != null && response.data != undefined) {
            if (response.status == '0') {
              this.data = response.data.lines;
              this.data.forEach((element) => {
                element.msisdn = this.imiapi.formatMobileNo(element.msisdn);
                if (element.name == '') {
                  if (this.selectedlanguage == 'ID') element.name = "No account name";
                  else if (this.selectedlanguage == 'EN') element.name = "Belum ada nama";
                }
              });
              this.imiapi.setSession('primarylines', this.data);
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
          this.imiapi.setStorageValue('footerstateName', 'home');
          this.apidata.footerstateName.next('home');
          
          this.router.navigate(['/home']);
          if (response.status == '0') {
            response.data.msisdn = this.imiapi.formatMobileNo(
              response.data.msisdn
            );
            this.imiapi.setSession('oauth', response.data);
            window.location.reload();
          }
        } catch (e) {
          console.log(e);
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
}
