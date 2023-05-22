import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { th } from 'date-fns/locale';
@Component({
  selector: 'app-readines',
  templateUrl: './readines.component.html',
  styleUrls: ['./readines.component.css'],
})
export class ReadinesComponent implements OnInit {
  readinesInfo: any = '';
  deviceInfo: any;
  helpurl: string = '';
  constructor(
    private router: Router,
    public env: EnvService,
    private spinner: NgxSpinnerService,
    private imiapi: IMIapiService
  ) {}

  ngOnInit(): void {
    this.deviceInfo = this.imiapi.getDeviceId();
    console.log(this.deviceInfo);
    this.getPinInfo();
    this.helpurl = this.imiapi.getglobalsettings();
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  goback() {
    this.router.navigate(['/more']);
  }
  getPinInfo() {
    var obj = { simType: 'USIM', deviceModel: this.deviceInfo };
    this.spinner.show();
    this.imiapi.postData('v1/device/get4g', obj).subscribe(
      (response: any) => {
        this.spinner.hide();
        if ((response.status = '0' && response.data != null)) {
          this.readinesInfo = response.data;
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  gotoCoverage() {
    this.router.navigate(['/coverage']);
  }
}
