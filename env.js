(function (window) {
  window.__env = window.__env || {};
  // window.__env.apiUrl ="https://myim3api-stg.gammasprint.com";
  // window.__env.apiUrl ="https://d5.imidigital.net/selfcarepwa/#/";
  // this is for local(proxy)
  window.__env.apiUrl ="http://localhost:9135/mockdata/postdata"; 
  window.__env.partnerapiUrl="https://myim3api-stg.gammasprint.com"
  window.__env.enableDebug = true;
  window.__env.envmode = "dev";
  window.__env.home_promotions_sourceid = "22";
  window.__env.account_promotions_sourceid = "26";
  window.__env.devlogin = {};/* { msisdn: "6285693124292", transid: "3002181161587574469635634", token: "TT7DRTEIZJTT35PNXS81C07XMXL6RYET4KXN" } */;
  window.__env.otpmaxtimelimit = "30";
  window.__env.fragmentlist=[ 814,815,816,855,856,857,858,0814,0815,0816,0855,0856,0857,0858];
  window.__env.dob_min_year="1900";
  window.__env.dob_max_year="0";
  window.__env.hdr_back_url="https://indosatooredoo.com/",
  window.__env.appStoreUrl="https://indosatooredoo.com/appStore",
  window.__env.playStoreUrl="https://indosatooredoo.com/playStore",
  window.__env.heUrl1="https://myim3api-dev.indosatooredoo.com/api/v1/token/get?id=!TID!";
  window.__env.heUrl2="https://myim3api-stg.indosatooredoo.com/api/v1/token/webtoken";
  window.__env.heUrl3="https://myim3-he.indosatooredoo.com/api/v1/token/webtoken";
  window.__env.heUrl="https://myim3-he.indosatooredoo.com/api/v1/token/getweb?X-IMI-TOKENID=!TOKENID!&X-IMI-CHANNEL=!CHANNEL!&X-IMI-LANGUAGE=!LANGUAGE!&tid=!TID!";

  
  
  window.__env.dashboardresp_max_cache_limit="180000";
  window.__env.countryCode="62";
  window.__env.mobileNo_MinLength=9;
  window.__env.mobileNo_MaxLength=13;
  window.__env.prepaid_minbalance=300;
 // window.__env.cdnurl='https://myim3app.kloc.co/';
 window.__env.cdnurl='http://localhost:4200/';

  window.__env.apicache=60000;
  window.__env.getappurl='https://myim3stg.indosatooredoo.com/#/getapp';
  window.__env.disablehe_ios="F";

  window.__env.ovomaxtimelimit="30";
  window.__env.gopaymaxtimelimit="30";
  window.__env.bankmaxtimelimit="30";
  window.__env.balancemaxtimelimit="30";
  window.__env.cardmaxtimelimit="30";

  //Added on 22/10/2020
  window.__env.transLastNdays = "7";
 
  window.__env.transStatusList = [
    // { id: '', title: 'All Status',checked: false },
    { id: '3', titleeng: 'Unsuccessful',titlebah: 'Gagal',checked: false },
    { id: '1', titleeng: 'In Progress',titlebah:'Dalam Proses' ,checked: false},
    { id: '2', titleeng: 'Paid',titlebah:'Lunas' ,checked: false}
  ];
 
  window.__env.transCategoryList = [
    // { id: '', title: 'All Category',checked: false },
    { id: 'Buy|Package', titleeng: 'Buy Package',titlebah:'Beli Paket',checked: false },
    { id: 'Gift|Package', titleeng: 'Gift Package',titlebah:'Gift Paket' ,checked: false},
    { id: 'Buy|RELOAD', titleeng: 'Top Up',titlebah:'Isi Ulang' ,checked: false},
    { id: 'Gift|RELOAD', titleeng: 'Gift Top Up',titlebah:'Gift Isi Ulang' ,checked: false},
    { id: 'Bill|Payment', titleeng: 'Bill Payment',titlebah:'Pembayaran Tagihan' ,checked: false},
    { id: 'Buy|Content', titleeng: 'Buy Content',titlebah:'Beli Konten' ,checked: false}
  ];
  window.__env.home_advance_promotions_sourceid="51";
  window.__env.maxapicalls=3;
  window.__env.buynewnumber="https://myim3shop.indosatooredoo.com/";
  window.__env.prepaidactivation="https://myim3.indosatooredoo.com/registration";
  window.__env.partner_otpservice="https://myim3api.indosatooredoo.com/api/";
  window.__env.partner_terms_condition_url="https://myim3api-stg.indosatooredoo.com/api/v1/template/get?type=ABOUTMYIM3"
  window.__env.aboutmyimi="https://myim3api-stg.indosatooredoo.com/api/v1/template/get?type=ABOUTMYIM3";
  window.__env.childNumberEncryptionPwd="123"
  window.__env.home_promobannersourceid="43";
  window.__env.accpromobannersourceid="49";
  window.__env.package_promotions_sourceid="25";
  window.__env.package_promotionbanner_sourceid="47";
  window.__env.Im3PackUrl="https://myim3shop.indosatooredoo.com/#/";
  window.__env.simRegistrationUrl=" https://myim3.indosatooredoo.com/registration";
  window.__env.profileFileUploadSize="5";
  window.__env.backUrl="http://localhost:5093/ssovalidate/";
  window.__env.appUrl="https://d5.imidigital.net/selfcarepwa/#/";
  window.__env.ioWebSiteChannel="Web";
  //window.__env.msisdnEncryptionPwd="!ndosaT3otp";
  window.__env.phId="!ndosaT3otp";
  window.__env.getTemplateParam="SUCCESS_MAIL";
  //Added by sinduja #Jira ID:DIGITAL-6747
  window.__env.shopeepaymaxtimelimit="200";
  window.__env.shopeepaymaxapicalls=3;
  window.__env.timezone="en-US";
  window.__env.shopeepayapifreq= 10000;
  window.__env.enableallencryptedheaders = true;
})(this);
