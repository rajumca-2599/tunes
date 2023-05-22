import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EnvService {
  public header_text = "";
  public logo = "";
  public loginimage = "";
  public apiUrl = "";
  public defaultLang = "en";
  public enableDebug = false;
  public envmode = "";
 
  public domainurl = "";
  
  public countrycode = "";
  public msisdnminlength=9;
  public msisdnmaxlength=15;
  public languages= []
  public isbsnl=true;
  public reportfiledownloadformat="";
  public isrssenable=false;
  public isresetenable=true;
  public enableccareprofilecreatepopup=false;
  public isenablesecondarysendotp=false;
  public transactionhelpurl = "";
  public customercareroleid = "";
  public customerCareStaus=[];
  public monthwiseloginreportid = "14";
}
