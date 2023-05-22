import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
declare var $: any;

@Component({
  selector: 'app-coverage-feedback',
  templateUrl: './coverage-feedback.component.html',
  styleUrls: ['./coverage-feedback.component.css'],
})
export class CoverageFeedbackComponent implements OnInit {
  helpurl = '';
  txtopnion: string = '';
  feedback = '';
  deletemessage = '';
  userlocation = '';
  currentDate = new Date();
  description="";
  googleMapUrl="";
  constructor(
    private router: Router,
    private imiapi: IMIapiService,
    public env: EnvService,
    private spinner: NgxSpinnerService,
    private apidata: ApidataService
  ) {}

  ngOnInit(): void {
    this.helpurl = this.imiapi.getglobalsettings();
    let location = this.imiapi.getSession('coverage_location');
    if (location != undefined && location != '' && location != 'NA') {
      this.userlocation = JSON.parse(location);
    }
    this.assignFeedback();
    this.description = "4GPlus im3 Ooredoo is incredibly fast! Browsing is much more fun with this reliable network. How’s yours? Share it from myIM3";
  this.googleMapUrl="http://bit.ly/myim3";
  }
  gotoHome() {
    this.imiapi.setStorageValue('footerstateName', 'home');
    this.apidata.footerstateName.next('home');

    this.router.navigate(['/home']);
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  gotoReadinessCoverage() {
    this.imiapi.setStorageValue('footerstateName', 'more');
    this.apidata.footerstateName.next('more');
    this.router.navigate(['/coverage']);
  }
  assignFeedback() {
    var obj = { comment: this.txtopnion, feedback: 'excellent', code: '' };
    this.spinner.show();
    this.imiapi.postData('v1/coverage/feedback', obj).subscribe(
      (response: any) => {
        this.spinner.hide();
        if ((response.status = '0' && response.data != null)) {
          this.deletemessage = response.message;
          $('#feedbacksucess').modal('show');
          const cValue = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
          this.imiapi.setSession('feedbackdate', cValue);
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  closeModal() {
    $('#feedbacksucess').modal('hide');
  }
}
