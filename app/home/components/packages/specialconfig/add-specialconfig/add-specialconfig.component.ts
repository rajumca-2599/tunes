import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher, MatDialog, MatTableDataSource } from "@angular/material";
import { CommonService } from '../../../../../shared/services/common.service';

import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-add-specialconfig',
  templateUrl: './add-specialconfig.component.html',
  styleUrls: ['./add-specialconfig.component.css']
})
export class AddSpecialconfigComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public title: string = "ADD SPECIAL CONFIGURATIONS";
  public aspconfig: any;
  public mode: string = "insert";
  displayedColumns: string[] = ["pvrid", "actions"];
  dataSource: any = new MatTableDataSource();
  selectedpack: any = "";
  packageList: any = [];
  public disabled: boolean = false;
  constructor(private comm: CommonService, private dialogRef: MatDialogRef<AddSpecialconfigComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.aspconfig = {
      id: 0,
      schema: '',
      home_banner_id: '',
      home_banner_en: '',
      home_banner_url_id: '',
      home_banner_url_en: '',
      UnlimitedDataBarString_id: '',
      UnlimitedDataBarString_en: '',
      UnlimitedPhoneBarString_id: '',
      UnlimitedPhoneBarString_en: '',
      UnlimitedSMSBarString_id: '',
      UnlimitedSMSBarString_en: '',
      "isDisplayUnlimitedDataCircle": false,
      "isDisplayUnlimitedPhoneCircle": false,
      "isDisplayUnlimitedSMSCircle": false,
      "isDisplayUnlimitedDataBar": false,
      "isDisplayUnlimitedPhoneBar": false,
      "isDisplayUnlimitedSMSBar": false,
      description: ''
    }
    if (data.mode == 'update') {
      this.mode = 'update';
      this.aspconfig = data;
      if (data.isDisplayUnlimitedDataCircle == 'true') {
        this.aspconfig.isDisplayUnlimitedDataCircle = true;
      } else {
        this.aspconfig.isDisplayUnlimitedDataCircle = false;
      }
      if (data.isDisplayUnlimitedPhoneCircle == 'true') {
        this.aspconfig.isDisplayUnlimitedPhoneCircle = true;
      } else {
        this.aspconfig.isDisplayUnlimitedPhoneCircle = false;
      }
      if (data.isDisplayUnlimitedSMSCircle == 'true') {
        this.aspconfig.isDisplayUnlimitedSMSCircle = true;
      } else {
        this.aspconfig.isDisplayUnlimitedSMSCircle = false;
      }
      if (data.isDisplayUnlimitedDataBar == 'true') {
        this.aspconfig.isDisplayUnlimitedDataBar = true;
      } else {
        this.aspconfig.isDisplayUnlimitedDataBar = false;
      }
      if (data.isDisplayUnlimitedPhoneBar == 'true') {
        this.aspconfig.isDisplayUnlimitedPhoneBar = true;
      } else {
        this.aspconfig.isDisplayUnlimitedPhoneBar = false;
      }
      if (data.isDisplayUnlimitedSMSBar == 'true') {
        this.aspconfig.isDisplayUnlimitedSMSBar = true;
      } else {
        this.aspconfig.isDisplayUnlimitedSMSBar = false;
      }
      this.title = "UPDATE SPECIAL CONFIGURATIONS";
    } else if (data.mode == 'manage') {
      this.mode = 'manage';
      this.title = "MANAGE PACKAGES";
      console.log(data)
      this.aspconfig = data;
      if (this.aspconfig != null && this.aspconfig.pvr_id != null && this.aspconfig.pvr_id != undefined && this.aspconfig.pvr_id.length > 0) {
        this.loadpackagetbl();
      }
    }

  }

  loadpackagetbl() {
    let templist: any = this.aspconfig.pvr_id;
    let list = [];
    for (let i = 0; i < templist.length; i++) {
      let obj = { pvrid: templist[i] };
      list.push(obj);
    }
    this.dataSource = new MatTableDataSource(list);
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.aspconfig = JSON.parse(JSON.stringify(this.aspconfig));
  }
  getPvrIds(strtxt) {
    let req = {
      search: strtxt
    }
    this.comm.postData('specialpackage/getpvrs', req).subscribe((response: any) => {
      if (response.code == "500" && response.status == "error") {
        this.comm.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200" && response.status.toLowerCase() == "success") {
        if (response && response.data) {
          this.packageList = response.data.pvr_id;
        }
        else {
          this.packageList = [];
        }
      }
    }, (err => { }));
  }
  close() {
    this.dialogRef.close();
  }
  submitSplConfig() {
    if (this.mode != 'manage') {
      let req = {
        "id": this.aspconfig.id,
        "schema": this.comm.trimtext(this.aspconfig.schema),
        "packageInfo": [
          {
            "home_banner": this.aspconfig.home_banner_en,
            "home_banner_url": this.aspconfig.home_banner_url_en,
            "UnlimitedDataBarString": this.aspconfig.UnlimitedDataBarString_en,
            "UnlimitedPhoneBarString": this.aspconfig.UnlimitedPhoneBarString_en,
            "UnlimitedSMSBarString": this.aspconfig.UnlimitedSMSBarString_en,
            "isDisplayUnlimitedDataCircle": this.aspconfig.isDisplayUnlimitedDataCircle,
            "isDisplayUnlimitedPhoneCircle": this.aspconfig.isDisplayUnlimitedPhoneCircle,
            "isDisplayUnlimitedSMSCircle": this.aspconfig.isDisplayUnlimitedSMSCircle,
            "isDisplayUnlimitedDataBar": this.aspconfig.isDisplayUnlimitedDataBar,
            "isDisplayUnlimitedPhoneBar": this.aspconfig.isDisplayUnlimitedPhoneBar,
            "isDisplayUnlimitedSMSBar": this.aspconfig.isDisplayUnlimitedSMSBar,
            "description": this.aspconfig.description,
            "language": "en"
          },
          {
            "home_banner": this.aspconfig.home_banner_id,
            "home_banner_url": this.aspconfig.home_banner_url_id,
            "UnlimitedDataBarString": this.aspconfig.UnlimitedDataBarString_id,
            "UnlimitedPhoneBarString": this.aspconfig.UnlimitedPhoneBarString_id,
            "UnlimitedSMSBarString": this.aspconfig.UnlimitedSMSBarString_id,
            "isDisplayUnlimitedDataCircle": this.aspconfig.isDisplayUnlimitedDataCircle,
            "isDisplayUnlimitedPhoneCircle": this.aspconfig.isDisplayUnlimitedPhoneCircle,
            "isDisplayUnlimitedSMSCircle": this.aspconfig.isDisplayUnlimitedSMSCircle,
            "isDisplayUnlimitedDataBar": this.aspconfig.isDisplayUnlimitedDataBar,
            "isDisplayUnlimitedPhoneBar": this.aspconfig.isDisplayUnlimitedPhoneBar,
            "isDisplayUnlimitedSMSBar": this.aspconfig.isDisplayUnlimitedSMSBar,
            "description": this.aspconfig.description,
            "language": "id"
          }
        ]
      }
      if (!this.validaterules()) {
        return;
      }
      if (this.mode == 'insert' || this.mode == 'update') {
        let url = "specialpackage/add";

        this.comm.postData(url, req).subscribe((resp: any) => {
          if (resp.code == "200")
            this.comm.openDialog('success', resp.message);
          else
            this.comm.openDialog('error', resp.message);
          this.dialogRef.close(resp);
        }, (err => {
          this.comm.HandleHTTPError(err);
        }));
      }
    } else if (this.mode == 'manage') {
      let templist = this.dataSource.data;
      let list = [];
      for (let i = 0; i < templist.length; i++) {
        list.push(templist[i].pvrid);
      }
      if (list.length > 0) {
        let url = 'specialpackage/addpvr';
        let req = {
          id: this.aspconfig.id,
          pvr_id: list
        }
        this.comm.postData(url, req).subscribe((resp: any) => {
          if (resp.code == "200")
            this.comm.openDialog('success', resp.message);
          else
            this.comm.openDialog('error', resp.message);
          this.dialogRef.close(resp);
        }, (err => {
          this.comm.HandleHTTPError(err);
        }));
      } else {
        this.comm.openDialog('warning', 'Add atlest one Package.');
      }
    }
  }
  onPkgSelectedChange() {
    if (!this.comm.isvalidtext(this.selectedpack, "Package Code Mandatory")) return;
    this.selectedpack = this.selectedpack.trim();
    if (this.selectedpack.split('|').length != 6 || this.selectedpack.indexOf(" ") != -1) {
      this.comm.openDialog('warning', 'Package is not in valid format, should contain |'); return
    }
    let list: any = this.dataSource.data;
    let bool: Boolean = false;
    let obj = { pvrid: this.selectedpack };
    for (let i = 0; i < list.length; i++) {
      if (this.selectedpack == list[i].pvrid) {
        bool = true;
        break;
      }
    }
    if (!bool) {
      list.push(obj);
      this.dataSource = new MatTableDataSource(list);
      this.dataSource.sort = this.sort;
      this.selectedpack = "";
    } else {
      this.comm.openDialog("warning", 'Same Package already selected.');
    }
  }
  removeSplConfig(obj) {
    let list: any = this.dataSource.data;
    for (let i = list.length - 1; i >= 0; i--) {
      if (obj.pvrid == list[i].pvrid) {
        list.splice(i, 1);
        break;
      }
    }
    this.dataSource = new MatTableDataSource(list);
    this.dataSource.sort = this.sort;
  }
  public removed(value: any): void {
    console.log(value);
  }

  public typed(value: any): void {
    console.log(value);
    if (value.length > 0) {
      this.getPvrIds(value);
    }
    else {
      this.packageList = [];
    }
  }
  public refreshValue(value: any): void {
    console.log(value);
  }
  validaterules(): Boolean {

    if (!this.validatekey(this.aspconfig.schema, "Enter Schema Title")) { return false; }
    if (!this.comm.isvalidtext(this.aspconfig.schema, "Enter Valid Schema Title")) { return false; }

    if (this.validatekey(this.aspconfig.home_banner_en, null)) { 
        if (!this.comm.isvalidhttpurl(this.aspconfig.home_banner_en)) {
          this.comm.openDialog("warning", 'Invalid English Image URL'); return false;
        }
      }

    if (this.validatekey(this.aspconfig.home_banner_id, null)) { 
      if (!this.comm.isvalidhttpurl(this.aspconfig.home_banner_id)) {
        this.comm.openDialog("warning", 'Invalid Bahasa Image URL'); return false;
      }
    }

    if (this.validatekey(this.aspconfig.home_banner_url_en, null)) {
      if (!this.comm.isvalidhttpurl(this.aspconfig.home_banner_url_en)) {
        this.comm.openDialog("warning", 'Invalid English Externl Url'); return false;
      }
    }

    if (this.validatekey(this.aspconfig.home_banner_url_id, null)) { 
      if (!this.comm.isvalidhttpurl(this.aspconfig.home_banner_url_id)) {
        this.comm.openDialog("warning", 'Invalid Bahasa Externl Url'); return false;
      }
    }

    if (this.validatekey(this.aspconfig.UnlimitedDataBarString_en, null)) { 
      if (!this.comm.isvalidtext(this.aspconfig.UnlimitedDataBarString_en, "Enter Valid English Unlimited Data Text")) { return false; }
    }

    if (this.validatekey(this.aspconfig.UnlimitedDataBarString_id, null)) { 
      if (!this.comm.isvalidtext(this.aspconfig.UnlimitedDataBarString_id, "Enter Valid Bahasa Unlimited Data Text")) { return false; }
    }
    
    if (this.validatekey(this.aspconfig.UnlimitedPhoneBarString_en, null )) { 
      if (!this.comm.isvalidtext(this.aspconfig.UnlimitedPhoneBarString_en, "Enter Valid English Unlimited Phone Text")) { return false; }
    }

    if (this.validatekey(this.aspconfig.UnlimitedPhoneBarString_id, null)) { 
      if (!this.comm.isvalidtext(this.aspconfig.UnlimitedPhoneBarString_id, "Enter Valid Bahasa Unlimited Phone Text")) { return false; }
    }
    
    if (this.validatekey(this.aspconfig.UnlimitedSMSBarString_en, null)) { 
      if (!this.comm.isvalidtext(this.aspconfig.UnlimitedSMSBarString_en, "Enter Valid English Unlimited SMS Text")) { return false; }
    }

    if (this.validatekey(this.aspconfig.UnlimitedSMSBarString_id, null)) { 
      if (!this.comm.isvalidtext(this.aspconfig.UnlimitedSMSBarString_id, "Enter Valid Bahasa Unlimited SMS Text")) { return false; }
    }
    
    return true;
  }
  validatekey(val, message) {
    if (val == "" || val == undefined || val == null) {
      if(message)
        this.comm.openDialog('error', message);
      return false;
    }
    else {
      return true;
    }
  }
  validateproduct(event: KeyboardEvent) {
    let regex: RegExp = new RegExp(/[;'\\><(){}!@#$%^&*+=~?/\\[\]\{\}^%#`"]/g);
    let specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];

    var keyCode = event.which || event.keyCode;

    if (keyCode == 9 || keyCode == 38 || keyCode == 39 || keyCode == 37 || keyCode == 40 || keyCode == 8 || keyCode == 46 || keyCode == 118) {
      return true;
    }
    if (keyCode == 13) return false;
    if (event.ctrlKey) {
      if (event.key.toLowerCase() != 'c' && event.key.toLowerCase() != 'v' && event.key.toLowerCase() != 'x') {
        event.preventDefault();
        return;
      }
    }
    else {
      if (specialKeys.indexOf(event.key) !== -1) {
        return;
      }
      let current: string = this.selectedpack;
      let next: string = current.concat(event.key);
      if (next && String(next).match(regex)) {
        return false;
      }
    }
    return true;
  }

}
