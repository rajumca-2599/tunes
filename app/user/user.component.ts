import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IMIapiService } from '../shared/imiapi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { EnvService } from 'src/app/shared/env.service';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ApidataService } from '../shared/apidata.service';
declare var $: any;
import * as moment from 'moment';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  public userinfo: any;
  public msg: string = '';
  public minDate: Date;
  public maxDate: Date;
  selectedlanguage = 'ID';
  bsConfig: Partial<BsDatepickerConfig>;
  days: number;
  showReferal: boolean = false;
  redemMsg = '';
  usernameerror:string="";
  constructor(
    private router: Router,
    private imiapi: IMIapiService,
    private spinner: NgxSpinnerService,
    public env: EnvService,
    public translate: TranslateService,
    private apidata: ApidataService,
    private cd: ChangeDetectorRef
  ) {
    this.userinfo = {
      name: '',
      email: '',
      dob: '',
      referralcode: '',
    };
    this.msg = '';

    let min = new Date();
    let max = new Date();
    let minYr = env.dob_min_year; // min.getFullYear() - env.dob_min_year;
    min.setFullYear(minYr);
    min.setMonth(0);
    min.setDate(-1);

    let maxYr = max.getFullYear() - env.dob_max_year;
    max.setFullYear(maxYr);
    max.setMonth(max.getMonth());
    max.setDate(max.getDate() - 1);

    this.minDate = min;
    this.maxDate = max;
    console.log(this.maxDate);
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
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    let createdon = this.imiapi.getCreatedOn();
    this.calculateDiff(createdon);
    this.enableReferal();
  }
  gotoHome(): void {
    
    this.router.navigate(['/home']);
  }
  updateProfile() {
    this.msg = '';
    if (this.userinfo.dob != undefined && this.userinfo.dob != '') {
      let dob = formatDate(
        this.userinfo.dob,
        ' MM/dd/yyyy 00:00:00',
        'en-US',
        ''
      );
      this.userinfo.dob = dob;
    }
    if (this.userinfo.name != '' && this.userinfo.name != undefined) {
      const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      if (specialCharacters.test(this.userinfo.name)) {
        this.usernameerror =
          this.imiapi.getSelectedLanguage() == 'EN'
            ? 'Special Characters are not allowed'
            : 'Karakter spesial tidak diperbolehkan';
        return;
      }
      const seperator = /[0-9!"£$%^&*()_+-=]/;
      let result = seperator.test(this.userinfo.name);
      if (result) {
        this.usernameerror =
          this.imiapi.getSelectedLanguage() == 'EN'
            ? 'Only letters and spaces allowed'
            : 'Hanya diperbolehkan huruf dan spasi';
        return;
      }
    }

    this.userinfo.referralcode = this.userinfo.referalcode;    
    this.spinner.show();
    this.imiapi.postData('v1/profile/update', this.userinfo).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.status != null && response.status == '0') {         
          this.getCustomerProfile();          
          this.redemMsg = response.data.mgmoffer;         
          return;
        } else {
          this.msg = response.message;
        }
      },
      (error) => {
        console.log(error);
        this.msg =
          'Sorry, we could not process your request. Please try later.';
        this.spinner.hide();
      }
    );
  }

  getCustomerProfile() {
    this.spinner.show();
    this.imiapi.postData('v1/profile/get', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        try {
          if (response.status == '0') {
            response.data.msisdn = this.imiapi.formatMobileNo(
              response.data.msisdn
            );
            this.imiapi.setSession('oauth', response.data);
            this.imiapi.getglobalsettings();
            this.calculateDiff(response.data.createdon);            
          }
        } catch (e) {
          console.log(e);
        }
        if (this.userinfo.referalcode == '' || this.userinfo.referalcode== undefined) {
       
        this.router.navigate(['/home']);
        }
        else  if (this.userinfo.referalcode != '' && this.userinfo.referalcode!= undefined) {
          $('#popup001').modal('show');
        }
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
        
        this.router.navigate(['/home']);
      }
    );
  }

  switchLang(id: string) {
    if (navigator.onLine) {
      this.selectedlanguage = id;
      this.imiapi.setSessionValue('lang', id);
      this.translate.use(id);
    }
  }
  calculateDiff(data) {
    console.log('In calculateDiff' + data);
    let ddMMyy = moment(data, 'YYYYMMDD');
    let datedot = ddMMyy.format('yyyy/MM/DD');
    var expirydate: any = new Date(datedot);
    var currentdate: any = new Date();
    console.log('datedot:' + datedot);
    console.log('Exipry Date:' + expirydate);
    console.log('Current Date:' + currentdate);
    this.days = Math.floor(
      (currentdate.getTime() - expirydate.getTime()) / 1000 / 60 / 60 / 24
    );
  }
  enableReferal() {
    this.showReferal = this.imiapi.getReferal();
    console.log(this.showReferal);
  }
  navigateToAccount() {
    this.getDashboard();
  }
  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  getDashboard() {
    //this.imiapi.removeStorage('dashboard');
    this.imiapi.postData('v1/dashboard/get/v2', {}).subscribe(
      (response: any) => {
        if (response.status != null && response.data != undefined) {
          if (response.status == '0') {
            try {
              this.imiapi.setStorage('dashboard', response.data);
              this.router.navigate(['/myaccount']);
             // window.location.reload();
             setTimeout(() => {
              window.location.reload();
          }, 1);
            } catch (error) {
              console.log(error);
            }
          } 
        }
      },
      (error) => {
        console.log(error);
      }
    );
    }
  }

