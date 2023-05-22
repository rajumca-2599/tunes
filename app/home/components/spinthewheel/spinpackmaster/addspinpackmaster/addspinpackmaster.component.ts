import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher, MatTableDataSource, MatDialog } from "@angular/material";
import { CommonService } from '../../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { ConfirmDialogComponent } from '../../../../../shared/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-addspinpackmaster',
  templateUrl: './addspinpackmaster.component.html',
  styleUrls: ['./addspinpackmaster.component.css']
})
export class AddspinpackmasterComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public title: string = "Create Pack Master";
  public packmstrobj: any;
  public mode: string = 'insert';

  offertype: any = 1;

  private _dialog1: Subscription;
  private _httpobj1: Subscription;
  private _httpobj2: Subscription;

  selectedpack: any = "";
  displayedColumns: string[] = ["pvrid"];
  dataSource: any = new MatTableDataSource();
  showpkgbtn: Boolean = true;
  partnershow: Boolean = false;
  managemode: string = 'insert';
  mixmode: Boolean = false;
  partnerid: any = 0;
  partnerList: any = [];
  showonmixupdate: boolean = true;
  constructor(private comm: CommonService, private dialogRef: MatDialogRef<AddspinpackmasterComponent>, @Inject(MAT_DIALOG_DATA) data, private dialog: MatDialog) {
    this.packmstrobj = data;
    if (data.mode == "update") {
      this.mode = "update";
    } else if (data.mode == "manage") {
      this.mode = "manage";
      if (data.offertype != '5') {
        if (data.offertype == '6') {
          this.partnershow = true;
          this.partnerid = this.packmstrobj.partnerid + "";
          this.offertype = data.offertype;
        }
        if (data.pvrid.length > 0) {
          this.managemode = 'update';
          this.displayedColumns = ["pvrid"];
          let list = data.pvrid[0];
          let datalist = [];
          let temparr = [];
          if (list.includes(',')) {
            datalist = list.split(',');
          } else {
            datalist[0] = list;
          }
          for (let i = 0; i < datalist.length; i++) {
            let obj: any = {};
            obj.pvrid = datalist[i];
            temparr.push(obj);
          }
          this.dataSource = new MatTableDataSource(temparr);
          this.showpkgbtn = false;
        } else {
          if (data.offertype == '6') {
            this.partnershow = true;
          }
          this.dataSource = new MatTableDataSource([]);
        }
      } else {
        this.mixmode = true;
        this.displayedColumns = ["keyword", "shortcode", "partnerid", "pvrCode"];
        if (data.packdata.length > 0) {
          this.managemode = 'update';
          this.showonmixupdate = false;
          this.dataSource = new MatTableDataSource(data.packdata);
        } else {
          this.managemode = 'insert';
          this.showonmixupdate = true;
          this.dataSource = new MatTableDataSource([]);
        }
      }
    }
  }

  ngOnInit() {
    this.loadpartnerlist();
    setTimeout(() => {
      if (this.packmstrobj.offertype == '6') {
        this.partnerid = this.packmstrobj.partnerid;
      }
    }, 1000)

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

  close() {
    this.dialogRef.close();
  }



  onPkgSelectedChange() {
    if (this.offertype != 6 && this.packmstrobj.offertype != '6') {
      if (!this.comm.isvalidtext(this.selectedpack, "Enter Package Code")) return;
      this.selectedpack = this.selectedpack.trim();
      // if (this.selectedpack.split('|').length != 6 || this.selectedpack.indexOf(" ") != -1) {
      //   this.comm.openDialog('warning', 'Package is not in valid format.'); return
      // }
    }
    let list: any = this.dataSource.data;
    let bool: Boolean = false;
    let obj: any = {};
    if (this.packmstrobj.offertype != '5') {
      obj = { pvrid: this.selectedpack };
      for (let i = 0; i < list.length; i++) {
        if (this.selectedpack == list[i].pvrid) {
          bool = true;
          break;
        }
      }
    } else {
      if (list.length > 1) {
        this.showonmixupdate = false;
        this.comm.openDialog('warning', 'Only two packges can be added in the MIX Offer type.'); return
      }
      obj = {
        keyword: this.packmstrobj.keyword,
        shortcode: this.packmstrobj.shortcode,
        partnerid: this.partnerid,
        pvrCode: this.selectedpack
      };
      for (let i = 0; i < list.length; i++) {
        if (this.selectedpack == list[i].pvrCode) {
          bool = true;
          break;
        }
      }
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      width: '400px',
      data: {
        message: 'Are you sure want to Save the Package',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        if (!bool) {
          this.showhidepkgbtnfunc();
          list.push(obj);
          this.dataSource = new MatTableDataSource(list);
          this.dataSource.sort = this.sort;
          this.selectedpack = "";
          this.packmstrobj.keyword = "";
          this.packmstrobj.shortcode = "";
          if (this.packmstrobj.offertype == "6") {
            this.close();
          }
        } else {
          this.comm.openDialog("warning", 'Same Package already selected.');
        }
      }
    });


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
    this.showhidepkgbtnfunc();
  }
  showhidepkgbtnfunc() {
    if (this.packmstrobj.offertype != '5' && this.dataSource.data.length > 0) {
      this.showpkgbtn = false;
    } else {
      this.showpkgbtn = true;
      let pvrid: any = [this.selectedpack];

      let req = {
        "id": this.packmstrobj.offerid,
        "offerid": this.packmstrobj.id,
        "keyword": this.packmstrobj.keyword,
        "shortcode": this.packmstrobj.shortcode,
        "status": 1,
        "offertype": this.offertype,
        "partnerid": this.partnerid,
        "pvrid": pvrid
      }
      let url = "spinwheel/insertoffers";
      if (this.managemode == "update")
        url = "spinwheel/updateoffers";

      this._httpobj2 = this.comm.postData(url, req).subscribe((resp: any) => {
        if (resp.code == 200)
          this.comm.openDialog('success', resp.message);
        else
          this.comm.openDialog('error', resp.message);
      }, (err => {
        this.comm.HandleHTTPError(err);
      }));

    }
  }
  loadpartnerlist() {
    try {
      this.partnerList = JSON.parse(this.comm.getSession("masterconfig")).voucherspartners;
      if (this.partnerList.length > 0) {
        if (this.packmstrobj.offertype == '6' && this.packmstrobj.partnerid != "0") {
          this.partnerid = this.packmstrobj.partnerid;
        }
        else
          this.partnerid = this.partnerList[0].partnerid;
      }
    } catch (e) { }
    // this._httpobj1 = this.ccapi.getJSON("assets/json/partnerList.json").subscribe((resp: any) => {
    //   this.partnerList = resp;
    //   if(this.partnerList.length>0){
    //     this.partnerid = this.partnerList[0].partnerid;
    //   }
    // }, err => {
    //   console.log(err);
    // });

  }
  submitpackmaster() {
    if (this.validate()) {
      if (this.mode != 'manage') {
        let pvrid: any = this.dataSource.data;
        let req = {
          "id": this.packmstrobj.id,
          "name": this.packmstrobj.name,
          "description": this.packmstrobj.description,
          "status": this.packmstrobj.status,
          "imageurl": this.packmstrobj.imageurl,
          "catagory": this.packmstrobj.catagory,
          "offertype": this.packmstrobj.offertype,
          "pvrid": pvrid
        }
        let url = "spinwheel/insert";
        if (this.packmstrobj.mode == "update")
          url = "spinwheel/update";

        this._httpobj2 = this.comm.postData(url, req).subscribe((resp: any) => {
          if (resp.code == 200)
            this.comm.openDialog('success', resp.message);
          else
            this.comm.openDialog('error', resp.message);
          this.dialogRef.close();
        }, (err => {
          this.comm.HandleHTTPError(err);
        }));
      } else {
        let pvrid: any = [];
        let dsdata = this.dataSource.data;
        let str: string = '';
        for (let i = 0; i < dsdata.length; i++) {
          str += dsdata[i].pvrid;
        }
        if (str.length > 0) {
          pvrid[0] = str;
        }
        let req = {
          "id": this.packmstrobj.offerid,
          "offerid": this.packmstrobj.id,
          "keyword": this.packmstrobj.keyword,
          "shortcode": this.packmstrobj.shortcode,
          "status": 1,
          "offertype": this.packmstrobj.offertype,
          "partnerid": this.partnerid,
          "pvrid": pvrid
        }
        let url = "spinwheel/insertoffers";
        if (this.managemode == "update")
          url = "spinwheel/updateoffers";

        this._httpobj2 = this.comm.postData(url, req).subscribe((resp: any) => {
          if (resp.code == 200)
            this.comm.openDialog('success', resp.message);
          else
            this.comm.openDialog('error', resp.message);
          this.dialogRef.close();
        }, (err => {
          this.comm.HandleHTTPError(err);
        }));
      }
    }
  }
  validate(): Boolean {
    if (this.mode != 'manage') {
      if (this.packmstrobj.name == undefined || this.packmstrobj.name == null || this.packmstrobj.name == "") {
        this.comm.openDialog("warning", 'Name is Mandatory');
        return false;
      }
      if (this.packmstrobj.name.trim() == "") {
        this.comm.openDialog("warning", 'Enter a valid text in Name field');
        return false;
      }
      if (this.packmstrobj.imageurl == undefined || this.packmstrobj.imageurl == null || this.packmstrobj.imageurl == "") {
        this.comm.openDialog("warning", 'Image URL is Mandatory');
        return false;
      }
      if (!this.comm.isvalidhttpurl(this.packmstrobj.imageurl)) {
        this.comm.openDialog("warning", 'Enter a valid Image URL');
        return false;
      }
    }
    if (this.mode == 'manage') {
      if (this.packmstrobj.keyword == undefined || this.packmstrobj.keyword == null || this.packmstrobj.keyword == "") {
        this.comm.openDialog("warning", 'Keyword is Mandatory');
        return false;
      }
      if (this.packmstrobj.keyword.trim() == "") {
        this.comm.openDialog("warning", 'Enter a valid text in Keyword field');
        return false;
      }
      if (this.packmstrobj.shortcode == undefined || this.packmstrobj.shortcode == null || this.packmstrobj.shortcode == "") {
        this.comm.openDialog("warning", 'Short Code is Mandatory');
        return false;
      }
      if (this.packmstrobj.shortcode.trim() == "") {
        this.comm.openDialog("warning", 'Enter a valid text in Short Code field');
        return false;
      }
      if (this.dataSource.data.length == 0) {
        this.comm.openDialog("warning", 'Load atleast one package to submit');
        return false;
      }
    }
    return true;
  }
  ngOnDestroy() {
    console.log("destroypostdata");
    if (this._httpobj1 != null && this._httpobj1 != undefined)
      this._httpobj1.unsubscribe();
    if (this._httpobj2 != null && this._httpobj2 != undefined)
      this._httpobj2.unsubscribe();
    if (this._dialog1 != null && this._dialog1 != undefined)
      this._dialog1.unsubscribe();
  }

}
