import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher, MatTableDataSource, MatDialog } from "@angular/material";
import { CommonService } from '../../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { ConfirmDialogComponent } from '../../../../../shared/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-addspinmaster',
  templateUrl: './addspinmaster.component.html',
  styleUrls: ['./addspinmaster.component.css']
})
export class AddspinmasterComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public title: string = "Create Pack Master";
  public packmstrobj: any;
  public mode: string = 'insert';

  offertype: any = 1;

  private _dialog1: Subscription;
  private _httpobj1: Subscription;
  private _httpobj2: Subscription;

  selectedpack: any = "";
  selectedchannel: any = "";
  displayedColumns: string[] = ["Offertype", "Keyword", "ShortCode", "pvrid", "channel", "actions"];
  dataSource: any = new MatTableDataSource();
  showpkgbtn: Boolean = true;
  partnershow: Boolean = false;
  managemode: string = 'insert';
  mixmode: Boolean = false;
  partnerid: any = 0;
  partnerList: any = [];
  showonmixupdate: boolean = true;
  partnerName = "";
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  constructor(private comm: CommonService, private dialogRef: MatDialogRef<AddspinmasterComponent>, @Inject(MAT_DIALOG_DATA) data, private dialog: MatDialog) {
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
          this.displayedColumns = ["Offertype", "Keyword", "ShortCode", "pvrid","channel" ,"actions"];
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
            obj.pvrCode = datalist[i];
            obj.keyword = this.packmstrobj.keyword;
            obj.shortcode = this.packmstrobj.shortcode;
            obj.offertype = this.packmstrobj.offertype;
            obj.offerName = this.getoffertype(this.packmstrobj.offertype);
            obj.partnerName = this.getPartnerName(this.packmstrobj.partnerId);
            obj.channel = this.packmstrobj.channel;
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
        this.displayedColumns = ["Offertype", "keyword", "shortcode", "partnerid", "pvrCode","channel" , "actions"];
        if (data.packdata.length > 0) {
          this.managemode = 'update';
          if (data.packdata.length < 2) {
            this.showonmixupdate = true;
          }
          else
            this.showonmixupdate = false;
          data.packdata.forEach((element, index) => {
            data.packdata[index].offerName = this.getoffertype(element.offertype);
            data.packdata[index].partnerName = this.getPartnerName(element.partnerid);
          });
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
    this.userpermissions = this.comm.getpermissions("spinoffers");
    this.loadpartnerlist();
    setTimeout(() => {
      if (this.packmstrobj.offertype == '6') {
        this.partnerid = this.packmstrobj.partnerid + "";
      }
    }, 1000)
    this.getchannels();
  }
  loadpartnerlist() {
    try {
      if (this.partnerList.length == 0) {
        this.partnerList = JSON.parse(this.comm.getSession("masterconfig")).voucherspartners;
        if (this.partnerList.length > 0) {
          if (this.packmstrobj.offertype == '6' && this.packmstrobj.partnerid != "0") {
            this.partnerid = this.packmstrobj.partnerid;
          }
        }
      }
    } catch (e) { }

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
          this.dialogRef.close(resp);
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
        this.comm.openDialog("warning", 'English Name is Mandatory');
        return false;
      }
      if (this.packmstrobj.description == undefined || this.packmstrobj.description == null || this.packmstrobj.description == "") {
        this.comm.openDialog("warning", 'Bahasa Name is Mandatory');
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
  close() {
    this.dialogRef.close();
  }
  removeSplConfig(obj) {
    this.managemode = "update";
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      width: '400px',
      data: {
        message: 'Are you sure want to delete',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        let list: any = this.dataSource.data;


        let pvrid: any = [this.selectedpack];

        let req = {
          "id": obj.id !== undefined && obj.id != "" ? obj.id : this.packmstrobj.id,
          "offerid": obj.offerid !== undefined && obj.offerid != "" ? obj.offerid : this.packmstrobj.offerid,
          "keyword": obj.keyword,
          "shortcode": obj.shortcode,
          "status": 0,
          "offertype": this.offertype,
          "partnerid": this.partnerid,
          "pvrCode": obj.pvrCode,
          channel: obj.channel
        }

        let url = "spinwheel/insertoffers";
        if (this.managemode == "update")
          url = "spinwheel/updateoffers";

        this._httpobj2 = this.comm.postData(url, req).subscribe((resp: any) => {
          this.managemode = 'insert';
          this.selectedchannel = "";
          this.selectedpack = "";
          this.packmstrobj.keyword = "";
          this.packmstrobj.shortcode = "";
          if (resp.code == 200) {
            for (let i = list.length - 1; i >= 0; i--) {
              if (obj.id == list[i].id) {
                list.splice(i, 1);
                break;
              }
            }
            this.dataSource = new MatTableDataSource(list);
            this.dataSource.sort = this.sort;
            if (this.packmstrobj.offertype == '5' && list.length <= 1) {
              this.showonmixupdate = true;

            }
            if (this.packmstrobj.offertype != '5' && this.dataSource.data.length > 0) {
              this.showpkgbtn = false;
            } else
              this.showpkgbtn = true;

            this.comm.openDialog('success', resp.message);
          }
          else
            this.comm.openDialog('error', resp.message);
        }, (err => {
          this.comm.HandleHTTPError(err);
        }));
      }
    });
  }

  showhidepkgbtnfunc(req: any) {
    if (this.packmstrobj.offertype != '5' && this.dataSource.data.length > 0) {
      this.showpkgbtn = false;
    }
    else {
      this.showpkgbtn = true;
      let url = "spinwheel/insertoffers";
      if (this.managemode == "update")
        url = "spinwheel/updateoffers";

      this._httpobj2 = this.comm.postData(url, req).subscribe((resp: any) => {
        this.managemode = 'insert';

        this.selectedpack = ""; this.selectedchannel = "";
        this.packmstrobj.keyword = "";
        this.packmstrobj.shortcode = "";
        if (resp.code == 200)
          this.comm.openDialog('success', resp.message);
        else
          this.comm.openDialog('error', resp.message);
      }, (err => {
        this.comm.HandleHTTPError(err);
      }));
    }

  }
  onSubmitVoucherInfo() {
    let req = {
      "offerid": this.packmstrobj.offerid,
      "status": 1,
      "offertype": this.packmstrobj.offertype,
      "partnerid": this.partnerid,
      "keyword": '',
      "shortcode": '',
      "pvrCode": '',
      "id": this.packmstrobj.id,
      channel: this.selectedchannel
    }
    let url = "spinwheel/insertoffers";
    if (this.managemode == "update")
      url = "spinwheel/updateoffers";

    this._httpobj2 = this.comm.postData(url, req).subscribe((resp: any) => {
      if (resp.code == 200)
        this.comm.openDialog('success', resp.message);
      else
        this.comm.openDialog('error', resp.message);
      this.close();
    }, (err => {
      this.comm.HandleHTTPError(err);
    }));
  }

  onPkgSelectedChange() {
    this.managemode = "insert";
    if (this.offertype != 6 && this.packmstrobj.offertype != '6') {
      if (!this.comm.isvalidtext(this.packmstrobj.keyword, "Enter Keyword")) return;
      if (!this.comm.isvalidtext(this.packmstrobj.shortcode, "Enter Short Code")) return;
      if ((!this.comm.isvalidtext(this.selectedpack, "Enter Package Code"))) return;
      if ((!this.comm.isvalidtext(this.selectedchannel, "Enter Channel"))) return;
      if (this.selectedpack.length <= 10) {
        this.comm.openDialog('error', "Package code should be greater than 10 char");
        return;
      }
      this.selectedpack = this.selectedpack.trim();
    }

    let list: any = this.dataSource.data;
    let bool: Boolean = false;
    let obj: any = {};

    let pvrid: any = [this.selectedpack];
    if (this.packmstrobj.offertype != '5') {
      obj = {
        pvrCode: this.selectedpack,
        channel: this.selectedchannel, partnerid: this.partnerid, status: 1, pvrid: pvrid, offertype: this.offertype, keyword: this.packmstrobj.keyword, shortcode: this.packmstrobj.shortcode, offerName: this.getoffertype(this.packmstrobj.offertype), actions: '', offerid: this.packmstrobj.id == undefined || this.packmstrobj.id != "" ? this.packmstrobj.offerid : this.packmstrobj.id
      };
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
        offerid: this.packmstrobj.id == undefined && this.packmstrobj.id != "" ? this.packmstrobj.offerid : this.packmstrobj.id,
        offertype: this.offertype,
        keyword: this.packmstrobj.keyword,
        shortcode: this.packmstrobj.shortcode,
        partnerid: this.partnerid,
        pvrid: pvrid,
        partnerName: this.getPartnerName(this.partnerid),
        offerName: this.getoffertype(this.offertype),
        actions: '',
        status: 1,
        pvrCode: this.selectedpack,
        channel: this.selectedchannel
      };
      if (this.packmstrobj.offertype != 5) {
        for (let i = 0; i < list.length; i++) {
          if (this.selectedpack == list[i].pvrCode) {
            bool = true;
            break;
          }
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
          this.showhidepkgbtnfunc(obj);
          list.push(obj);
          this.dataSource = new MatTableDataSource(list);
          this.dataSource.sort = this.sort;
          this.selectedpack = ""; this.selectedchannel = "";
          this.packmstrobj.keyword = "";
          this.packmstrobj.shortcode = "";
          this.showpkgbtn = false;
          this.partnerid = 0;
          this.offertype = 1;
          if (this.packmstrobj.offertype == "6") {
            this.close();
          }
          if (list.length > 1 && this.packmstrobj.offertype == "5") {
            this.showonmixupdate = false;
          }
        } else {
          this.comm.openDialog("warning", 'Same Package already selected.');
        }
      }
    });
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
  getoffertype(status: any): string {
    switch (status + "") {
      case "1": return "DATA";
      case "2": return "VOICE";
      case "3": return "COMBO";
      case "4": return "PULSA";
      case "5": return "MIX";
      case "6": return "VOUCHER";
    }
    return "";
  }
  getPartnerName(partnerId: any): string {
    try {
      this.partnerList = JSON.parse(this.comm.getSession("masterconfig")).voucherspartners;
      if (this.partnerList.length > 0) {
        if (this.packmstrobj.offertype == 5 && partnerId > 0) {
          this.partnerName = this.partnerList.find(x => x.partnerid == partnerId).partnername;
          return this.partnerName !== "" ? this.partnerName : "";
        }
      }
    }
    catch (e) {

    }
    return "";

  }

  channelslist: any[] = []
  getchannels() {
    try {
      this.channelslist = JSON.parse(this.comm.getSession("spin_channels"));
    } catch (e) {

    }
  }

}

