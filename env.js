(function (window) {
  window.__env = window.__env || {};
  window.__env.header_text="BSNL SelfCare";
  window.__env.logo = "assets/images/bsnl-logo.jpg";
  window.__env.loginimage = "assets/images/bsnl-logo.jpg";
  window.__env.domainurl = "";
  window.__env.apiUrl ="https://stgcms-mybsnl.bsnl.co.in/admin/api/v1/"
  //window.__env.apiUrl = "https://cms-mybsnl.bsnl.co.in/admin/api/v1/";
  //window.__env.apiUrl ="https://myim3-stgcms.indosatooredoo.com/admin/api/v1/";
  window.__env.enableDebug = true;
  window.__env.envmode = "dev";
  window.__env.defaultLang = "en";

  window.__env.countrycode="91";
  window.__env.msisdnminlength=9;
  window.__env.msisdnmaxlength=15;

  window.__env.languages=
  [
    {"key":"English","value":"en"},
    {"key":"Hindi","value":"hi"}
  ]
  window.__env.isbsnl=true;
  window.__env.reportfiledownloadformat="csv"
  window.__env.isrssenable=false;
  window.__env.isresetenable=false;
  window.__env.enableccareprofilecreatepopup=false; 
  window.__env.isenablesecondarysendotp=false;
  window.__env.transactionhelpurl = "https://mybsnl.bsnl.co.in/api/v2/template/get?type=HelpPS";
  window.__env.customercareroleid = "101004";
  window.__env.customerCareStaus=
  [
    {"key":"0","value":"Pending"},
    {"key":"1","value":"Fail"},
    {"key":"2","value":"Payment Success"},
    {"key":"3","value":"Payment Fail"},
    {"key":"4","value":"Fullfilment Fail"},
    {"key":"5","value":"Fullfillment Success"},
    {"key":"6","value":"InProgress"},
    {"key":"7","value":"Aborted"}    
  ],

  window.__env.monthwiseloginreportid = "14";
})(this);
