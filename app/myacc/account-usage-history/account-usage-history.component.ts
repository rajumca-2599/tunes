import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import * as moment from 'moment';
@Component({
  selector: 'app-account-usage-history',
  templateUrl: './account-usage-history.component.html',
  styleUrls: ['./account-usage-history.component.css'],
})
export class AccountUsageHistoryComponent implements OnInit {
  helpurl = '';
  lastUpdate = '';
  transactions: any = '';
  data: any = '';
  voice: any = '';
  sms: any = '';
  summary: any = '';
  showTransactions: boolean = false;
  showData: boolean = false;
  showVoice: boolean = false;
  showSms: boolean = false;
  // barChartOptions: ChartOptions = {
  //   responsive: true,
  // };

  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins: any = '';
  barChartColors: Color[] = [];
  barChartData: ChartDataSets[] = [];
  showemptydiv = false;
  showemptyDataDiv: boolean = false;
  showemptySMSDiv: boolean = false;
  showemptyVoiceDiv: boolean = false;
  barChartOptions: any = {};
  showEmptyData: boolean = false;
  showEmptyVoice: boolean = false;
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private router: Router,
    private translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.helpurl = this.imiapi.getglobalsettings();
    this.getUsageHistory();
  }
  gotoback() {
    this.router.navigate(['/myaccount']);
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0;
  }
  getUsageHistory() {
    this.spinner.show();
    this.imiapi.postData('v1/usages/history', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (
          response.status &&
          response.status === '0' &&
          !this.isEmptyObject(response.data)
        ) {
          if (
            response.data.transactions != undefined &&
            !this.isEmptyObject(response.data.transactions)
          ) {
            this.showTransactions = true;
            this.showemptydiv = false;
          }
                  
          this.lastUpdate = this.formateLastUpdateDate(
            response.data.last_update.substr(0, 8)
          );
          this.transactions = response.data.transactions;
          this.summary = response.data.summary;
          this.data = response.data.data.reverse();
          this.sms = response.data.sms.reverse();
          this.voice = response.data.voice.reverse();
          if (
            response.data.transactions == undefined ||
           (this.data.length<=0 && this.sms.length<=0 && this.voice.length<=0)
          ) {
            this.showTransactions = true;
            this.showemptydiv = true;
          } 
        } else {
          this.showTransactions = true;
          this.showemptydiv = true;
        }
      },
      (error) => {
        // console.log(error);
      }
    );
  }
  showDataInfo() {
    this.showEmptyData = false;
    this.showemptyDataDiv = false;
    let dataArry = [];
    this.barChartLabels = [];
    this.showTransactions = false;
    this.showData = true;
    this.showSms = false;
    this.showVoice = false;
    this.barChartColors = [{ backgroundColor: '#2dcef3' }];
    this.barChartOptions = {
      responsive: true,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              labelString: 'GB',
            },
          },
        ],
      },
    };
    if (this.data != '') {
      this.data.forEach((element) => {
        element.Monthname = this.formateDate(element.month);
        this.barChartLabels.push(element.Monthname);
        if (element.value != '0') {
          this.showEmptyData = true;
          let bytes = this.bytesToMB(element.value, 2);
          dataArry.push(bytes);
        } else {
          dataArry.push(element.value);
        }
      });
      this.barChartData = [{ data: dataArry, label: 'GB' }];
      // this.showemptyDataDiv = false;
    }
    if (this.data == '' || this.transactions==undefined || this.transactions.data.length<=0) {
      this.showemptyDataDiv = true;
    }
    if (!this.showEmptyData) {
      this.barChartOptions = {
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                precision: 0,
                beginAtZero: true,
                max: 5,
                stepValue: 1,
                steps: 1,
                labelString: 'GB',
                callback: function (value) {
                  if (Number.isInteger(value)) {
                    return value;
                  }
                },
              },
            },
          ],
        },
      };
    }
  }
  bytesToMB(bytes, roundTo) {
    var converted = bytes / (1024 * 1024);
    return roundTo ? converted.toFixed(roundTo) : converted;
  }
  showVoiceInfo() {
    this.showEmptyVoice = false;
    let voiceArray = [];
    this.barChartLabels = [];
    this.showTransactions = false;
    this.showData = false;
    this.showSms = false;
    this.showVoice = true;
    this.barChartColors = [{ backgroundColor: '#b0e01f' }];
    this.barChartOptions = {
      scaleShowValues: true,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              labelString: 'Min',
            },
          },
        ],
      },
    };
    if (this.voice != '') {
      this.voice.forEach((element) => {
        element.Monthname = this.formateDate(element.month);
        this.barChartLabels.push(element.Monthname);
        if (element.value != '0') {
          this.showEmptyVoice = true;
          voiceArray.push(element.value);
        } else {
          voiceArray.push(element.value);
        }
      });
      this.barChartData = [{ data: voiceArray, label: 'Min' }];
      // this.showemptyVoiceDiv = false;
    }
    if (this.voice == '' || this.transactions==undefined || this.transactions.voice.length<=0) {
      this.showemptyVoiceDiv = true;
    }
    if (!this.showEmptyVoice) {
      this.barChartOptions = {
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                precision: 0,
                beginAtZero: true,
                max: 5,
                stepValue: 1,
                steps: 1,
                labelString: 'Min',
                callback: function (value) {
                  if (Number.isInteger(value)) {
                    return value;
                  }
                },
              },
            },
          ],
        },
      };
    }
  }
  showSmsInfo() {
    let max = 0;
    let min=0;
    let smsArray = [];
    this.barChartLabels = [];
    this.showTransactions = false;
    this.showData = false;
    this.showSms = true;
    this.showVoice = false;
    this.barChartColors = [{ backgroundColor: '#ffa201' }];
    if (this.sms != '') {
      this.sms.forEach((element) => {
        element.Monthname = this.formateDate(element.month);
        this.barChartLabels.push(element.Monthname);
        smsArray.push(element.value);
      });
      this.barChartData = [{ data: smsArray, label: 'SMS' }];
      max = smsArray.reduce((a, b) => Math.max(a, b));
    }
    if (this.sms == '' || this.transactions==undefined || this.transactions.sms.length<=0) {
      this.showemptySMSDiv = true;
    }
    if (this.sms != '' && max!=0) {
      this.barChartOptions = {
        scaleShowValues: true,
        responsive: true,
        scales: { xAxes: [{}],   yAxes: [{
          ticks: {
            max : 30,
            min : 0,
          }
        }],
      },
      };
    } else {
      this.barChartOptions = {
        scaleShowValues: true,
        scales: {
          yAxes: [
            {
              ticks: {
                precision: 0,
                beginAtZero: true,
                max: 5,
                stepValue: 1,
                steps: 1,
                labelString: 'SMS',
                callback: function (value) {
                  if (Number.isInteger(value)) {
                    return value;
                  }
                },
              },
            },
          ],
        },
      };
    }
  }
  closeinfo() {
    this.showTransactions = true;
    this.showData = false;
    this.showSms = false;
    this.showVoice = false;
  }
  formateDate(date) {
    var monthName;
    monthName = moment(date).format('MMM yyyy');
    return monthName;
  }
  formateLastUpdateDate(datestring) {
    let date = moment(datestring, 'YYYYMMDD');
    let datedot = date.format('DD MMM YYYY');
    return datedot;
  }
}
