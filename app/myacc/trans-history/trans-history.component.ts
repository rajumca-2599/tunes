import { Component, OnDestroy, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { IMIapiService } from '../../shared/imiapi.service';
import { EnvService } from '../../shared/env.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/SharedService';
import { datepickerAnimation } from 'ngx-bootstrap/datepicker/datepicker-animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { AmountConverterPipe } from 'src/app/shared/directives/amount-converter.pipe';

@Component({
  selector: 'app-trans-history',
  templateUrl: './trans-history.component.html',
  styleUrls: ['./trans-history.component.css'],
  providers: [AmountConverterPipe],
})
export class TransHistoryComponent implements OnInit {
  transactions: any = [];
  selectedlanguage = 'ID';
  totalfilters = 0;
  recordcounts: { total: 0; filtered: 0 };
  recordstodisplay = 10;
  transStatusList: any = this.env.transStatusList;
  transCategoryList: any = this.env.transCategoryList;
  searchfilter: {
    fromdate: string;
    todate: string;
    pagination: { start: number; end: number };
    category: string;
    status: string;
  };

  translastndays = this.env.transLastNdays;

  filterdates: { from: Date; to: Date };

  public minDate: Date;
  public maxDate: Date;
  bsConfig: Partial<BsDatepickerConfig>;

  pagination: { start: 1; pagesize: 15 };
  helpurl: string = '';
  showemptydiv = false;
  hidereset: boolean = false;
 
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private router: Router,
    private translate: TranslateService,
    private modalService: BsModalService,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private convertor: AmountConverterPipe
  ) {
    this.filterdates = {
      from: new Date(
        moment().subtract(this.translastndays, 'day').startOf('day').toString()
      ),
      to: new Date(moment().endOf('day').toString()),
    };

    this.transactions = [];
    this.recordcounts = { total: 0, filtered: 0 };
    this.totalfilters = 0;
    this.searchfilter = {
      fromdate: '',
      todate: '',
      pagination: { start: 0, end: this.recordstodisplay },
      category: '0',
      status: '0',
    };

    this.minDate = new Date(
      moment().subtract(1, 'year').startOf('day').toString()
    );
    this.maxDate = new Date(moment().endOf('day').toString());

    this.bsConfig = Object.assign(
      {},
      {
        containerClass: 'theme-default',
        isAnimated: true,
        dateInputFormat: 'MM/DD/YYYY',
        showWeekNumbers: false,
      }
    );
  }
  locale: string = '';

  ngOnInit(): void {
    this.helpurl = this.imiapi.getglobalsettings();
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.gettransactions();
  }
  filtertransactions(): void {
    this.transactions = [];
    this.recordcounts = { total: 0, filtered: 0 };
    this.searchfilter.pagination = { start: 0, end: this.recordstodisplay };
    this.gettransactions();
  }

  onScroll() {
    if (this.recordcounts.total > this.searchfilter.pagination.end) {
     // this.searchfilter.pagination.start = this.searchfilter.pagination.end + 1;
      this.searchfilter.pagination.start = this.searchfilter.pagination.end ;
      this.searchfilter.pagination.end =
        this.searchfilter.pagination.end + this.recordstodisplay;
      this.gettransactions();
    }
  }

  gotodetails(item): void {
    this.spinner.show();
    this.sharedService.setOption('details', item);
    this.router.navigate(['/transdetails']);
  }

  statusall = false;
  categoryall = false;
  filterschange(type, event): void {
    if (type === 'status') {
      this.statusall = false;
    }
    if (type === 'category') {
      this.categoryall = false;
    }
    // if (event.currentTarget.checked == true) this.hidereset = true;
    // else {
    //   var index = this.transStatusList
    //     .filter((opt) => opt.checked)
    //     .map((opt) => opt.value);
    //   var transindex = this.transCategoryList
    //     .filter((opt) => opt.checked)
    //     .map((opt) => opt.value);

    //   if (index.length <= 0 && transindex.length <= 0) this.hidereset = false;
    // }
  }
  statusselectall(): void {
    this.transStatusList.forEach(function (item: any) {
      item.checked = true;
    });
    this.hidereset = true;
  }

  categoryselectall(): void {
    this.transCategoryList.forEach(function (item: any) {
      item.checked = true;
    });
    this.hidereset = true;
  }
  public isEmpty(myVar): boolean {
    return myVar && myVar.length == 0;
  }

  gettransactions(): void {
    this.spinner.show();
    this.totalfilters = 0;
    if (this.filterdates != undefined && !this.isEmpty(this.filterdates.from)) {
      this.searchfilter.fromdate = moment(this.filterdates.from).format(
        'YYYY-MM-DD'
      );
    } else this.searchfilter.fromdate = '';
    if (this.filterdates != undefined && !this.isEmpty(this.filterdates.to)) {
      this.searchfilter.todate = moment(this.filterdates.to).format(
        'YYYY-MM-DD'
      );
    } else this.searchfilter.todate = '';
    let _selectedstatus = [];
    let _selectedcategories = [];
    this.transStatusList.forEach(function (item: any) {
      if (item.checked) {
        _selectedstatus.push(item.id);
      }
    });

    this.transCategoryList.forEach(function (item: any) {
      if (item.checked) {
        _selectedcategories.push(item.id);
      }
    });

    this.searchfilter.status = _selectedstatus.toString();
    this.searchfilter.category = _selectedcategories.toString();

    this.totalfilters = _selectedstatus.length + _selectedcategories.length;

    this.imiapi.postData('v1/transaction/history', this.searchfilter).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (
          response.status &&
          response.status === '0' &&
          response.data &&
          response.data.transactions != undefined &&
          response.data.transactions.length > 0
        ) {
          // this.transactions = response.data.transactions;
          response.data.transactions.forEach((item: any) => {
            this.transactions.push(item);
          });
          this.transactions.forEach((element) => {
            let convertedamount = element.price;
            //Added math function because for one package discountprice is in negative number "Funkorea daily"
            if (
              element.discountprice != '0' &&
              Math.sign(element.discountprice) == 1
            )
              convertedamount = convertedamount - element.discountprice;
            let amount = this.convertor.transformAmount(convertedamount);
            if (amount != '0' && amount != undefined) {
              if (typeof amount === 'string') {
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

          this.recordcounts.total = response.data.totalRecords;
          this.recordcounts.filtered = response.data.filteredRecords;
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
  openNewtab() {
    window.open(this.helpurl);
  }
  resetfilter() {
    this.transStatusList.forEach(function (item: any) {
      item.checked = false;
    });
    this.transCategoryList.forEach(function (item: any) {
      item.checked = false;
    });
    this.statusall = false;
    this.categoryall = false;
    this.totalfilters = 0;
    this.hidereset = false;
  }
 
}
