import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CommonService } from '../shared/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource, MatPaginator,MatBadge  } from '@angular/material';
import { EnvService } from '../shared/services/env.service';
declare var require: any;
  

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  public lang: any;
  NgxSpinnerService: any;
  badgecount: number = 0;
  currentuser: string = "";

  constructor(private _service: CommonService, private router: Router, private spinner: NgxSpinnerService,public env:EnvService) {

    if (this._service.getSession("lang") != null && this._service.getSession("lang") != undefined)
      this.lang = this._service.getSession("lang");

    this._service.setSession("lang", this.lang);

  }
  ngAfterViewInit() {
    //console.log("Home ngAfterViewInit");

  }
  masters: any = {};
  loadmasters() {
    try {
      this.masters = (this._service.getSession("masterconfig"));
      if (this.masters == null || this.masters == undefined || this.masters == "") {
        this._service.getStaticData("assets/masters.json").subscribe((resp: any) => {
          this.masters = resp;
          this._service.setSession("masterconfig", JSON.stringify(this.masters));
        });
      }
      else {
        this.masters = JSON.parse(this.masters);
      }
    } catch (e) { 
      console.log(e);
    }
  }
  menulist: any = [];
  permission: any = [];

  ngOnInit() {
    //console.log("Home");
    this.loadpermission();
    this.NoEditableRules();
    this.loadmasters();
    setTimeout(() => {
      this.loadMenus();      
    }, 2000);
    if (this._service.getSession("oauth") == null || this._service.getSession("oauth") == undefined || this._service.getSession("oauth") == "") {

      window.sessionStorage.clear();
      this.router.navigate(["/login"]);
      this.spinner.hide();
    }
    else {
      this.currentuser = this._service.getUserName();
      setTimeout(() => {
        if (location.hash == "#/home") {
          // if(this._service.getRole() =="101005")
          // this.router.navigate(["/home/protip"]);
          if (this._service.getRole() == "101003" || this._service.getRole() == "101004")
            this.router.navigate(["/home/ccare"]);
          else {
            this.router.navigate(["/home/dashboard"]);
          }
        }
      }, 10000)
    }
    this._service.showloadingpopup();
    if (this._service.getRole() == "101000" || this._service.getRole() == "101001" || this._service.getRole() == "101002") {
      this.ShowApprovalNotifications();
      setInterval(() => {
        try {
          this.ShowApprovalNotifications();
        } catch (e) { }
      }, 60000 * 5);
    }
  };
  loadMenus() {
    this.spinner.show();
    let obj = { roleId: this._service.getRole() };
    if (this._service.getSession("menuitem") != "") {
      this.menulist = JSON.parse(this._service.getSession("menuitem"));

    }
    if (this.menulist == null || this.menulist.length == 0) {
      this._service.postData("user/menu", obj).subscribe((resp: any) => {
        this.spinner.hide();
        if (resp.data) {
          this._service.setSession("menuitem", JSON.stringify(resp.data));
          this.menulist = resp.data;
          this.formpermission();
        }
        // if(this._service.getRole() =="101005")
        // this.router.navigate(["/home/protip"]);
         if (this._service.getRole() == "101003" || this._service.getRole() == "101004")
          this.router.navigate(["/home/ccare"]);
        else {
          this.router.navigate(["/home/dashboard"]);
        }

      }, (err => {
        //console.log(err);
        this.spinner.hide();
      }));
    }
    else {
      this.spinner.hide();
      this.formpermission();
    }
  }
  formpermission() {
    try {
      if (this._service.getSession("perm") != "") return;///To be removed..
      for (let i = 0; i < this.menulist.length; i++) {
        if (this.menulist[i].items != null && this.menulist[i].items.length > 0) {
          for (let j = 0; j < this.menulist[i].items.length; j++) {
            let _t1 = this.menulist[i].items[j];

            for (let k = 0; k < this.permission.length; k++) {
              if (this.permission[k].menuKey == _t1.menuKey) {
                this.permission[k].statename = _t1.url;
                break;
              }
            }
          }
        }
      }
      //console.log(this.permission);
      this._service.setSession("perm", JSON.stringify(this.permission));
    } catch (e) { }
  }
  loadpermission() {
    this.spinner.show();
    let obj = { roleId: this._service.getRole() };
    if (this._service.getSession("statepermission") != "") {
      this.permission = JSON.parse(this._service.getSession("statepermission"));

    }
    if (this.permission == null || this.permission.length == 0) {
      this._service.postData("search/rolepermissions", obj).subscribe((resp: any) => {
        this.spinner.hide();
        if (resp.data) {
          this._service.setSession("statepermission", JSON.stringify(resp.data));
          this.permission = resp.data;
          if (this._service.getSession("menuitem") != "") {
            this.formpermission();
          }
        }
      }, (err => {
        //console.log(err);
        this.spinner.hide();
      }));
    }
    else {
      this.spinner.hide();
    }
  }
  public logout() {
    this.spinner.show();
    this._service.postData("user/logout", {}).subscribe((response: any) => {
    });
    setTimeout(() => {
      this.router.navigate(["/login"]);
      window.sessionStorage.clear();
      this.spinner.hide();
    }, 1000);
  }
  ShowApprovalNotifications() {
    this._service.setSession("notifications", undefined)
    setTimeout(() => {
      this._service.approvalpending(1);
    }, 1000);
    setTimeout(() => {
      this._service.approvalpending(2);
    }, 2000);
    setTimeout(() => {
      this._service.approvalpending(3);
    }, 3000);
    setTimeout(() => {
      this._service.approvalpending(4);
    }, 4000);
    setTimeout(() => {
      this._service.approvalpending(5);
    }, 5000);
    setTimeout(() => {
      try {
        let _objarray = [];
        let _tmp = this._service.getSession("notifications");
        if (_tmp != null && _tmp != undefined && _tmp.length > 5) {
          _objarray = JSON.parse(_tmp);
          this.badgecount = _objarray.length;
        }
      } catch (e) { }
    }, 20000);
  }
  shownotify: boolean = false;
  notifyarray: any[] = []
  hidenottab() {
    this.shownotify = false;
  }
  shownotifytab() {
    this.shownotify = !this.shownotify;
    try {

      let _tmp = this._service.getSession("notifications");
      if (_tmp != null && _tmp != undefined && _tmp.length > 5) {
        this.notifyarray = JSON.parse(_tmp);
        this.badgecount = this.notifyarray.length;
      }
    } catch (e) { }
  }

  NoEditableRules() {

    let requesrParams = {
      search: ("DEFAULT_RULES_LIST"),
      filterBy: "",
      start: 1,
      length: 2,
      orderDir: "desc"
    }
    this._service.postData('globalsettings/getall', requesrParams).toPromise().then((response: any) => {
      if (response.code == "200") {
        if (response && response.data) {
          if (response.data[0] != null && response.data[0].value.length > 0) {
            let _appvers = response.data[0].value.split(',');
            this._service.setSession("default_rules_list", JSON.stringify(_appvers));
          }
        }
      }
    }).catch((error) => {
      this._service.HandleHTTPError(error);
    });
  }

}

