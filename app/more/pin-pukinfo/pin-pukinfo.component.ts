import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';

@Component({
  selector: 'app-pin-pukinfo',
  templateUrl: './pin-pukinfo.component.html',
  styleUrls: ['./pin-pukinfo.component.css'],
})
export class PinPukinfoComponent implements OnInit {
  helpurl = '';
  pinResp:any="";
  constructor(
    private imiapi: IMIapiService,
    public env: EnvService,
    private http: HttpClient,
    private router: Router,
    private spinner:NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.helpurl = this.imiapi.getglobalsettings();
    this.getPinInfo();
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  goback() {
    this.router.navigate(['/more']);
  }
  getPinInfo() {
    this.spinner.show();
    this.imiapi.postData('v1/customerprofile/getpuk', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.status = '0' && response.data != null) {
          this.pinResp = response.data;
          return;
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
}
