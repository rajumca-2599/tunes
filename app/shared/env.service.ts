import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EnvService {
  public apiUrl = '';
  public defaultLang = 'en';
  public enableDebug = false;
  public envmode = "";
  public hdrAuthorization = '642d1cc69d90666962726e';
  //public hdrChannel = 'myim3';
  public hdrChannel = 'MYIM3';
  public hdrVersion = '4.1';
  public home_promotions_sourceid = "";
  public account_promotions_sourceid = ""
  public devlogin: any = { msisdn: "", transid: "", token: "" };
  public otpmaxtimelimit = "";
  public fragmentlist: any[] = [];
  public dob_min_year: number = 0;
  public dob_max_year: number = 0;
  public hdr_back_url = '';
  public appStoreUrl = '';
  public playStoreUrl = '';
  public heUrl = '';
  public dashboardresp_max_cache_limit: number = 0;
  public countryCode = "";
  public mobileNo_MinLength: number = 9;
  public mobileNo_MaxLength: number = 15;
  public prepaid_minbalance: number = 5000;
  public cdnurl: string = '';
  public apicache: number = 30000;
  public getappurl: string = "";
  public disablehe_ios: string = "";
  public ovomaxtimelimit = "";
  public gopaymaxtimelimit = "";
  public bankmaxtimelimit = "";
  public transStatusList = "";
  public transCategoryList = "";
  public transLastNdays = "";
  public home_advance_promotions_sourceid: string = "";
  public home_promobannersourceid: string = "";
  public maxapicalls: number = 3;
  public balancemaxtimelimit = "";
  public cardmaxtimelimit = "";
  public buynewnumber = "";
  public prepaidactivation = "";
  public aboutmyimi = "";
  public childNumberEncryptionPwd: string = "";
  public accpromobannersourceid: string = "";
  public package_promotions_sourceid: string = "";
  public package_promotionbanner_sourceid: string = "";
  public Im3PackUrl: string = "";
  public simRegistrationUrl: string = "";
  public profileFileUploadSize: String = "";
  public backUrl: string = "";
  public appUrl: string = "";
  public partnerapiUrl:string="";
  public partner_otpservice:string="";
  public partner_terms_condition_url:string="";
  public ioWebSiteChannel: string = "";
 // public msisdnEncryptionPwd: string = "";
  public  phId="!ndosaT3otp";
  public getTemplateParam: string = "";
  public shopeepaymaxtimelimit = "";
  public shopeepaymaxapicalls: number = 3;
  public shopeepayapifreq: number = 10000;
  public timezone = "";
  public enableallencryptedheaders: boolean;
  constructor() { }
}