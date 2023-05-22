import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchPipe } from 'src/app/shared/directives/search.pipe';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SharedService } from 'src/app/shared/SharedService';

@Component({
  selector: 'app-coverage-search',
  templateUrl: './coverage-search.component.html',
  styleUrls: ['./coverage-search.component.css'],
  providers: [SearchPipe],
})
export class CoverageSearchComponent implements OnInit {
  constructor(
    private router: Router,
    private imiapi: IMIapiService,
    public env: EnvService,
    private spinner: NgxSpinnerService,
    private sharedService: SharedService,
    private search: SearchPipe
  ) {}
  helpurl = '';
  coverageResp: any = '';

  showemptydiv = false;
  show: boolean = false;
  searchterm = '';
  txtsearch: string = '';
  showemptyDataDiv: boolean = false;

  ngOnInit(): void {
    this.helpurl = this.imiapi.getglobalsettings();
    this.get4gCoverage();
  }
  goback() {
    this.router.navigate(['/4greadiness']);
  }
  openNewtab() {
    window.open(this.helpurl);
  }

  get4gCoverage() {
    let data = this.imiapi.getSession('get4gCoverage');
    if (data != '' && data.length > 0 && data != 'NA') {
      this.coverageResp = JSON.parse(data);
    } else {
      this.spinner.show();
      this.show = true;
      this.imiapi.postData('v1/coverage/get4g', {}).subscribe(
        (response: any) => {
          this.spinner.hide();
          if ((response.status = '0' && response.data != null)) {
            this.coverageResp = response.data;
            this.imiapi.setSession('get4gCoverage', this.coverageResp);
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }
  isSelected(event: any) {
    this.showemptydiv = false;
    this.searchterm = event.target.value;
    document.getElementById('txtlocationsearch').blur();
  }
  showMap(data: any) {
    this.sharedService.setOption('coveragedata', data);
    this.router.navigate(['/coverage']);
  }
  searchCoverageData(data: any) {
    let Coveragedata = this.imiapi.getSession('get4gCoverage');
    if (Coveragedata != '' && Coveragedata.length > 0 && Coveragedata != 'NA') {
      this.coverageResp = JSON.parse(Coveragedata);
    }
    this.coverageResp = this.search.transform(
      this.coverageResp,
      'city,code',
      data
    );
    if (this.coverageResp.length <= 0) {
      this.showemptyDataDiv = true;
      this.searchterm = data;
    } else {
      this.showemptyDataDiv = false;
    }
  }
}
