import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SharedService } from 'src/app/shared/SharedService';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { AmountConverterPipe } from 'src/app/shared/directives/amount-converter.pipe';
@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.css'],
  providers: [DatePipe, AmountConverterPipe],
})
export class BillingHistoryComponent implements OnInit {
  transactions: any = [];
  selectedlanguage = 'ID';
  helpurl: string = '';
  showemptydiv = false;
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private router: Router,
    private translate: TranslateService,
    private modalService: BsModalService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private convertor: AmountConverterPipe
  ) {}

  ngOnInit(): void {
    this.helpurl = this.imiapi.getglobalsettings();
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.getbillhistory();
  }

  openNewtab() {
    window.open(this.helpurl);
  }
  getbillhistory(): void {
    this.spinner.show();
    this.imiapi.postData('v1/invoice/getlist', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (
          response.status &&
          response.status === '0' &&
          response.data &&
          response.data.invoiceslist &&
          response.data.invoiceslist.length > 0
        ) {
          this.transactions = response.data.invoiceslist;
          this.transactions.forEach((element) => {
            let amount = this.convertor.transformAmount(element.amount);
            if (typeof amount === 'string') {
              if (amount != '0' && amount != undefined) {
                if (amount.includes(',')) {
                  element.translateamount = amount.split(',')[0];
                  element.translateddecimal = '.' + amount.split(',')[1];
                } else {
                  element.translateamount = amount.split('.')[0];
                  element.translateddecimal = '.' + amount.split('.')[1];
                }
              } else {
                element.translateamount = amount;
              }
            } else {
              element.translateamount = 0;
            }
          });

          this.showemptydiv = false;
        } else {
          this.showemptydiv = true;
        }
      },
      (error) => {
       // console.log(error);
      }
    );
  }
  gotoback() {
    this.router.navigate(['/myaccount']);
  }
  formatdate(date): string {
    var dateParts = date.split('/');
    let formatdate = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
    return moment(formatdate).format('MMMM DD, yyyy');
  }
  navigatetotopup() {
    this.router.navigate(['/topup']);
  }
  downloadStatement(url) {
    window.open(url);
  }
  gotodetails(item): void {
    this.spinner.show();
    this.sharedService.setOption('details', item);
    this.router.navigate(['/billingdetails']);
  }
  navigatetopaybill() {
    this.router.navigate(['/paybill']);
  }
}
