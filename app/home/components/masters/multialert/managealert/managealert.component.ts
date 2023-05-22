import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
import { EnvService } from '../../../../../shared/services/env.service';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../../../shared/services/common.service';
@Component({
  selector: 'app-managealert',
  templateUrl: './managealert.component.html',
  styleUrls: ['./managealert.component.css']
})
export class ManagealertComponent implements OnInit {
  public title: string = "ADD ALERT CONFIGURATIONS";
  public acobj: any;
  public mode: string = "insert";
  public alerttypeslist: any = [];
  public staticpageslist: any[];
  public viewObject: any;
  public eventtypeslist: any[];
  public redirectpageslist: any[];
  pagemasters: any[] = [];
  private _httpobj1: Subscription;
  languageList:any;
  newengobj:any
  newlangobj:any
  hex: any;
  langval:any;
  plansCopy:any;
  removeobj:boolean=false;
  lagnuages:any;
  public smartalertvalidation: any[];
  constructor(private comm: CommonService, private dialogRef: MatDialogRef<ManagealertComponent>, @Inject(MAT_DIALOG_DATA) data,public env:EnvService) {
    this.viewObject = {
      title: 0, desc: 0, alertbutton: 0,
      priority: 0, alertcolor: 0, redirectpage: 0, eventtype: 0, staticpages: 0, range: 0,
      alerttype: 0, summary: 0
    }
    this.acobj = data;
    this.plansCopy  = this.acobj.rules.map(obj => ({...obj}));
    console.log(this.plansCopy)
    this.mode = "update";
    this.acobj.mode = "update";
    this.acobj.type = data.type;
    this.smartalertvalidation = [{ type: "2", eventtype: "1", min: 0, max: 5000 },
    { type: "2", eventtype: "3", min: 0, max: 100 }, { type: "2", eventtype: "4", min: 0, max: 15 },
    { type: "2", eventtype: "5", min: 0, max: 15 }];
    this.getlanguages();
  }
  onchangeAlertType() {
    // clear view object
    this.viewObject = {
      title: 0, desc: 0, alertbutton: 0,
      priority: 0, alertcolor: 0, redirectpage: 0, eventtype: 0, staticpages: 0, range: 0,
      alerttype: 0, summary: 0
    }
    this.LoadStaticParams(this.acobj.type)
  }
  LoadStaticParams(type) {
    try {
      try {
        this.pagemasters = JSON.parse(this.comm.getSession("masterconfig")).bannerpageslist;
      } catch (e) { }
      var jsonRequst = null;
      var _msgConfig = JSON.parse(this.comm.getSession("messageconfig"));
      if (_msgConfig != undefined && _msgConfig.length > 0) {
        jsonRequst = _msgConfig.filter(function (element, index) {
          return (element.ALERTTYPE === type);
        });
        if (jsonRequst.length > 0) {
          jsonRequst = jsonRequst[0];
          for (var i = 0; i < jsonRequst.LANGPARAMS.length; i++) {
            switch (jsonRequst.LANGPARAMS[i].APIKEY.toLowerCase()) {
              case "title": {
                this.viewObject.title = 1;
                break;
              }
              case "desc": {
                this.viewObject.desc = 1;
                break;
              }
              case "alertbutton": {
                this.viewObject.alertbutton = 1;
                break;
              }
              case "pushmessage": {
                this.viewObject.summary = 1;
                break;
              }
            }
          }
          if (jsonRequst.STATICPARAMS != undefined && jsonRequst.STATICPARAMS.length > 0) {
            for (var i = 0; i < jsonRequst.STATICPARAMS.length; i++) {
              switch (jsonRequst.STATICPARAMS[i].APIKEY.toLowerCase()) {
                // case "eventtype": {
                //   this.viewObject.eventtype = 1;
                //   if (jsonRequst.STATICPARAMS[i].defaultvalues != null && jsonRequst.STATICPARAMS[i].defaultvalues != undefined
                //     && jsonRequst.STATICPARAMS[i].defaultvalues.length > 0) {
                //     this.eventtypeslist = jsonRequst.STATICPARAMS[i].defaultvalues;
                //   }
                //   break;
                // }
                case "pages": {
                  this.viewObject.staticpages = 1;
                  if (jsonRequst.STATICPARAMS[i].defaultvalues != null && jsonRequst.STATICPARAMS[i].defaultvalues != undefined
                    && jsonRequst.STATICPARAMS[i].defaultvalues.length > 0) {
                    this.staticpageslist = jsonRequst.STATICPARAMS[i].defaultvalues;
                  }
                  break;
                }
                case "alerttype": {
                  this.viewObject.alerttype = 1;
                  if (jsonRequst.STATICPARAMS[i].defaultvalues != null && jsonRequst.STATICPARAMS[i].defaultvalues != undefined
                    && jsonRequst.STATICPARAMS[i].defaultvalues.length > 0) {
                    this.alerttypeslist = jsonRequst.STATICPARAMS[i].defaultvalues;
                  }
                  break;
                }
                case "redirection": {
                  this.viewObject.redirectpage = 1;
                  // get data from api
                  this.redirectpageslist = [];
                  break;
                }
                case "priority": {
                  this.viewObject.priority = 1;
                  break;
                }
                case "alertcolor": {
                  this.viewObject.alertcolor = 1;
                  break;
                }
                case "maxvalue":
                case "minvalue": {
                  this.viewObject.range = 1;
                  break;
                }
              }
            }
          }
        }
      }
    } catch (e) {

    }
  }
  ngOnInit() {
    try {
      this.pagemasters = JSON.parse(this.comm.getSession("masterconfig")).bannerpageslist;
    } catch (e) { }
    //var _master = JSON.parse(this.comm.getSession("masterconfig"));
    //this.pagemasters = _master.pages;
    // let reqObj = { "search": "" };
    // this.comm.postData('pages/getpageslist', reqObj).subscribe((response: any) => {
    //   if (response.code == "200") {
    //     if (response && response.data && response.data.length > 0) {
    //       let pages = [];
    //       for (var i = 0; i < response.data.length; i++) {
    //         pages.push({ value: response.data[i].name, key: response.data[i].name });
    //       }
    //       this.pagemasters = pages;
    //     }
    //     else {
    //       this.pagemasters = [];
    //     }
    //   }
    // }, (err => {
    //   this.comm.HandleHTTPError(err);
    // }));

    var _msgConfig = this.comm.getSession("messageconfig");
    if (_msgConfig == undefined || _msgConfig.length == 0 || _msgConfig == "") {
      // get alert configurations
      try {
        this.comm.getAlertConfigurations("alertconfigurations");
      } catch (e) {
      }
    }
    this.onchangeAlertType();
    this.newlangobj=this.acobj.rules.find(x=>x.language=="id")
    if(this.newlangobj.language=="id"){
    this.lagnuages="hi"
  }
  this.newengobj=this.acobj.rules.find(x=>x.language=="en")
  console.log(this.newengobj,this.newlangobj)
  }
  close() {
    this.dialogRef.close();
  }

