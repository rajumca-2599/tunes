import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
import { CommonService } from '../../../../../shared/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import { EnvService } from '../../../../../shared/services/env.service';

@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.css']
})
export class AddBannerComponent implements OnInit, OnDestroy {
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };

  public title: string = "ADD BANNER";
  public hex: any;
  public bannertypeslist: any[] = [{ id: "1", name: "Card" }, { id: "2", name: "Full" }, { id: "3", name: "Top Banner" }];
  public actiontype: any[] = [{ id: "1", name: "Internal" }, { id: "2", name: "External" }];
  public externalactiontype: any[] = [{ id: "1", name: "Webview" }, { id: "2", name: "Browser" }];
  public mode: string = 'insert';
  public subcribertypes: any[] = [{ id: "0", name: "All" }, { id: "1", name: "POSTPAID" }, { id: "2", name: "PREPAID" }, { id: "3", name: "HADOOP" }];
  public rulesdesc: any[] = [];
  dropdownList = [];
  selectedItems: any = [];
  dropdownSettings = {};
  pagemasters: any = [];
  private _dialog1: Subscription;
  private _httpobj1: Subscription;
  private _httpobj2: Subscription;
  private _httpobj3: Subscription;
  private _httpobj4: Subscription;
  multilagnuages:any;
  newreq:any;
  d = new Date();
  year = this.d.getFullYear();
  month = this.d.getMonth();
  day = this.d.getDate();
  startdate: Date = new Date(this.year, this.month, this.day, 0, 0, 0);
  enddate: Date = new Date(this.year + 2, this.month, this.day, 23, 59, 59);
   _bobj = {};
  imageName: string;
  thumbnail: string = "";
  imageNameprev: string;
  thumbnailInd: string = "";
  public bannerid: any = 0;
  public bannertype: any = 1;
  languageList:any;
  public bannerObj: any = {
    "bannerid": 0,
    "name": "",
    "type": "1",
    "startdate": this.startdate,
    "enddate": this.enddate,
    "vcrules": "",
    "mode": "insert",
    "status": 1,
    "bannerlist": [
      {
        "vclanguage": this.env.languages[0].value, "title": "", "desc": "", "uploadid": "", "actiontype": "1", "redirectpage": "", "redirectvalue": "",
        "externaltype": 1, "webviewtitle": "", "backcolor": "#0000000", "forecolor": "#0000000", "src": ""
      }, {
        "vclanguage": "", "title": "", "desc": "", "uploadid": "", "actiontype": "1", "redirectpage": "", "redirectvalue": "",
        "externaltype": 1, "webviewtitle": "", "backcolor": "#0000000", "forecolor": "#0000000", "src": ""
      }
    ]
  };
  public isview: number = 0;
  afuConfig = {
    formatsAllowed: ".jpg,.png,.gif",
    maxSize: "2", theme: "dragNDrop",
    uploadAPI: {
      url: this.comm.getUrl("files/uploadFile"),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'accesskey': this.comm.getAccessKey(),
        "x-imi-uploadtype": "1"
      }
    }
  };
  afuConfigId = {
    formatsAllowed: ".jpg,.png,.gif",
    maxSize: "2", theme: "dragNDrop",
    uploadAPI: {
      url: this.comm.getUrl("files/uploadFile"),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'accesskey': this.comm.getAccessKey(),
        "x-imi-uploadtype": "1"
      }
    }
  };
  NgxSpinnerService: any;

  constructor(private comm: CommonService, private router: Router, private activeRoute: ActivatedRoute, private spinner: NgxSpinnerService,
    public env:EnvService) {
      this.getlanguages();

  }

  gtrIdEn = '';
  gtrIdBa = '';
  DocUpload(e) {
    let res = e.response;
    let result = JSON.parse(res);
    if (result != null && result.code == "200") {
      this.comm.handleHttpUploadFileError(result);
      this.thumbnail = result.gtrId;
      this.gtrIdEn = result.gtrId;
    }
    else {
      if (result != null && result.message != null)
        this.comm.openDialog("warning", result.message);
      else {
        this.comm.openDialog("warning", "Unable to upload file.");
      }
      setTimeout(() => {
        this.afuConfig = {
          formatsAllowed: ".jpg,.png,.gif",
          maxSize: "1", theme: "dragNDrop",
          uploadAPI: {
            url: this.comm.getUrl("files/uploadFile"),
            headers: {
              'Access-Control-Allow-Origin': '*',
              'accesskey': this.comm.getAccessKey(),
              "x-imi-uploadtype": "1"
            }
          }
        };
      }, 2000);
    }
  }

  DocUploadId(e) {
    let res = e.response;
    let result = JSON.parse(res);
    if (result != null && result.code == "200") {
      this.comm.handleHttpUploadFileError(result);
      this.thumbnailInd = result.gtrId;
      this.gtrIdBa = result.gtrId;
    }
    else {
      if (result != null && result.message != null)
        this.comm.openDialog("warning", result.message);
      else {
        this.comm.openDialog("warning", "Unable to upload file.");
      }
      setTimeout(() => {
        this.afuConfigId = {
          formatsAllowed: ".jpg,.png,.gif",
          maxSize: "2", theme: "dragNDrop",
          uploadAPI: {
            url: this.comm.getUrl("files/uploadFile"),
            headers: {
              'Access-Control-Allow-Origin': '*',
              'accesskey': this.comm.getAccessKey(),
              "x-imi-uploadtype": "1"
            }
          }
        };
      }, 2000)
    }
  }
  getpages() {

    try {
      this.pagemasters = JSON.parse(this.comm.getSession("masterconfig")).bannerpageslist;
    } catch (e) { }
    // let reqObj = { "search": "" };
    // this._httpobj1 = this.comm.postData('pages/getpageslist', reqObj).subscribe((response: any) => {
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
  }
  ngOnInit() {
    this.userpermissions = this.comm.getpermissions("bannergrouping");

    var _master = JSON.parse(this.comm.getSession("masterconfig"));
    // this.pagemasters = _master.pages;
    this.getpages();
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'ruleid',
      textField: 'ruleid',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 7,
      allowSearchFilter: true
    };
    this.loadRules();
    this.bannerid = this.activeRoute.snapshot.params['id'];
    this.isview = this.activeRoute.snapshot.params['isview'];
    if (this.isview == null || this.isview == undefined)
      this.isview = 0;
    //console.log("userid: " + this.bannerid);
    if (this.bannerid != null && this.bannerid != undefined && this.bannerid != "" && this.bannerid.length > 0) {
      this.bannertype = this.activeRoute.snapshot.params['type'] + "";
      this.loadbannerdetails();
      this.mode = "update";
      if (this.userpermissions.edit == 0) {
        this.router.navigate(["/home/error405"]);
      }
    }
    else {
      if (this.userpermissions.add == 0) {
        this.router.navigate(["/home/error405"]);
      }
    }

  };

  loadRules() {
    let requesrParams = {
      orderDir: "desc",
      name: "",
      start: 1,
      length: 100,
      "status": 1
    }
    var _temp = this.comm.getSession("ruleslist");
    if (_temp != null && _temp != undefined && _temp != "") {
      this.dropdownList = JSON.parse(this.comm.getSession("ruleslist"));
    }
    if (this.dropdownList == null || this.dropdownList == undefined || this.dropdownList.length == 0) {
      this._httpobj2 = this.comm.postData('rules/listrules', requesrParams).subscribe((response: any) => {
        if (response.code == "500") {
          // this.comm.openDialog("warning", response.message);
          var _arry = [
            {
              "id": 0,
              "ruleid": "all",
              "rule_id": "all"
            }
          ]
          this.selectedItems = [];
          this.dropdownList = _arry;
          this.comm.setSession("ruleslist", JSON.stringify(this.dropdownList));
          // return;
        }
        else if (response.code == "200") {
          let arr = response.rules;
          for (let i = 0; i < arr.length; i++) {
            arr[i].id = i;
          }
          this.selectedItems = [];
          this.dropdownList = arr;
          this.comm.setSession("ruleslist", JSON.stringify(this.dropdownList));
          //console.log(this.dropdownList);
        }
      }, (err => {
        try {
          var _arry = [
            {
              "id": 0,
              "ruleid": "all",
              "rule_id": "all"
            }
          ]
          this.selectedItems = [];
          this.dropdownList = _arry;
          this.comm.setSession("ruleslist", JSON.stringify(this.dropdownList));
        } catch (e) { }
        this.comm.HandleHTTPError(err);
      })

      );
    }
  };
  onItemSelect(item: any) {
    //console.log(item);
  }
  onSelectAll(items: any) {
    // console.log(items);

  }
  close() {
    this.router.navigate(['home/banner']);
  }
  formatDateTime(dt: Date): string {
    let str = "";
    str = dt.getFullYear() + '-' + dt.getMonth() + '-' + dt.getDay() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
    //console.log(str);
    return str;
  }
  submitBanner() {
    // let newvclang=this.bannerObj.bannerlist.filter(x=>x.vclanguage!="en")
    // this.multilagnuages=newvclang[0]
    this.bannerObj.bannerlist[1].vclanguage=this.multilagnuages
    let req1 = {
      bannerid: 0,
      "vcname": this.bannerObj.name,
      "title": this.bannerObj.name,
      "siwfstatus": 0,
      "status": 1,
      "type": this.bannerObj.type,
      "startdate": formatDate(this.startdate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''), // this.formatDateTime(this.startdate),
      "enddate": formatDate(this.enddate, 'yyyy-MM-dd HH:mm:ss', 'en-US', ''),//this.formatDateTime(this.enddate),
      "vcrules": this.selectedItems,
      "description": this.bannerObj.description,
      "bannerDetailsMap": this.bannerObj.bannerlist
    };
    let files: any = [];
    if (this.thumbnail != null && this.thumbnail != undefined && this.thumbnail.length > 0) {
      req1.bannerDetailsMap[0].uploadid = this.thumbnail;
      req1.bannerDetailsMap[0].src = '';
    }
    if (this.thumbnailInd != null && this.thumbnailInd != undefined && this.thumbnailInd.length > 0) {
      req1.bannerDetailsMap[1].uploadid = this.thumbnailInd;
      req1.bannerDetailsMap[1].src = '';
    }
    try {
      if (this.bannerObj.mode == "update") {
        if (req1.bannerDetailsMap[1].src == null || req1.bannerDetailsMap[1].src == undefined)
          req1.bannerDetailsMap[1].src = "";
        if (req1.bannerDetailsMap[0].src == null || req1.bannerDetailsMap[0].src == undefined)
          req1.bannerDetailsMap[0].src = "";
      }
    } catch (e) { }
    var valid = this.validatebanner();
    if (valid) {
      let url = "banners/bannercreation";
      if (this.bannerObj.mode == "update") {
        url = "banners/managebanner";
        req1.bannerid = this.bannerid;
        req1.type = this.bannertype;
        req1.status = this.bannerObj.status;


      }
      this._httpobj3 = this.comm.postData(url, req1).subscribe((resp: any) => {
        if (resp.code == "200" && resp.status == "success") {
          this.comm.openDialog('success', resp.message);
          this.router.navigate(['home/banner']);
        }
        else {
          this.comm.openDialog('error', resp.message);
          // this.close();
        }
      }, (err => {
        this.comm.HandleHTTPError(err);
      }));
    }
  }
  istextValid(txt) {
    try {
      if (txt == null || txt == undefined || txt == "" || txt.trim() == "") return true;
    } catch (e) { }
    return false;
  }
  validatebanner() {
   

    if (this.istextValid(this.bannerObj.name)) {
      this.comm.openDialog('warning', 'Enter Banner Name.'); return false;
    }
    if (this.bannerObj.name.trim().length < 4) {
      this.comm.openDialog('warning', 'Banner Name should be minumum 4 characters'); return false;
    }
    if (this.istextValid(this.bannerObj.type)) {
      this.comm.openDialog('warning', 'Select Banner Type.'); return false;
    }
    if (this.selectedItems == null || this.selectedItems == undefined || this.selectedItems.length == 0) {
      this.comm.openDialog('warning', 'Select Banner Rule.'); return false;
    }
    if (this.istextValid(this.bannerObj.bannerlist[0].title)) {
      this.comm.openDialog('warning', 'Enter ' +this.env.languages[0].key+' Title.'); return false;
    }
    if (this.istextValid(this.bannerObj.bannerlist[1].title)) {
      this.comm.openDialog('warning', 'Enter ' +this.env.languages[1].key+' Title.'); return false;
    }
    if (this.istextValid(this.multilagnuages)) {
      this.comm.openDialog('warning', 'Select Language Type '); return false;
    }


    if (this.bannerObj.bannerlist[0].uploadid == null || this.bannerObj.bannerlist[0].uploadid == undefined ||
      this.bannerObj.bannerlist[0].uploadid == "") {
      this.comm.openDialog('warning', 'Upload ' +this.env.languages[0].key+' Banner'); return false;
    }
    if (this.bannerObj.bannerlist[1].uploadid == null || this.bannerObj.bannerlist[1].uploadid == undefined
      || this.bannerObj.bannerlist[1].uploadid == "") {
      this.comm.openDialog('warning', 'Upload ' +this.env.languages[1].key+' Banner'); return false;
    }



    if (this.bannerObj.bannerlist[0].actiontype == "1") {
      if (this.istextValid(this.bannerObj.bannerlist[0].redirectpage)) {
        this.comm.openDialog('warning', 'Select ' +this.env.languages[0].key+' Internal Redirection Page'); return false;
      }
    }
    if (this.bannerObj.bannerlist[1].actiontype == "1") {
      if (this.istextValid(this.bannerObj.bannerlist[1].redirectpage)) {
        this.comm.openDialog('warning', 'Select ' +this.env.languages[1].key+' Internal Redirection Page'); return false;
      }
    }


    if (this.bannerObj.bannerlist[0].actiontype == "2") {
      if (!this.comm.isvalidhttpurl((this.bannerObj.bannerlist[0].redirectvalue))) {
        this.comm.openDialog('warning', 'Invalid ' +this.env.languages[0].key+' External Url'); return false;
      }
      if (!this.comm.isvalidhttpurl((this.bannerObj.bannerlist[1].redirectvalue))) {
        this.comm.openDialog('warning', 'Invalid ' +this.env.languages[1].key+' External Url'); return false;
      }
      if (this.bannerObj.bannerlist[0].externaltype == "1" && this.istextValid((this.bannerObj.bannerlist[0].webviewtitle))) {
        this.comm.openDialog('warning', 'Enter ' +this.env.languages[0].key+' Web View Title'); return false;
      }
    }
    if (this.bannerObj.bannerlist[1].actiontype == "2") {
      if (this.bannerObj.bannerlist[1].externaltype == "1" && this.istextValid((this.bannerObj.bannerlist[1].webviewtitle))) {
        this.comm.openDialog('warning', 'Enter ' +this.env.languages[1].key+' Web View Title'); return false;
      }
    }

    if (this.bannerObj.bannerlist[0].actiontype == "2") {
      if (this.bannerObj.bannerlist[0].externaltype == "1" && this.istextValid(this.bannerObj.bannerlist[0].backcolor)) {
        this.comm.openDialog('warning', 'Enter ' +this.env.languages[0].key+' Back Color'); return false;
      }
    }
    if (this.bannerObj.bannerlist[1].actiontype == "2") {
      if (this.bannerObj.bannerlist[1].externaltype == "1" && this.istextValid(this.bannerObj.bannerlist[1].backcolor)) {
        this.comm.openDialog('warning', 'Enter ' +this.env.languages[1].key+' Back Color'); return false;
      }
    }


    if (this.bannerObj.bannerlist[0].actiontype == "2") {
      if (this.bannerObj.bannerlist[0].externaltype == "1" && this.istextValid(this.bannerObj.bannerlist[0].forecolor)) {
        this.comm.openDialog('warning', 'Enter ' +this.env.languages[0].key+' Fore Color'); return false;
      }
    }
    if (this.bannerObj.bannerlist[1].actiontype == "2") {
      if (this.bannerObj.bannerlist[1].externaltype == "1" && this.istextValid(this.bannerObj.bannerlist[1].forecolor)) {
        this.comm.openDialog('warning', 'Enter ' +this.env.languages[1].key+' Fore Color'); return false;
      }
    }
    if (this.startdate > this.enddate) {
      this.comm.openDialog('warning', 'Start Date should be less than End Date '); return false;
    }

    return true;
  }
  readURL(event): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.imageName = event.target.files[0].name

      const reader = new FileReader();
      reader.onload = e => this.thumbnail = reader.result.toString();

      reader.readAsDataURL(file);
    }
  }
  readURLprev(event): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.imageNameprev = event.target.files[0].name

      const reader = new FileReader();
      reader.onload = e => this.thumbnailInd = reader.result.toString();

      reader.readAsDataURL(file);
    }
  }

  loadbannerdetails() {
    var _objbanner = {
      "bannerid": this.bannerid
    }
    this.spinner.show();
    this._httpobj4 = this.comm.postData("banners/getbannersbyid", _objbanner).subscribe((resp: any) => {
      //console.log(resp);
      this.spinner.hide();
      if (resp.code == "200" && resp.banners != null && resp.banners.bannerDetailsMap != null) {
        
        var _req = resp.banners;
        this.newreq=resp.banners.bannerDetailsMap
        let filter_array = this.newreq.filter(x => x.VCLANGUAGE == "hi");
        let langvalue= filter_array[0].VCLANGUAGE

        this.bannerObj = {
          bannerid: this.bannerid,
          "name": resp.banners.vcname,
          "type": this.bannertype + "",
          "description": resp.banners.description,
          "startdate": resp.banners.startdate,
          "enddate": resp.banners.enddate,
          "vcrules": resp.banners.vcrules,
          "status": resp.banners.status,
          "mode": "update",
          "multilagnuages":langvalue,
          "bannerlist": []
        };
        this.bannerObj.type = this.bannertype + "";
        if (this.bannerObj.startdate != '') {
          let str = this.bannerObj.startdate.substring(0, this.bannerObj.startdate.length - 2);
          let sdate: Date = new Date(str.replace("-", "/").replace("-", "/"));
          this.startdate = sdate;

          let str1 = this.bannerObj.enddate.substring(0, this.bannerObj.enddate.length - 2);
          let edate: Date = new Date(str1.replace("-", "/").replace("-", "/"));
          this.enddate = edate;

        }
        try {

          this.bannerObj.bannerlist.push(this.formbannerelement(resp.banners.bannerDetailsMap, this.env.languages[0].value));
          this.bannerObj.bannerlist.push(this.formbannerelement(resp.banners.bannerDetailsMap, this.env.languages[1].value));
          console.log(this.bannerObj.bannerlist,"12345")
          // console.log(this.dropdownList);
          if (resp.banners.vcrules != null && resp.banners.vcrules.length > 0) {
            //  console.log(this.dropdownList);
            var _tmp = resp.banners.vcrules;
            var _list: any[] = [];
            for (var i = 0; i < this.dropdownList.length; i++) {
              if (_tmp.indexOf(this.dropdownList[i].ruleid) >= 0) {
                _list.push(this.dropdownList[i].ruleid);
              }
            }
            this.selectedItems = _list;
          }
        } catch (e) { }
        try {
          this.pagemasters = JSON.parse(this.comm.getSession("masterconfig")).bannerpageslist;

        } catch (e) { }

      }
      else {
        this.spinner.hide();
        this.comm.openDialog("warning", "Details not available"); this.close();
      }
    });
  }
  formbannerelement(_objectlist, _lang) {
  
    try {
      
      for (var i = 0; i < _objectlist.length; i++) {
        var _object = _objectlist[i];
        if (_object.VCLANGUAGE.toLowerCase() == _lang.toLowerCase()) {
          {
            if (_object.ACTIONTYPE == "" || _object.ACTIONTYPE == undefined || _object.ACTIONTYPE == "") {
              _object.ACTIONTYPE = "1";
            }
            if (_object.EXTERNALTYPE == "" || _object.EXTERNALTYPE == undefined || _object.EXTERNALTYPE == "") {
              _object.EXTERNALTYPE = "1";
            }
            this._bobj = {
              "vclanguage": _lang,
              "title": _object.TITLE,
              "desc": _object.DESC,
              "uploadid": _object.UPLOADID,
              "actiontype": _object.ACTIONTYPE + "",
              "redirectpage": _object.REDIRECTPAGE + "",
              "redirectvalue": _object.REDIRECTVALUE + "",
              "externaltype": _object.EXTERNALTYPE + "",
              "webviewtitle": _object.WEBVIEWTITLE + "",
              "backcolor": _object.BACKCOLOR + "",
              "forecolor": _object.FORECOLOR + ""
            }

          }
        }
      }
    } catch (e) { }
    return this._bobj;
  }


  ngOnDestroy() {
    //console.log("destroypostdata");
    if (this._httpobj1 != null && this._httpobj1 != undefined)
      this._httpobj1.unsubscribe();
    if (this._httpobj2 != null && this._httpobj2 != undefined)
      this._httpobj2.unsubscribe();

    if (this._httpobj3 != null && this._httpobj3 != undefined)
      this._httpobj3.unsubscribe();
    if (this._httpobj4 != null && this._httpobj4 != undefined)
      this._httpobj4.unsubscribe();


    if (this._dialog1 != null && this._dialog1 != undefined)
      this._dialog1.unsubscribe();
  }
  getBannerUrlByLang(id, lang) {
    return this.comm.getBannerUrlByLang(id, lang);
  }
  onBahasaInternalRedirChange() {
    this.bannerObj.bannerlist[1].redirectvalue = this.bannerObj.bannerlist[1].redirectpage;
  }
  onEngInternalRedirChange() {
    this.bannerObj.bannerlist[0].redirectvalue = this.bannerObj.bannerlist[0].redirectpage;
  }
  getbannerdesc(pagename) {
    try {
      let _pgid = this.pagemasters.filter(x => {
        return x.value == pagename
      })
      if (_pgid != null && _pgid.length > 0) {
        return _pgid[0].desc
      }
    } catch (e) { }
    return ""
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
         let newfieldvalue=this.languageList.filter(x=>x.id=="hi")
         this.multilagnuages=newfieldvalue[0].id
        }
        else {
          
         
          this.comm.openSnackBar("No Records Found");
        }
      }
    }, error => {
      this.comm.HandleHTTPError(error);
    });
  };
  public ifColorDark(color: string): boolean {
    return color.indexOf('English' || 'english') !== -1;
  }
  someMethod(value:any){
    this.bannerObj.bannerlist[1].vclanguage=value;
    var filter_array = this.newreq.filter(x => x.VCLANGUAGE == value);
   if(filter_array.length>0){
    this.bannerObj.bannerlist[1].title=filter_array[0].TITLE
    this.bannerObj.bannerlist[1].desc=filter_array[0].DESC
    this.bannerObj.bannerlist[1].redirectpage=filter_array[0].REDIRECTPAGE
    this.bannerObj.bannerlist[1].redirectvalue=filter_array[0].REDIRECTVALUE
    // this.bannerObj.bannerlist[1].webviewtitle=filter_array[0].WEBVIEWTITLE

   }
   else{
    this.bannerObj.bannerlist[1].title=""
    this.bannerObj.bannerlist[1].desc=""
    // this.bannerObj.bannerlist[1].webviewtitle=""
    this.bannerObj.bannerlist[1].redirectpage=""
    this.bannerObj.bannerlist[1].redirectvalue=""
   }
      
    }
}
