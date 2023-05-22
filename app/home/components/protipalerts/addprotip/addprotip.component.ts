import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
import { CommonService } from '../../../../shared/services/common.service';

@Component({
  selector: 'app-addprotip',
  templateUrl: './addprotip.component.html',
  styleUrls: ['./addprotip.component.css']
})
export class AddprotipComponent implements OnInit {

  public title: string = "ADD ALERT CONFIGURATIONS";
  public acobj: any;
  public mode: string = "insert";
  public alerttypeslist: any = [];
  public staticpageslist: any[];
  public viewObject: any;
  public eventtypeslist: any[];
  public redirectpageslist: any[];
  pagemasters: any[] = [];

  hex: any;
  public smartalertvalidation: any[];
  constructor(private comm: CommonService, private dialogRef: MatDialogRef<AddprotipComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.viewObject = {
      title: 0, desc: 0, alertbutton: 0,
      priority: 0, alertcolor: 0, redirectpage: 0, eventtype: 0, staticpages: 0, range: 0,
      alerttype: 0, summary: 0
    }
    this.acobj = data;
    this.mode = "update";
    this.acobj.mode = "update";
    this.acobj.type = data.type;
    this.smartalertvalidation = [{ type: "2", eventtype: "1", min: 0, max: 5000 },
    { type: "2", eventtype: "3", min: 0, max: 100 }, { type: "2", eventtype: "4", min: 0, max: 15 },
    { type: "2", eventtype: "5", min: 0, max: 15 }];
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
    
    var _msgConfig = this.comm.getSession("messageconfig");
    if (_msgConfig == undefined || _msgConfig.length == 0 || _msgConfig == "") {
      // get alert configurations
      try {
        this.comm.getAlertConfigurations("alertconfigurations");
      } catch (e) {
      }
    }
    this.onchangeAlertType();
  }
  close() {
    this.dialogRef.close();
  }

  submitAlertConfig() {
    if (!this.validatevalue(this.acobj.name, "Name is Mandatory")) { return false; }
    if (!this.validatevalue(this.acobj.type, "Please select Type")) { return false; }
    if (!this.validatevalue(this.acobj.status, "Please select Status")) { return false; }
    if (!this.validatevalue(this.acobj.rules[0].title, "Title is Mandatory")) { return false; }
    if (!this.validatevalue(this.acobj.rules[1].title, "Title is Mandatory")) { return false; }
    if (!this.validatevalue(this.acobj.rules[0].description, "Description is Mandatory")) { return false; }
    if (!this.validatevalue(this.acobj.rules[1].description, "Description is Mandatory")) { return false; }
    if (this.viewObject.alertcolor == 1) {
      if (!this.validatevalue(this.acobj.rules[0].alertcolor, "Alert Color is Mandatory")) { return false; }
      if (!this.validatevalue(this.acobj.rules[1].alertcolor, "Alert Color is Mandatory")) { return false; }
    }
    if (this.viewObject.priority == 1) {
      if (!this.validatevalue(this.acobj.rules[0].position, "Priority is Mandatory")) { return false; }
      if (!this.validatevalue(this.acobj.rules[1].position, "Priority is Mandatory")) { return false; }
    }
    if (this.viewObject.redirectpage == 1) {
      if (!this.validatevalue(this.acobj.rules[0].redirectonpage, "Redirection Page is Mandatory")) { return false; }
      if (!this.validatevalue(this.acobj.rules[1].redirectonpage, "Redirection Page is Mandatory")) { return false; }
    }

    if (this.viewObject.range == 1) {
      if (!this.validatevalue(this.acobj.rules[0].min.toString(), "Range Min is Mandatory")) { return false; }
      if (!this.validatevalue(this.acobj.rules[1].min.toString(), "Range Min is Mandatory")) { return false; }
      if (!this.validatevalue(this.acobj.rules[0].max.toString(), "Range Max is Mandatory")) { return false; }
      if (!this.validatevalue(this.acobj.rules[1].max.toString(), "Range Max is Mandatory")) { return false; }
      this.acobj.rules[0].min = parseInt(this.acobj.rules[0].min);
      this.acobj.rules[1].min = parseInt(this.acobj.rules[1].min);
      this.acobj.rules[0].max = parseInt(this.acobj.rules[0].max);
      this.acobj.rules[1].max = parseInt(this.acobj.rules[1].max);
      if (this.acobj.rules[0].min > this.acobj.rules[0].max) {
        this.comm.openDialog('error', "Min value should be less than Max Value"); return false;
      }
      if (this.acobj.rules[1].min > this.acobj.rules[1].max) {
        this.comm.openDialog('error', "Min value should be less than Max Value"); return false;
      }
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
}