  submitAlertConfig() {

    
    if (!this.validatevalue(this.acobj.name, "Name is Mandatory")) { return false; }
    if (!this.validatevalue(this.acobj.type, "Please select Type")) { return false; }
    if (!this.validatevalue(this.acobj.status, "Please select Status")) { return false; }
    if (!this.validatevalue(this.newengobj.title, "Title is Mandatory")) { return false; }
    if (!this.validatevalue(this.newlangobj.title, "Title is Mandatory")) { return false; }
    if (!this.validatevalue(this.newengobj.description, "Description is Mandatory")) { return false; }
    if (!this.validatevalue(this.newlangobj.description, "Description is Mandatory")) { return false; }
    if (this.viewObject.alertcolor == 1) {
      if (!this.validatevalue(this.newengobj.alertcolor, "Alert Color is Mandatory")) { return false; }
      if (!this.validatevalue(this.newlangobj.alertcolor, "Alert Color is Mandatory")) { return false; }
    }
    if (this.viewObject.priority == 1) {
      if (!this.validatevalue(this.newengobj.position, "Priority is Mandatory")) { return false; }
      if (!this.validatevalue(this.newlangobj.position, "Priority is Mandatory")) { return false; }
    }
    if (this.viewObject.redirectpage == 1) {
      if (!this.validatevalue(this.newengobj.redirectonpage, "Redirection Page is Mandatory")) { return false; }
      if (!this.validatevalue(this.newlangobj.redirectonpage, "Redirection Page is Mandatory")) { return false; }
    }

    if (this.viewObject.range == 1) {
      if (!this.validatevalue(this.newengobj.min.toString(), "Range Min is Mandatory")) { return false; }
      if (!this.validatevalue(this.newlangobj.min.toString(), "Range Min is Mandatory")) { return false; }
      if (!this.validatevalue(this.newengobj.max.toString(), "Range Max is Mandatory")) { return false; }
      if (!this.validatevalue(this.newlangobj.max.toString(), "Range Max is Mandatory")) { return false; }
      this.newengobj.min = parseInt(this.newengobj.min);
      this.newlangobj.min = parseInt(this.newlangobj.min);
      this.newengobj.max = parseInt(this.newengobj.max);
      this.newlangobj.max = parseInt(this.newlangobj.max);
      if (this.newengobj.min > this.newengobj.max) {
        this.comm.openDialog('error', "Min value should be less than Max Value"); return false;
      }
      if (this.newlangobj.min > this.newlangobj.max) {
        this.comm.openDialog('error', "Min value should be less than Max Value"); return false;
      }
    }
    this.acobj.rules=this.acobj.rules.filter(x=>x.language!="en")
   
   
    
    this.acobj.rules.push(this.newengobj)
    console.log(this.newengobj,"en")
    if(this.removeobj){
    
     this.newlangobj.language=this.langval
      this.acobj.rules.push(this.newlangobj)
      console.log(this.newlangobj,"oldref")
    }
    else{
      if(this.lagnuages=="hi"){
        this.lagnuages="id"
      }
      this.acobj.rules=this.acobj.rules.filter(x=>x.language!=this.lagnuages)
      this.acobj.rules.push(this.newlangobj)
      console.log(this.newlangobj,"new")
    }
    
 

    let url = "alerts/managealert";
    this.comm.postData(url, this.acobj).subscribe((resp: any) => {
      if (resp.code == "200" && resp.status == "success") {
        this.comm.openDialog('success', resp.message);
        this.dialogRef.close();
      }
      else {
        this.comm.openDialog('error', resp.message);
        this.close();
      }
    }, (err => {
      this.comm.HandleHTTPError(err);
    }));

  }
  validatevalue(val: any, message: string) {
    if (val == "" || val == undefined || val == null) {
      this.comm.openDialog('error', message);
      return false;
    }
    else return true;
  }
  getlanguages() {
    

    

    this._httpobj1 = this.comm.postData('template/json ',{"type": "Circles"}).subscribe((response: any) => {
      if (response.code == "500") {
        this.comm.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response.data != null && response.status == "success") {
        
          let newlist=JSON.parse(response.data)
          this.languageList=newlist.data.languages;
      
        }
        else {
         
         
          this.comm.openSnackBar("No Records Found");
        }
      }
    }, error => {
      this.comm.HandleHTTPError(error);
    });
  };
  someMethod(value:any){
  this.langval=value;
  if(value=="hi"){
    value="id"
  }
    var filter_array = this.plansCopy.filter(x => x.language == value);
   if(filter_array.length>0){
    this.newlangobj.title=filter_array[0].title
    this.newlangobj.description=filter_array[0].description
    this.newlangobj.pushmessage=filter_array[0].pushmessage
    this.newlangobj.buttontext=filter_array[0].buttontext
    this.newlangobj.min=filter_array[0].min
    this.newlangobj.max=filter_array[0].max
    this.newlangobj.position=filter_array[0].position
    this.newlangobj.alertcolor=filter_array[0].alertcolor
   this.newlangobj.redirectonpage=filter_array[0].redirectonpage
   
   }
   else{
    this.newlangobj.title=""
    this.newlangobj.description=""
    // this.newlangobj.pushmessage=""
    this.newlangobj.buttontext=""
    // this.newlangobj.min=""
    // this.newlangobj.max=""
    this.newlangobj.position=""
    this.newlangobj.alertcolor=""
   this.newlangobj.redirectonpage=""
    this.removeobj=true;

   }
      
    }
    public ifColorDark(color: string): boolean {
      return color.indexOf('English' || 'english') !== -1;
    }
}
