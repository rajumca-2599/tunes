import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
import { EnvService } from '../../../../../shared/services/env.service';
import { CommonService } from '../../../../../shared/services/common.service';
@Component({
  selector: 'app-add-multialert',
  templateUrl: './add-multialert.component.html',
  styleUrls: ['./add-multialert.component.css']
})
export class AddMultialertComponent implements OnInit {
  public title: string = "ADD ALERT CONFIGURATIONS";
  public acobj: any;
  public mode: string = "insert";
  public alerttypeslist: any = [];
  public staticpageslist: any[];
  public viewObject: any;
  public eventtypeslist: any[];
  public redirectpageslist: any[];
  hex: any;
  public smartalertvalidation: any[];
  constructor(private comm: CommonService, private dialogRef: MatDialogRef<AddMultialertComponent>, @Inject(MAT_DIALOG_DATA) data,public env:EnvService) {
    this.viewObject = {
      title: 0, desc: 0, alertbutton: 0,
      priority: 0, alertcolor: 0, redirectpage: 0, eventtype: 0, staticpages: 0, range: 0,
      alerttype: 0
    }
    this.acobj = {
      id: "0",
      name: "",
      type: "",
      status:"1",
      alertcolor: "#dc3545",
      eng_alertheading: "",
      bah_alertheading: "",
      eng_alertdesc: "",
      bah_alertdesc: "",
      eng_act_btntxt: "",
      bah_act_btntxt: "",
      redir_page: "",
      priority: "0",
      page: "0",
      alerttype: "0",
      eventtype: "0",
      minrange: "0",
      maxrange: "0",
      mode: "insert"
    };
    if (data.mode == "update") {
      this.acobj.id = data.id;
      this.mode = "update";
      this.acobj.mode = "update";
      this.title = "EDIT ALERT CONFIGURATIONS";
      this.acobj.type = data.type;
      this.acobj.name = data.name;
      this.acobj.status = data.status;
      this.LoadStaticParams(this.acobj.type);
      this.acobj.alertcolor = data.alertcolor;
      this.acobj.eng_alertheading = data.eng_alertheading;
      this.acobj.bah_alertheading = data.bah_alertheading;
      this.acobj.eng_alertdesc = data.eng_alertdesc;
      this.acobj.bah_alertdesc = data.bah_alertdesc;
      this.acobj.eng_act_btntxt = data.eng_act_btntxt;
      this.acobj.bah_act_btntxt = data.bah_act_btntxt;
      this.acobj.redir_page = data.redir_page;
      this.acobj.priority = data.priority;
      this.acobj.page = data.page;
      this.acobj.alerttype = data.alerttype;
      this.acobj.eventtype = data.eventtype;
      this.acobj.minrange = data.minrange;
      this.acobj.maxrange = data.maxrange;
      
    }

    /* define smart alert min-max validation  */

    this.smartalertvalidation = [{ type: "2", eventtype: "1", min: 0, max: 5000 },
    { type: "2", eventtype: "3", min: 0, max: 100 }, { type: "2", eventtype: "4", min: 0, max: 15 },
    { type: "2", eventtype: "5", min: 0, max: 15 }];
  }
  onchangeAlertType() {
    // clear view object
    this.viewObject = {
      title: 0, desc: 0, alertbutton: 0,
      priority: 0, alertcolor: 0, redirectpage: 0, eventtype: 0, staticpages: 0, range: 0,
      alerttype: 0
    }
    this.LoadStaticParams(this.acobj.type)
  }
  LoadStaticParams(type) {
    try {
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
            }
          }
          if (jsonRequst.STATICPARAMS != undefined && jsonRequst.STATICPARAMS.length > 0) {
            for (var i = 0; i < jsonRequst.STATICPARAMS.length; i++) {
              switch (jsonRequst.STATICPARAMS[i].APIKEY.toLowerCase()) {
                case "eventtype": {
                  this.viewObject.eventtype = 1;
                  if (jsonRequst.STATICPARAMS[i].defaultvalues != null && jsonRequst.STATICPARAMS[i].defaultvalues != undefined
                    && jsonRequst.STATICPARAMS[i].defaultvalues.length > 0) {
                    this.eventtypeslist = jsonRequst.STATICPARAMS[i].defaultvalues;
                  }
                  break;
                }
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
    var _msgConfig = this.comm.getSession("messageconfig");
    if (_msgConfig == undefined || _msgConfig.length == 0 || _msgConfig == "") {
      // get alert configurations
      try {
        this.comm.getAlertConfigurations("alertconfigurations");
      } catch (e) {
      }
    }
  }
  close() {
    this.dialogRef.close();
  }

  submitAlertConfig() {
    let reqObj = {
      id: this.acobj.id,
      name: this.acobj.name,
      type: this.acobj.type,
      status: this.acobj.status,
      alertcolor: this.acobj.alertcolor,
      eng_alertheading: this.acobj.eng_alertheading,
      bah_alertheading: this.acobj.bah_alertheading,
      eng_alertdesc: this.acobj.eng_alertdesc,
      bah_alertdesc: this.acobj.bah_alertdesc,
      eng_act_btntxt: this.acobj.eng_act_btntxt,
      bah_act_btntxt: this.acobj.bah_act_btntxt,
      redir_page: this.acobj.redir_page,
      priority: this.acobj.priority,
      page: this.acobj.page,
      alerttype: this.acobj.alerttype,
      eventtype: this.acobj.eventtype,
      minrange: this.acobj.minrange,
      maxrange: this.acobj.maxrange,
      mode: this.acobj.mode
    };
    console.log(reqObj);
    if (this.acobj.name == "" || this.acobj.name == undefined || this.acobj.name == null) {
      this.comm.openDialog('error', 'Alert name is required.');
      return false;
    }
    if (this.acobj.type == "" || this.acobj.type == undefined || this.acobj.type == null) {
      this.comm.openDialog('error', 'Type is required.');
      return false;
    }
    if (this.acobj.status == "" || this.acobj.status == undefined || this.acobj.status == null) {
      this.comm.openDialog('error', 'Alert status is required.');
      return false;
    }
    if (this.acobj.type == "1") { //Multi Alert
      if (this.acobj.redir_page == "" || this.acobj.redir_page == undefined || this.acobj.redir_page == "0") {
        this.comm.openDialog('error', 'Redirection page is required.');
        return false;
      }
      if (this.acobj.priority == "" || this.acobj.priority == undefined || this.acobj.priority == "0") {
        this.comm.openDialog('error', 'Priority name is required.');
        return false;
      }
      if ((this.acobj.eng_alertheading == "" || this.acobj.eng_alertheading == undefined || this.acobj.eng_alertheading == null)
        && (this.acobj.bah_alertheading == "" || this.acobj.bah_alertheading == undefined || this.acobj.bah_alertheading == null)) {
        this.comm.openDialog('error', 'Alert heading  is required.');
        return false;
      }
      if (this.acobj.alertcolor == "" || this.acobj.alertcolor == undefined || this.acobj.alertcolor == null) {
        this.comm.openDialog('error', 'Alert color is required.');
        return false;
      }
    }
    else if (this.acobj.type == "2") { //Smart Alert
      if (this.acobj.eventtype == "" || this.acobj.eventtype == undefined || this.acobj.eventtype == "0") {
        this.comm.openDialog('error', 'Event type is required.');
        return false;
      }
      if (this.acobj.priority == "" || this.acobj.priority == undefined || this.acobj.priority == "0") {
        this.comm.openDialog('error', 'Priority name is required.');
        return false;
      }
      if (this.acobj.page == "" || this.acobj.page == undefined || this.acobj.page == "0") {
        this.comm.openDialog('error', 'Page is required.');
        return false;
      }
      if (this.acobj.minrange == "" || this.acobj.minrange == undefined || this.acobj.minrange == null) {
        this.comm.openDialog('error', 'Min Range is required.');
        return false;
      }
      if (this.acobj.maxrange == "" || this.acobj.maxrange == undefined || this.acobj.maxrange == "0") {
        this.comm.openDialog('error', 'Max Range is required.');
        return false;
      }
      if (parseInt(this.acobj.maxrange) <= parseInt(this.acobj.minrange)) {
        this.comm.openDialog('error', "Min range should be lessthan max range");
        return false;
      }
      /* validate min and max range  */
      if (this.smartalertvalidation.length > 0) {
        try {
          let eventtype = this.acobj.eventtype;
          let type = this.acobj.type;
          var jsonRequst = this.smartalertvalidation.filter(function (element, index) {
            return (element.eventtype == eventtype && element.type == type);
          });
          if (jsonRequst.length > 0) {
            let min = jsonRequst[0].min;
            let max = jsonRequst[0].max;
            if ((min >= parseInt(this.acobj.maxrange)) || (max < parseInt(this.acobj.maxrange))) {
              this.comm.openDialog('error', "Min and Max will be " + min + "-" + max);
              return false;
            }
          }
        } catch (e) {

        }
      }
    }
    else if (this.acobj.type == "3") { //Pro Tip
      if (this.acobj.alerttype == "" || this.acobj.alerttype == undefined || this.acobj.alerttype == "0") {
        this.comm.openDialog('error', 'Alert type is required.');
        return false;
      }
      if (this.acobj.page == "" || this.acobj.page == undefined || this.acobj.page == "0") {
        this.comm.openDialog('error', 'Page is required.');
        return false;
      }
    }
    else if (this.acobj.type == "4") { //Tool Tips 
      if ((this.acobj.eng_alertheading == "" || this.acobj.eng_alertheading == undefined || this.acobj.eng_alertheading == null)
        && (this.acobj.bah_alertheading == "" || this.acobj.bah_alertheading == undefined || this.acobj.bah_alertheading == null)) {
        this.comm.openDialog('error', 'Alert heading  is required.');
        return false;
      }

    }
    else if (this.acobj.type == "5") { //Toast
      if (this.acobj.alerttype == "" || this.acobj.alerttype == undefined
        || this.acobj.alerttype == "0") {
        this.comm.openDialog('error', 'Alert type is required.');
        return false;
      }
      if ((this.acobj.eng_alertheading == "" || this.acobj.eng_alertheading == undefined || this.acobj.eng_alertheading == null)
        && (this.acobj.bah_alertheading == "" || this.acobj.bah_alertheading == undefined || this.acobj.bah_alertheading == null)) {
        this.comm.openDialog('error', 'Alert heading  is required.');
        return false;
      }
    }

  }
}
