import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SharedService } from 'src/app/shared/SharedService';
import * as moment from 'moment';
@Component({
  selector: 'app-billing-details',
  templateUrl: './billing-details.component.html',
  styleUrls: ['./billing-details.component.css']
})
export class BillingDetailsComponent implements OnInit {
  public transdetails: any = {};
  discountpercentage: any = 0;
  totalprice: any = 0;
  helpurl:string="";
  constructor(private sharedService: SharedService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public env: EnvService,
    private imiapi: IMIapiService,
    private apidata: ApidataService) { }

    ngOnInit(): void {
      this.helpurl = this.imiapi.getglobalsettings();
      this.spinner.hide();
      this.helpurl = this.imiapi.getglobalsettings();
      var _transdata = this.sharedService.getOption();
      if (_transdata && _transdata['details']) {
        this.transdetails = _transdata['details'];
        this.transdetails.formateddate=this.formatdate(this.transdetails.duedate);
      }
    }
    downloadStatement() {
      window.open(this.transdetails.downloadbill);
    }
    openNewtab() {
      window.open(this.helpurl);
    }

    formatdate(date): string {
      var dateParts = date.split('/');
      let formatdate = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
      return moment(formatdate).format('MMMM DD, yyyy');
    }

}
