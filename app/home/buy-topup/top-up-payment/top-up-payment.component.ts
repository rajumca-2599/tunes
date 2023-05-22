import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Pipe,
  TemplateRef,
  ɵbypassSanitizationTrustResourceUrl,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { from, of, zip } from 'rxjs';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { DOCUMENT } from '@angular/common';
import { element } from 'protractor';
import { AmountConverterPipe } from 'src/app/shared/directives/amount-converter.pipe';
import { de } from 'date-fns/locale';
import { SharedService } from 'src/app/shared/SharedService';
import { ApidataService } from 'src/app/shared/apidata.service';
import { typeofExpr } from '@angular/compiler/src/output/output_ast';
declare var $: any;
@Component({
  selector: 'app-top-up-payment',
  templateUrl: './top-up-payment.component.html',
  styleUrls: ['./top-up-payment.component.css'],
  providers: [AmountConverterPipe],
})
export class TopUpPaymentComponent implements OnInit, OnDestroy {
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private convertor: AmountConverterPipe,
    @Inject(DOCUMENT) private document: Document,
    private sharedService: SharedService,
    private apidata: ApidataService
  ) { }
  selectedlanguage = 'ID';
  public denom_paymentmethod: any = [];
  public paymentresp: any = [];
  public ewalletInfo: any = [];
  public cardInfo: any[] = [];
  public bankInfo: any[] = [];
  public preferredinfo: any[] = [];
  public topupNumber: string = '';
  public selecteddenom: any = {};
  public topupid: string = '';
  public selectedpaymentmode: string = '';
  public selectedpaymenttype: string = '';
  modalRef: BsModalRef;
  showPurchaseReview: boolean = false;
  txtMobileNumber: string = '';
  public sourcescreen: string = '';
  denomresponse: any = {};
  eligible: any = {};
  shortcode: string = '';
  keyword = '';
  msg = '';
  userimage = '';
  userProfile: any = {};
  gift = '';
  vascontent = '';
  public balance: any = '';
  helpurl: string = '';
  topupdecimal = '';
  ispostapaid: boolean = false;
  discountpercentage: any = 0;
  enabletopup: boolean = false;
  duedate: string = '';
  offertype = '';
  failuremesg = '';
  shopeepaymsg = "";
  ngOnInit(): void {
    if (this.imiapi.getSubstype().toUpperCase() == 'POSTPAID')
      this.ispostapaid = true;
    this.helpurl = this.imiapi.getglobalsettings();
    this.navigateToTop();
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.binddata();
  }
  getCustomerImage() {
    this.userimage = this.env.cdnurl + 'assets/images/img-prifile.jpg';
    this.userProfile = this.imiapi.getUserProfile();
    if (
      !(
        this.userProfile == null ||
        this.userProfile == 'undefined' ||
        this.userProfile == 'NA'
      )
    )
      this.userimage = this.userProfile.imagelocation;
  }
  gototopup() {
    this.router.navigate(['/topup']);
  }
  navigateToTop() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  binddata() {
    if (
      this.imiapi.getSession('paymentmethod') != '' &&
      this.imiapi.getSession('paymentmethod') != undefined &&
      this.imiapi.getSession('paymentmethod') != 'NA'
    ) {
      this.denom_paymentmethod = JSON.parse(
        this.imiapi.getSession('paymentmethod')
      );

      this.denom_paymentmethod = this.denom_paymentmethod.toUpperCase();
    }
    // console.log(this.denom_paymentmethod);
    this.sourcescreen = JSON.parse(this.imiapi.getSession('sourcescreen'));
    this.selecteddenom = JSON.parse(this.imiapi.getSession('selectedamount'));
    if (
      this.selecteddenom != 'NA' &&
      this.selecteddenom != undefined &&
      this.selecteddenom != ''
    ) {
      let amount = this.convertor.transformAmount(this.selecteddenom);
      if (amount != '0' && amount != undefined && typeof amount === 'string') {
        if (amount.includes(',')) {
          this.selecteddenom = amount.split(',')[0];
          this.topupdecimal = '.' + amount.split(',')[1];
        } else {
          this.selecteddenom = amount.split('.')[0];
          this.topupdecimal = '.' + amount.split('.')[1];
        }
      }
    }
    this.topupNumber = JSON.parse(this.imiapi.getSession('topupnumber'));

    this.topupid = JSON.parse(this.imiapi.getSession('topupvouchercode'));
    this.denomresponse = JSON.parse(this.imiapi.getSession('denomresponse'));
    if (
      this.imiapi.getSession('shortcode') != undefined &&
      this.imiapi.getSession('shortcode') != 'NA'
    )
      this.shortcode = JSON.parse(this.imiapi.getSession('shortcode'));
    if (
      this.imiapi.getSession('keyword') != undefined &&
      this.imiapi.getSession('keyword') != 'NA'
    )
      this.keyword = JSON.parse(this.imiapi.getSession('keyword'));

    if (this.sourcescreen == 'viewpackage') {
      let dashboard = this.imiapi.getStorage('dashboard');
      if (
        dashboard != '' &&
        dashboard != undefined &&
        dashboard != 'NA' &&
        this.imiapi.getSubstype().toUpperCase() != 'POSTPAID'
      ) {
        this.balance = JSON.parse(
          this.imiapi.getStorage('dashboard')
        ).prepaidinfo.balance;
      }
      if (this.balance == '')
        if (this.imiapi.getSubstype().toUpperCase() != 'POSTPAID')
          this.getDashoard();
      if (
        this.denomresponse.discount_price != '0' &&
        this.denomresponse.normal_price != '0.0'
      ) {
        this.discountpercentage =
          (parseFloat(this.denomresponse.discount_price) * 100) /
          parseFloat(this.denomresponse.normal_price);
        this.discountpercentage = parseFloat(this.discountpercentage).toFixed(
          0
        );
      }
    }
    if (this.sourcescreen == 'paybill') {
      if (this.selectedlanguage == 'ID') {
        var months = [
          'Januari',
          'Februari',
          'Maret',
          'April',
          'Mei',
          'Juni',
          'Juli',
          'Agustus',
          'September',
          'Oktober',
          'November',
          'Desember',
        ];
        var d = new Date(this.denomresponse.duedate);
        var monthName = months[d.getMonth()];
        this.duedate = 'Tagihan ' + monthName;
      } else {
        var months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        var d = new Date(this.denomresponse.duedate);
        var monthName = months[d.getMonth()];
        this.duedate = monthName + ' Bill';
      }
    }
    this.gift = this.imiapi.getSession('gift');
    if (this.gift != undefined && this.gift != 'NA' && this.gift != '')
      this.gift = JSON.parse(this.imiapi.getSession('gift'));
    this.vascontent = this.imiapi.getSession('vascontent');
    if (
      this.vascontent != undefined &&
      this.vascontent != 'NA' &&
      this.vascontent != ''
    )
      this.vascontent = JSON.parse(this.imiapi.getSession('vascontent'));
    let type = this.imiapi.getSession('offertype');
    if (type != undefined && type != '' && type != 'NA')
      this.offertype = JSON.parse(type);
    let paymentchannel = this.imiapi.getSession('paymentChannels');
    if (
      paymentchannel != 'undefined' &&
      paymentchannel != 'NA' &&
      paymentchannel != ''
    ) {
      this.paymentresp = JSON.parse(paymentchannel);
      this.bindpaymentChannels();
    } else {
      this.spinner.show();
      try {
        this.imiapi
          .postData('v1/settings/getvalue', { module: 'MOBAPP_SETTINGS' })
          .subscribe(
            (response: any) => {
              this.spinner.hide();
              if (response.code == '10002' || response.code == '11111') {
                this.imiapi.clearSession();
                // this.router.navigate(['/login']);
                // Added on 27thjune to redirect to HE 
                this.router.navigate(['/pwa']);
              }
              if (response.status != null && response.data != undefined) {
                if (response.status == '0') {
                  // let payment = JSON.parse(
                  //   response.data.AJ_PAYMENT_CHANNELS_EN_80_3_0
                  // );
                  let payment = JSON.parse(response.data.AJ_PAYMENT_CHANNELS_PWA);
                  this.paymentresp = payment.channels;
                  this.imiapi.setSession('paymentChannels', this.paymentresp);
                  this.bindpaymentChannels();
                  //  console.log(this.paymentresp);
                }
              }
            },
            (error) => {
              //  console.log(error);
            }
          );
      } catch (e) {
        console.log(e);
      }
    }
  }
  bindpaymentChannels() {
    // console.log(this.paymentresp);
    this.paymentresp.forEach((element) => {
      if (element.type == 'ewallet') {
        if (this.denom_paymentmethod.includes(element.id)) {
          element.isPaymentModeAllowed = true;
        } else {
          element.isPaymentModeAllowed = false;
        }
        this.ewalletInfo.push(element);
      } else if (element.type == 'card') {
        if (this.denom_paymentmethod.includes(element.id)) {
          element.isPaymentModeAllowed = true;
        } else {
          element.isPaymentModeAllowed = false;
        }
        this.cardInfo.push(element);
      } else if (element.type == 'banking') {
        if (this.denom_paymentmethod.includes(element.id)) {
          element.isPaymentModeAllowed = true;
        } else {
          element.isPaymentModeAllowed = false;
        }
        this.bankInfo.push(element);
      }
      //Commented for PWA phase2 release
      // else if (element.type == 'BALANCE') {
      //   this.preferredinfo.push(element);
      // }
    });
    if (this.sourcescreen == 'viewpackage') {
      var obj = {
        cap: '-1',
        displayname_en: 'PREFERRED PAYMENT',
        displayname_id: 'PEMBAYARAN PILIHAN',
        id: 'BALANCE',
        id_sof: '01',
        isPaymentModeAllowed: true,
        name_en: 'BALANCE',
        name_id: 'Saldo',
        type: 'balance',
        lowbalance: false,
      };
      if (this.imiapi.getSubstype().toUpperCase() != 'POSTPAID') {
        if (
          this.denomresponse != 'NA' &&
          this.denomresponse != undefined &&
          this.denomresponse != ''
        ) {
          if (
            parseFloat(this.denomresponse.normal_price) >
            parseFloat(this.balance) &&
            this.balance != ''
          ) {
            obj.lowbalance = true;
            obj.isPaymentModeAllowed = false;
          }
        }
      }
      this.preferredinfo.push(obj);
    }
  }
  gotoPreviousScreen() {
    this.router.navigate(['/' + this.sourcescreen]);
    if (this.sourcescreen == 'viewpackage') {
      this.apidata.footerstateName.next('package');
      this.imiapi.setStorageValue('footerstateName', 'package');
    }
  }
  unselectPaymentmode() {
    this.selectedpaymentmode = '';
    this.selectedpaymenttype = '';
  }
  doPayment(item: any) {
    this.eligible = {};
    if (this.imiapi.getSubstype().toUpperCase() != 'POSTPAID') {
      if (
        (item.type == 'balance' &&
          item.lowbalance != undefined &&
          item.lowbalance == true) ||
        (this.balance == '' &&
          this.sourcescreen == 'viewpackage' &&
          item.type == 'balance' &&
          item.lowbalance != undefined &&
          item.lowbalance == true)
      ) {
        return;
      }
    }
    if (this.selectedpaymentmode == item.id) {
      this.selectedpaymentmode = '';
      this.selectedpaymenttype = '';
      this.enabletopup = false;
      return;
    } else {
      this.selectedpaymentmode = item.id;
      this.selectedpaymenttype = item.type;
    }
    if (this.selectedlanguage.toUpperCase() == 'EN') {
      this.msg =
        'Please input your account number used on ' +
        this.selectedpaymentmode +
        ' app. And make sure you have ' +
        this.selectedpaymentmode +
        ' app installed on this phone';
      this.shopeepaymsg = "Please make sure the number you entered have active ShopeePay account";
    }
    else {
      this.msg =
        'Masukkan nomor akun yang kamu pakai di aplikasi ' +
        this.selectedpaymentmode +
        ' ,pastikan kamu memiliki aplikasi' +
        this.selectedpaymentmode +
        ' di perangkat ini';
      this.shopeepaymsg = "Pastikan nomor yang kamu masukkan memiliki akun ShopeePay yang aktif";
    }
    if (
      this.selectedpaymentmode == 'GOPAY' ||
      this.selectedpaymentmode == 'OVO' || this.selectedpaymentmode == 'OVO' || this.selectedpaymentmode == 'SHOPEE_PAY'
    ) {
      this.makepayment();
      return;
    }
    if (
      this.sourcescreen == 'viewpackage' &&
      this.selectedpaymentmode != 'BALANCE'
    ) {
      this.checkeligbile();
    } else {
      this.showPurchaseReview = !this.showPurchaseReview;
      this.enabletopup = true;
    }
  }
  checkeligbile() {
    var obj = {};
    if (this.gift == 'Y')
      obj = {
        keyword: this.keyword,
        shortcode: this.shortcode,
        tomsisdn: this.imiapi.getValidMobileNumber(this.topupNumber),
      };
    else obj = { keyword: this.keyword, shortcode: this.shortcode };
    this.spinner.show();
    this.imiapi
      .postData('v1/packages/checkeligible', obj)
      .subscribe((response: any) => {
        this.spinner.hide();
        if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
        }
        if (response.status != null && response.data != undefined) {
          if (response.status == '0') {
            this.eligible = response.data;
            // console.log(this.eligible);
            if (this.eligible.eligibility == 'ELIGIBLE') {
              if (this.eligible.isrebuy == 'Yes') {
                if (
                  this.eligible.rebuytype == 'UPGRADE' ||
                  this.eligible.rebuytype == 'DOWNGRADE'
                ) {
                  this.eligible.expirydatetime = this.calculateDiff(
                    this.eligible.expirydate
                  );
                  $('#eligible').modal('show');
                  return;
                } else {
                  this.contuinepayment();
                }
              } else {
                this.contuinepayment();
                // $('#noteligible').modal('show');
                // return;
              }
            } else {
              $('#noteligible').modal('show');
              this.eligible.responsemsg = response.data.responsemsg;
              if (
                this.eligible.responsemsg == '' ||
                this.eligible.responsemsg == undefined
              ) {
                if (this.selectedlanguage == 'EN') {
                  this.eligible.responsemsg =
                    'Oops Something went wrong. Please try again after sometime.';
                } else {
                  this.eligible.responsemsg =
                    'Oops Ada yang salah. Silakan coba lagi setelah beberapa saat lagi.';
                }
              }
              this.enabletopup = false;
              return;
            }
          }
        }
      });
  }
  makepayment() {
    if (
      (this.selectedpaymentmode != undefined &&
        this.selectedpaymentmode != 'IMKAS' &&
        this.sourcescreen == 'viewpackage' &&
        this.selectedpaymentmode != 'BALANCE' &&
        this.isEmptyObject(this.eligible)) ||
      (this.selectedpaymentmode != undefined &&
        this.selectedpaymentmode != 'KARTUQ' &&
        this.sourcescreen == 'viewpackage' &&
        this.selectedpaymentmode != 'BALANCE' &&
        this.isEmptyObject(this.eligible))
    ) {
      this.checkeligbile();
      return;
    }
    if (
      (this.txtMobileNumber == '' && this.selectedpaymentmode == 'GOPAY') ||
      (this.txtMobileNumber == '' && this.selectedpaymentmode == 'OVO')
    ) {
      // this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
      $('#filtersModal').modal('show');
      return;
    }
    if (this.txtMobileNumber == '' && this.selectedpaymentmode == 'SHOPEE_PAY') {
      $('#shopeepayModal').modal('show');
      return;
    }
    if (
      this.sourcescreen == 'viewpackage' &&
      this.selectedpaymentmode != 'BALANCE'
    ) {
      if (this.eligible.eligibility == 'ELIGIBLE') {
        this.payment();
      } else {
        $('#noteligible').modal('show');
      }
    } else this.payment();
  }
  closeModal(model: any) {
    $('#' + model).modal('hide');
  }
  contuinepayment() {
    if (
      (this.txtMobileNumber == '' && this.selectedpaymentmode == 'GOPAY') ||
      (this.txtMobileNumber == '' && this.selectedpaymentmode == 'OVO')

    ) {
      // this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
      $('#filtersModal').modal('show');
      return;
    }
    if (this.txtMobileNumber == '' && this.selectedpaymentmode == 'SHOPEE_PAY') {
      $('#shopeepayModal').modal('show');
      return;
    }
    if (this.eligible.eligibility == 'ELIGIBLE') {
      this.showPurchaseReview = !this.showPurchaseReview;
      //this.payment();
      this.enabletopup = true;
    } else {
      $('#noteligible').modal('show');
    }
  }
  hideAccountNo() {
    $('#filtersModal').modal('hide');
    $('#shopeepayModal').modal('hide');
    this.showPurchaseReview = !this.showPurchaseReview;
    this.enabletopup = true;
  }
  deselectSelectedPayment() {
    this.showPurchaseReview = false;
    this.enabletopup = false;
    this.selectedpaymentmode = '';
    this.selectedpaymenttype = '';
  }
  payment() {
    let url = '';
    let transtype = '';
    if (this.selectedpaymentmode == 'BALANCE') {
      url = 'v1/packages/activate';
      transtype = 'package';
      if (this.vascontent == 'Y') {
        url = 'v1/vaspackages/activate';
        transtype = 'content';
      }
    } else {
      url = 'v1/payment/payment';
      transtype = 'package';
    }
    if (this.offertype == 'cvm') {
      url = 'v1/offer/handleintent';
      transtype = 'package';
    }

    if (this.selectedpaymentmode == 'BALANCE') {
      var reqobj = {
        transtype:
          this.sourcescreen == 'viewpackage'
            ? transtype
            : this.sourcescreen == 'paybill'
              ? 'billpay'
              : 'reload',
        keyword: this.keyword,
        shortcode: this.shortcode,
        operationtype: this.gift == 'Y' ? 'gift' : 'buy',
        offerid:
          this.sourcescreen == 'paybill'
            ? this.denomresponse.billReference
            : this.denomresponse.product_id,
        tomsisdn:
          this.gift == 'Y'
            ? this.imiapi.getValidMobileNumber(this.topupNumber)
            : '',
        name: '',
        packagename: this.sourcescreen == 'viewpackage' ? this.topupid : '',
        normalprice: this.denomresponse.normal_price,
        discountprice: this.denomresponse.discount_price.toString(),
        paymentchannel: this.selectedpaymentmode,
        type: this.selectedpaymenttype,
        sourcescreen: this.sourcescreen,
      };
      if (
        reqobj.operationtype == 'gift' &&
        this.imiapi.formatMobileNo(reqobj.tomsisdn) ==
        this.imiapi.getMSISDN() &&
        this.sourcescreen == 'viewpackage'
      ) {
        if (this.selectedlanguage == 'EN')
          this.eligible.responsemsg = 'Gift msisdn should not be same';
        else
          this.eligible.responsemsg = 'Nomor ini sudah berlangganan paket lain';
        $('#noteligible').modal('show');
        return;
      }
      this.spinner.show();
      this.imiapi.postData(url, reqobj).subscribe(
        (response: any) => {
          this.spinner.hide();
          if (response.code == '10002' || response.code == '11111') {
            this.imiapi.clearSession();
            // this.router.navigate(['/login']);
            // Added on 27thjune to redirect to HE 
            this.router.navigate(['/pwa']);
          }
          if (response.status != null && response.data != undefined) {
            if (response.status == '0') {
              let convertedamount;
              let converteddecimal;
              let respamount = this.convertor.transformAmount(
                this.denomresponse.normal_price
              );
              if (
                respamount != '0' &&
                respamount != undefined &&
                typeof respamount === 'string'
              ) {
                if (respamount.includes(',')) {
                  convertedamount = respamount.split(',')[0];
                  converteddecimal = '.' + respamount.split(',')[1];
                } else {
                  convertedamount = respamount.split('.')[0];
                  converteddecimal = '.' + respamount.split('.')[1];
                }
              } else {
                convertedamount = respamount;
              }
              var SendPaymentResp = {
                amount: convertedamount + converteddecimal,
                msisdn: this.topupNumber,
                transid: response.transid,
                protip: response.data.protip,
                actionData: response.data.actionData
              };

              this.imiapi.setSession('topupsucessresp', SendPaymentResp);
              this.imiapi.setSession('topupreqobj', reqobj);
              this.router.navigate(['/topuptimelimit']);
            } else {
              var obj = {
                protip: response.message,
                msisdn: this.imiapi.getMSISDN(),
                transid: response.transid,
              };
              this.sharedService.setOption('checkstatusresp', obj);
              this.imiapi.setSession('topupreqobj', reqobj);
              this.router.navigate(['/failed']);
            }
          }
        },
        (error) => {
          // console.log(error);
        }
      );
    } else {
      //let paymentmode=this.selectedpaymentmode=="SHOPEE_PAY"?"ShopeePay":this.selectedpaymentmode;
      var obj = {
        transtype:
          this.sourcescreen == 'viewpackage'
            ? transtype
            : this.sourcescreen == 'paybill'
              ? 'billpay'
              : 'reload',
        operationtype:
          this.gift == 'Y' ||
            this.imiapi.getMSISDN() !=
            this.imiapi.formatMobileNo(this.topupNumber)
            ? 'gift'
            : 'buy',
        paymentchannel: this.selectedpaymentmode,
        offerid:
          this.sourcescreen == 'paybill'
            ? this.denomresponse.billReference
            : this.denomresponse.product_id,
        tomsisdn:
          this.gift == 'Y' ||
            this.imiapi.getMSISDN() !=
            this.imiapi.formatMobileNo(this.topupNumber)
            ? this.imiapi.getValidMobileNumber(this.topupNumber)
            : '',
        normalprice:
          this.sourcescreen == 'paybill'
            ? this.denomresponse.amount
            : this.denomresponse.normal_price,
        discountprice:
          this.sourcescreen == 'paybill'
            ? '0'
            : this.denomresponse.discount_price.toString(),
        packagename: this.sourcescreen == 'viewpackage' ? this.topupid : '',
        name: '',
        walletmsisdn: this.txtMobileNumber,
        type: this.selectedpaymenttype,
        sourcescreen: this.sourcescreen,
      };
      if (
        obj.operationtype == 'gift' &&
        this.imiapi.formatMobileNo(obj.tomsisdn) == this.imiapi.getMSISDN()
      ) {
        if (this.selectedlanguage == 'EN')
          this.eligible.responsemsg = 'Gift msisdn should not be same';
        else
          this.eligible.responsemsg = 'Nomor ini sudah berlangganan paket lain';
        $('#noteligible').modal('show');
        return;
      }
      this.spinner.show();
      this.imiapi.postData(url, obj).subscribe(
        (response: any) => {
          this.spinner.hide();
          if (response.code == '10002' || response.code == '11111') {
            this.imiapi.clearSession();
            // this.router.navigate(['/login']);
            // Added on 27thjune to redirect to HE 
            this.router.navigate(['/pwa']);
          }
          if (response.status != null && response.data != undefined) {
            if (response.status == '0') {
              let convertedamount;
              let converteddecimal;
              if (response.data.SendPaymentResp != undefined) {
                let respamount = this.convertor.transformAmount(
                  response.data.SendPaymentResp.amount
                );
                if (
                  respamount != '0' &&
                  respamount != undefined &&
                  typeof respamount === 'string'
                ) {
                  if (respamount.includes(',')) {
                    convertedamount = respamount.split(',')[0];
                    converteddecimal = '.' + respamount.split(',')[1];
                  } else {
                    convertedamount = respamount.split('.')[0];
                    converteddecimal = '.' + respamount.split('.')[1];
                  }
                } else {
                  convertedamount = respamount;
                }
              }
              if (obj.paymentchannel != 'CARD') {
                var responeObj = {
                  amount: convertedamount + converteddecimal,
                  transid: response.transid,
                  actionData: response.data.SendPaymentResp.actionData,
                  msisdn: response.data.SendPaymentResp.msisdn,
                  expirytime: response.data.SendPaymentResp.expiryTime,
                };
                this.imiapi.setSession('topupsucessresp', responeObj);
                this.imiapi.setSession('topupreqobj', obj);
                this.router.navigate(['/topuptimelimit']);
              } else {
                this.navigatetoCreditCard(response);
              }
            }
            else {
              //Transaksi gagal bisa ditimbulkan dari beberapa hal berikut:↵• Time out request↵• Kesalahan jaringan↵• Kesalahan teknis↵SIlakan coba setelah beberapa saat lagi
              //comented on 17feb to stop the user when api gets failed
              // var result = {
              //   protip: response.message,
              // };
              // this.sharedService.setOption('checkstatusresp', result);
              // this.imiapi.setSession('topupreqobj', obj);
              // this.router.navigate(['/failed']);

              this.failuremesg = response.message;
              $('#errorpopup').modal('show');
              return;
            }
          }
          else {
            this.failuremesg = response.message;
            $('#errorpopup').modal('show');
            return;
          }
        },
        (error) => {
          this.spinner.hide();
          // console.log(error);
        }
      );
    }
  }
  navigatetoCreditCard(data: any) {
    setTimeout(() => {
      //alert('Hidden3');
      this.spinner.show();
      this.document.location.href = data.data.SendPaymentResp.actionData;
    }, 20);
  }
  ngAfterViewInit() {
    this.cd.detectChanges();
  }
  getDashoard() {
    this.imiapi.postData('v1/dashboard/get/v2', {}).subscribe(
      (response: any) => {
        if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
        }
        if (response.status != null && response.data != undefined) {
          if (response.status == '0') {
            this.balance = response.data.prepaidinfo.balance;

            if (this.imiapi.getSubstype().toUpperCase() != 'POSTPAID') {
              if (
                this.denomresponse != 'NA' &&
                this.denomresponse != undefined &&
                this.denomresponse != ''
              ) {
                if (
                  parseFloat(this.denomresponse.normal_price) >
                  parseFloat(this.balance) &&
                  this.balance != ''
                ) {
                  this.preferredinfo[0].lowbalance = true;
                  this.preferredinfo[0].isPaymentModeAllowed = false;
                }
              }
            }
            //console.log(this.balance);
          }
        }
      },
      (error) => {
        //  console.log(error);
      }
    );
  }
  ngOnDestroy() {
    $('#filtersModal').modal('hide');
    $('#paymentmodal').modal('hide');
    $('#shopeepayModal').modal('hide');
    $('#eligible').modal('hide');
    $('#noteligible').modal('hide');
    this.imiapi.removeSession("shopeepayapi");
  }
  isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0;
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  calculateDiff(dateSent) {
    var dateParts = dateSent.split('-');
    let formatdate = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];

    var expirydate: any = new Date(formatdate);
    var currentdate: any = new Date();
    // console.log(currentdate);
    // console.log(expirydate);
    var diffDays: any = Math.floor(
      (currentdate - expirydate) / (1000 * 60 * 60 * 24)
    );

    return diffDays;
  }
}
