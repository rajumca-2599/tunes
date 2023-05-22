import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';

@Component({
  selector: 'app-coverage-badfeedback',
  templateUrl: './coverage-badfeedback.component.html',
  styleUrls: ['./coverage-badfeedback.component.css'],
})
export class CoverageBadfeedbackComponent implements OnInit {
  helpurl = '';
  txtopnion: string = '';
  feedback = '';
  show = false;
  userlocation = '';
  currentDate=new Date();
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
  }
  gotoReadinessCoverage() {
    this.imiapi.setStorageValue('footerstateName', 'more');
    this.apidata.footerstateName.next('more');
    this.router.navigate(['/coverage']);
  }

  gotoHome() {
    this.imiapi.setStorageValue('footerstateName', 'home');
    this.apidata.footerstateName.next('home');
   
    this.router.navigate(['/home']);
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  assignFeedback() {
    var obj = { comment: this.txtopnion, feedback: 'bad', code: '' };
    this.spinner.show();
    this.imiapi.postData('v1/coverage/feedback', obj).subscribe(
      (response: any) => {
        this.spinner.hide();
        if ((response.status = '0' && response.data != null)) {
          this.show = true;
          const cValue = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
          this.imiapi.setSession('feedbackdate', cValue);
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
}
