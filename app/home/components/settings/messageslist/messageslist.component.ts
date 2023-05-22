import { Component, OnInit, NgZone, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
//import { MsgdialogueboxComponent } from '../../../../shared/msgdialoguebox/msgdialoguebox.component';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { AddMessageslistComponent } from './add-messageslist/add-messageslist.component';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { EnvService } from '../../../../shared/services/env.service';
@Component({
  selector: 'app-messageslist',
  templateUrl: './messageslist.component.html',
  animations: [
    trigger('openClose', [
      state('open', style({
        display: 'block',
        opacity: 1,
      })),
      state('closed', style({
        display: 'none',
        opacity: 0,
      })),
      transition('open => closed', [
        animate('0.4s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
    ]),
  ],
  styleUrls: ['./messageslist.component.css']
})
export class MessageslistComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ["code", "keyword", "message", "description", "module", "status"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public statuslist: any[] = [{ id: 1, name: "Active" }, { id: 0, name: "Inactive" }];
  public fstatus: any = 1;

  userpermissions: any = this.ccapi.getpermissions("");
  private _dialog1: Subscription;
  private _dialog2: Subscription;
  private _dialog3: Subscription;
  private _httpobj1: Subscription;
  private _httpobj2: Subscription;
  private _httpobj4: Subscription;
  private _httpobj3: Subscription;
  public msgObj: any;
  public searchString: any = "";
  xllength:any;
  dataForxlsheet:any;

  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog,private env:EnvService) {
  }
  changePage(page: number) {
    if (page) {
      this.pageObject.pageNo = page;
      this.paginator.pageIndex = (page - 1);
      this.getPage({ pageIndex: (this.pageObject.pageNo) });
    }
  }

  changePageSize(obj) {
    this.pageObject.pageSize = obj.pageSize;
    this.pageObject.pageNo = 0;
    this.getmessages();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getmessages();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getmessages();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.pageObject.pageNo = 1;
    this.getmessages();
  }
  getmessagesList() {
    this.pageObject.pageNo = 1;
    this.paginator.pageIndex = 0;
    this.getmessages();
  }
  getmessages() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;

    let searchString = '';
    if (this.searchString)
      searchString = this.searchString.toUpperCase();
    let requesrParams = {
      search: searchString,
      start: start,
      length: this.pageObject.pageSize,
      orderDir: "desc", status: this.fstatus
    }
    this.dataSource = new MatTableDataSource([]);
    // this.pageObject.totalRecords = 0;
    // this.pageObject.totalPages = 0;
    //this.dataSource.sort = this.sort;
    this._httpobj1 = this.ccapi.postData('messages/getall', requesrParams).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response.data != null && response.data.length > 0) {
          this.dataSource = new MatTableDataSource(response.data);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          this.dataSource.sort = this.sort;
          this.xllength=response.recordsTotal
          // this.getmessage();
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.dataSource.sort = this.sort;
          this.ccapi.openSnackBar("No Records Found");
        }
      }
    }, error => {
      this.ccapi.HandleHTTPError(error);
    });
  };


  downloadxldata() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;

    let searchString = '';
    if (this.searchString)
      searchString = this.searchString.toUpperCase();
    let requesrParams = {
      search: searchString,
      start: start,
      length: this.xllength,
      orderDir: "desc", status: this.fstatus
    }
    this.dataSource = new MatTableDataSource([]);
    // this.pageObject.totalRecords = 0;
    // this.pageObject.totalPages = 0;
    //this.dataSource.sort = this.sort;
    this._httpobj1 = this.ccapi.postData('messages/getall', requesrParams).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response.data != null && response.data.length > 0) {
          this.dataSource = new MatTableDataSource(response.data);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          this.dataSource.sort = this.sort;
          this.dataForxlsheet=response.data;
          console.log(this.dataForxlsheet)
          let newxldata=[];
          console.log(this.dataForxlsheet.messageList,"1234321234")
          for(let i=0;i<this.dataForxlsheet.length;i++){

            for(let j=0;j<this.dataForxlsheet[i].messageList.length;j++){
            let newobj={
              id:this.dataForxlsheet[i].id,
              code:this.dataForxlsheet[i].code,
              language:this.dataForxlsheet[i].messageList[j].language,
              Description:this.dataForxlsheet[i].messageList[j].description,
              module:this.dataForxlsheet[i].module,
              message:this.dataForxlsheet[i].messageList[j].message,
              keyword:this.dataForxlsheet[i].keyword,
              status:this.dataForxlsheet[i].status
            }
           newxldata.push(newobj)
          }
          }
       
          this.ccapi.exportAsExcelFile(newxldata,"message_list");
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.dataSource.sort = this.sort;
          this.ccapi.openSnackBar("No Records Found");
        }
      }
    }, error => {
      this.ccapi.HandleHTTPError(error);
    });
  };
  // downloadxldata(){
  //   this.getmessage();
    
  // }

  createMesgDialog(obj: any): void {
    
    if (obj == null && obj == undefined) {
      this.msgObj = {
        "mode": "insert",
        "code": '',
        "message": "",
        "messageba": "",
        "description": "",
        "module": "",
        "language": "EN",
        "keyword": "",
        "status": 1,
        "lagnuage1":"",
        "message1":"",
      }
      const dialogRef = this.dialog.open(AddMessageslistComponent, {
        width: '850px',
        data: this.msgObj
      });
      this._dialog1 = dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.getmessages();
        }
        console.log('The dialog was closed');
      });
    }
    else {
      let enmsg = "";
      let bamsg = "";
      let lang="";
      let lang_msg="";
      let msg_list:any;

      if (obj.messageList) {
        msg_list=obj.messageList
        for (let i = 0; i < obj.messageList.length; i++) {
          
          if (obj.messageList[i].language == 'EN' || obj.messageList[i].language == 'en') {
            enmsg = obj.messageList[i].message;
          }
            if(obj.messageList[i].language == 'HI' || obj.messageList[i].language == 'hi'){
              lang_msg = obj.messageList[i].message;
              lang=obj.messageList[i].language;
            }
           if (obj.messageList[i].language == 'ID' || obj.messageList[i].language == 'id') {
            bamsg = obj.messageList[i].message;
          }
          if(obj.messageList.length>2){
            let lastobj=obj.messageList[obj.messageList.length-1];
            lang_msg = lastobj.message;
            lang=lastobj.language;
          }
        }
      }
      this.msgObj = {
        "mode": "update",
        "code": obj.code,
        "message": enmsg,
        "messageba": bamsg,
        "description": obj.description,
        "keyword": obj.keyword,
        "language": obj.language,
        "status": obj.status,
        "module": obj.module,
        "lagnuage1":lang,
        "message1":lang_msg,
        "message_list":msg_list,
      }
      const dialogRef = this.dialog.open(AddMessageslistComponent, {
        width: '850px',
        data: this.msgObj,
      });
      this._dialog2 = dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.getmessages();
        }
        console.log('The dialog was closed');
      });

    }
  }
  loadStatus(status) {
    if (status == 1)
      return 'Active';
    else
      return 'Inactive';
  };
  deleteRule(id: number, name: string): void {
    if (id != undefined) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        width: '400px',
        data: {
          message: 'Are you sure want to delete rule (' + name + ')?',
          confirmText: 'Yes',
          cancelText: 'No'
        }
      });
      this._dialog3 = dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          this._httpobj2 = this.ccapi.postData("rules/deleterule", { ruleId: id }).subscribe((resp: any) => {
            if (resp.code == "200") {
              this.ccapi.openDialog('success', 'Rule has been deleted successfully.');
              this.getmessages();
            }
          });
        }
      });
    }
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  loadMessage(list: any): string {
    let str = '';
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].language.toLowerCase() == this.env.languages[0].value.toLowerCase()) {
          str = list[i].message;
          break;
        }
      }
    }
    return str;
  }
  loadlanguage(list: any): string {
    let str = '';
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].language.toLowerCase() == this.env.languages[0].value.toLowerCase()) {
          str = list[i].language;
          break;
        }
      }
    }
    return str;
  }

  refreshmsgs() {
    let req = { "messages": "true" }
    this._httpobj3 = this.ccapi.postData("refresh/all", req).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
        this.getmessages();
      }
      else
        this.ccapi.openDialog('warning', resp.message);
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }))
  }

  ngOnDestroy() {
    console.log("destroypostdata");
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

    if (this._dialog2 != null && this._dialog2 != undefined)
      this._dialog2.unsubscribe();

    if (this._dialog3 != null && this._dialog3 != undefined)
      this._dialog3.unsubscribe();
  }
  getStatus(status: any): string {
    if (status == "1") {
      return "Active";
    } else {
      return "Inactive";
    }
  };
}
