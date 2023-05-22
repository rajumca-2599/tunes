import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';
import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { round } from 'd3';
@Component({
  selector: 'app-masterassets',
  templateUrl: './masterassets.component.html',
  styleUrls: ['./masterassets.component.css']
})
export class MasterassetsComponent implements OnInit {
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  uploadtype1:string = "7";
  bannertype1:string = "7";
  uploadtype: string = "6";
  uploadtypes: any[] = [{ "id": "6", "name": "Images" },{ "id": "7", "name": "json" }];
  bannertype: string = "6";
  displayedColumns: string[] = ["images", "filename", "transid", "createdon", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public isAddOpen: any = false;
  public uploadgtrid: any = "";
  public attriObj: any;
  public searchString: any = "";
  public title: any = "";
  public resetVar: boolean = false;
  public editTransId: string = "";
  public disBool:boolean=true;
  public rbtBool:boolean=false;
  public rbtPortalValue:boolean=false
  rbtPortalimgValue:string="";
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog) {


  }
  changePage(page: number) {
    if (page) {
      this.pageObject.pageNo = page;
      this.paginator.pageIndex = (page - 1);
      this.getPage({ pageIndex: (this.pageObject.pageNo) });
    }
  }

  changePageSize(obj) {
    this.pageObject.pageNo = 0;
    this.pageObject.pageSize = obj.pageSize;
    this.getsegments();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getsegments();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getsegments();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  ngOnInit() {
    this.userpermissions = this.ccapi.getpermissions("");
    this.dataSource = new MatTableDataSource([]);
    //this.dataSource.sort = this.sort;
    this.uploadtype = "6";
    this.bannertype = "6";
    this.uploadtype1= "7";
    this.bannertype1 = "7";

    this.pageObject.totalRecords = 0;
    this.pageObject.totalPages = 0;


    this.pageObject.pageNo = 1;

    this.getsegments();
    this.uploadtype = this.uploadtype + "";
    this.uploadtype1= this.uploadtype1 + "";
  }
  getsegmentsList() {
    this.paginator.pageIndex = 0;
    this.pageObject.pageNo = 1;
    this.getsegments();
  }
  getsegments() {
    
    let start = 1;
    let objmasters = JSON.parse(this.ccapi.getSession("masterconfig"));
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      orderDir: "desc",
      search: this.searchString,
      start: start,
      length: this.pageObject.pageSize, type: this.uploadtype,
      flag:this.rbtPortalimgValue
    }
    this.ccapi.postData('files/getuploadedimages', requesrParams).toPromise().then((response: any) => {
      this.ccapi.hidehttpspinner();
      if (response.code == "500") {
        this.dataSource = new MatTableDataSource([]);
        this.pageObject.totalRecords = 0;
        this.pageObject.totalPages = 0;
        // this.dataSource.sort = this.sort;

        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.data != null && response.data.length > 0) {
          let arr = response.data;
          try {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].filename == null || arr[i].filename == undefined)
                arr[i].filename = arr[i].filepath;
              if (arr[i].createdon == null || arr[i].createdon == undefined)
                arr[i].createdon = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en-US', '');
              arr[i].physicalurl  = objmasters.imageasseturl.replace("!TID!", arr[i].transid);
              if (this.uploadtype == '7') {
                arr[i].physicalurl  = objmasters.jsonasseturl.replace("!TID!", arr[i].transid);
              }
            }
          } catch (e) { }
          this.dataSource = new MatTableDataSource(arr);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          // this.dataSource.sort = this.sort;

        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          // this.dataSource.sort = this.sort;
          this.ccapi.openSnackBar("No Records Found");
        }
      }
    }).catch((error: HttpErrorResponse) => {
      this.ccapi.HandleHTTPError(error);
    });
  };
  onchange(data1?:string) {
  
    if(data1==="drop1"){
      this.bannertype=this.uploadtype
    }
    if(this.bannertype==="6"){ 
    this.afuConfigId = {
      formatsAllowed: ".png,.jpg,.gif,.jpeg,.svg,.gif" ,
      maxSize: "2", theme: "dragNDrop",
      uploadAPI: {
        url: this.ccapi.getUrl("files/uploadFile"),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'accesskey': this.ccapi.getAccessKey(),
          "x-imi-uploadtype": this.bannertype,
          "rbtpreviewimage": this.rbtPortalValue
        }
      }
    }
  }
  else{
    this.afuConfigId1 = {
      formatsAllowed: ".json",
      maxSize: "2", theme: "dragNDrop",
      uploadAPI: {
        url: this.ccapi.getUrl("files/uploadFile"),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'accesskey': this.ccapi.getAccessKey(),
          "x-imi-uploadtype": this.bannertype1,
          "rbtpreviewimage":this.rbtPortalValue
        }
      }
    };

  }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.isAddOpen = false;
    
  }
  toggleAdd() {
    this.isAddOpen = !this.isAddOpen;
    this.isOpen = false;
    this.disBool= false;
    this.editTransId="";
  }

  afuConfigId = {
    formatsAllowed: ".png,.jpg,.gif,.jpeg,.svg,.gif",
    maxSize: "2", theme: "dragNDrop",
    uploadAPI: {
      url: this.ccapi.getUrl("files/uploadFile"),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'accesskey': this.ccapi.getAccessKey(),
        "x-imi-uploadtype": this.bannertype,
        "rbtpreviewimage":this.rbtPortalValue
      }
    }
  };
  afuConfigId1 = {
    formatsAllowed: ".json",
    maxSize: "2", theme: "dragNDrop",
    uploadAPI: {
      url: this.ccapi.getUrl("files/uploadFile"),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'accesskey': this.ccapi.getAccessKey(),
        "x-imi-uploadtype": this.bannertype1,
        "rbtpreviewimage":this.rbtPortalValue
      }
    }
  };
  DocUpload(e) {
    let res = e.response;
    let result = JSON.parse(res);
    if (result != null && result.gtrId != null && result.gtrId.length > 0) {
      this.uploadgtrid = result.gtrId;
      if(this.bannertype=="6"){
      this.afuConfigId = {
        formatsAllowed: ".png,.jpg,.gif,.jpeg,.svg,.gif",
        maxSize: "2",
        theme: "dragNDrop",
        uploadAPI: {
          url: this.ccapi.getUrl("files/uploadFile"),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'accesskey': this.ccapi.getAccessKey(),
            "x-imi-uploadtype": this.bannertype,
            "rbtpreviewimage":this.rbtPortalValue
          }
        }
      };
    }
    else{
      this.afuConfigId1 = {
        formatsAllowed: ".json",
        maxSize: "2", theme: "dragNDrop",
        uploadAPI: {
          url: this.ccapi.getUrl("files/uploadFile"),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'accesskey': this.ccapi.getAccessKey(),
            "x-imi-uploadtype": this.bannertype1,
            "rbtpreviewimage":this.rbtPortalValue
          }
        }
      };
    }
      this.getsegments();
    }
    else {
      if (result != null && result.message != null)
        this.ccapi.openDialog("warning", result.message);
      else {
        this.ccapi.openDialog("warning", "Unable to upload file.");
      }
      if(this.bannertype=="6"){
      this.afuConfigId = {
        formatsAllowed: ".png,.jpg,.gif,.jpeg,.svg,.gif",
        maxSize: "2",
        theme: "dragNDrop",
        uploadAPI: {
          url: this.ccapi.getUrl("files/uploadFile"),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'accesskey': this.ccapi.getAccessKey(),
            "x-imi-uploadtype": this.bannertype,
            "rbtpreviewimage":this.rbtPortalValue
          }
        }
      };
    }
    else{
      this.afuConfigId1 = {
        formatsAllowed: ".json",
        maxSize: "2", theme: "dragNDrop",
        uploadAPI: {
          url: this.ccapi.getUrl("files/uploadFile"),
          headers: {
            'Access-Control-Allow-Origin': '*',
            'accesskey': this.ccapi.getAccessKey(),
            "x-imi-uploadtype": this.bannertype1,
            "rbtpreviewimage":this.rbtPortalValue
          }
        }
      };
    }
    }
  }
  formheaders() {
    if(this.bannertype=="6"){
    let _hrds = {
      'Access-Control-Allow-Origin': '*',
      'accesskey': this.ccapi.getAccessKey(),
      "x-imi-uploadtype": this.bannertype + "",
      "uploadedid": this.editTransId,
      "rbtpreviewimage":this.rbtPortalValue
    }
    return _hrds;
  }
  else{
    let _hrds = {
      'Access-Control-Allow-Origin': '*',
      'accesskey': this.ccapi.getAccessKey(),
      "x-imi-uploadtype": this.bannertype1 + "",
      "uploadedid": this.editTransId,
      "rbtpreviewimage":this.rbtPortalValue
    }
    return _hrds;
  }
    
  }
  editmasterasset(row: any) {
    this.bannertype=this.uploadtype
    this.disBool=true;
    this.editTransId="";
    if (row.transid != undefined && row.transid != "") {
       this.editTransId = row.transid;
      this.isAddOpen = true;
      this.isOpen = false;
      if(this.bannertype=="6"){
      this.afuConfigId = {
        formatsAllowed: ".png,.jpg,.gif,.jpeg,.svg,.gif",
        maxSize: "2",
        theme: "dragNDrop",
        uploadAPI: {
          url: this.ccapi.getUrl("files/updateimages"),
          headers: this.formheaders()
        }
      };
    }
    else{
      this.editTransId="";
      this.bannertype=this.uploadtype
      this.disBool=true;
      this.afuConfigId1 = {
        formatsAllowed: ".json",
        maxSize: "2",
        theme: "dragNDrop",
        uploadAPI: {
          url: this.ccapi.getUrl("files/updatejson"),
          headers:  this.formheaders()
        }
      };
    }
    }
    else {
      this.ccapi.openDialog("warning", "Invalid transaction id found.");
      return;
    }
  }
  downloadfile(row: any) {
    window.open(this.ccapi.getUrl("files/downloadimage?id=" + row.transid));
    // this.ccapi.openDialog('success', "Downloading..");
  }
  getimage(row) {
    return this.ccapi.getUrl("files/downloadimage?id=" + row.transid);
  }
  getimagetid(tid) {
    return this.ccapi.getUrl("files/downloadimage?id=" + tid);
  }
  onChange(data){
    
    // if(data.checked==true){
      // this.rbtPortalValue = data.checked;
      // console.log(this.rbtPortalValue);
      this.afuConfigId.uploadAPI.headers.rbtpreviewimage=data.checked;
      this.afuConfigId1.uploadAPI.headers.rbtpreviewimage=data.checked;
          
        
      
    
      // afuConfigId = {
      //   formatsAllowed: ".png,.jpg,.gif,.jpeg,.svg,.gif",
      //   maxSize: "2", theme: "dragNDrop",
      //   uploadAPI: {
      //     url: this.ccapi.getUrl("files/uploadFile"),
      //     headers: {
      //       'Access-Control-Allow-Origin': '*',
      //       'accesskey': this.ccapi.getAccessKey(),
      //       "x-imi-uploadtype": this.bannertype,
      //       "rbtpreviewimage":this.rbtPortalValue
      //     }
      //   }
      // };
   
 }
 onChanges(data){
  if(data.checked){
    this.rbtPortalimgValue="rbtimages"
  }
    // this.afuConfigId.uploadAPI.headers.rbtpreviewimage=data.checked;
    // this.afuConfigId1.uploadAPI.headers.rbtpreviewimage=data.checked;
    else{
      this.rbtPortalimgValue=""
    }
        
      
    
  
   
 
}
}
