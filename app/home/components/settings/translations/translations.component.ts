import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSpinner, fadeInContent } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
//import { MsgdialogueboxComponent } from '../../../../shared/msgdialoguebox/msgdialoguebox.component';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';
import { EnvService } from '../../../../shared/services/env.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
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
  styleUrls: ['./translations.component.css']
})
export class TranslationsComponent implements OnInit {
  displayedColumns: string[] = ["keyword", "messageen", "messageba", "description", "actions"];
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public isAddOpen: any = false;
  keyword: any = "";
  public word: any = "";
  public searchString: any = "";
  languag: any = 1;
  public translations: any;
  description: any = "";
  private _httpobj1: Subscription;
  public id: number = 0;
  languageList:any=[];
  newlanglist:any;
  constructor(private ccapi: CommonService, private router: Router, private dialog: MatDialog,public env:EnvService) {
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
    this.getTranslations();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getTranslations();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getTranslations();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.userpermissions = this.ccapi.getpermissions("");
    this.dataSource.sort = this.sort;
    this.pageObject.pageNo = 1;
    this.getTranslations();
    this.getlanguages();
  };
  someMethod(translations:any){
  
    let lastobj=this.newlanglist.filter(x => x.language == translations)
   if(lastobj.length>0){
    this.description=lastobj[0].message;
  }
  else{
    this.description="";
  }
}
  public ifColorDark(color: string): boolean {
    return color.indexOf('English' || 'english') !== -1;
  }
  getTranslationsList() {
    this.pageObject.pageNo = 1;
    this.paginator.pageIndex = 0;
    this.getTranslations();
  }
  getTranslations() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      search: this.searchString,
      start: start,
      length: this.pageObject.pageSize,
      orderDir: "desc"
    }
    this.dataSource = new MatTableDataSource([]);
    // this.pageObject.totalRecords = 0;
    // this.pageObject.totalPages = 0;
    // this.dataSource.sort = this.sort;
    this.ccapi.postData('translator/getall', requesrParams).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response && response.data != null && response.data.length > 0) {
          let arr = response.data;
          let temparr = [];
          for (let i = 0; i < arr.length; i++) {
            let obj: any = arr[i];
            obj.language = 1;
            let msglist = arr[i].messageList;
            for (let j = 0; j < msglist.length; j++) {
              if (msglist[j].language.toLowerCase() == this.env.languages[0].value.toLowerCase()) {
                obj.messageen = msglist[j].message;
              } else if (msglist[j].language.toLowerCase() == this.env.languages[1].value.toLowerCase()) {
                obj.messageba = msglist[j].message;
              }
              if(msglist.length>2){
                let lastobj=msglist[msglist.length-1];
               obj.messageba=lastobj.language
              }
              
            }
            temparr.push(obj);
          }
          this.dataSource = new MatTableDataSource(temparr);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          this.dataSource.sort = this.sort;
          this.resetToSearch();
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.dataSource.sort = this.sort;
          this.ccapi.openSnackBar("No Records Found");
        }
      }
    });
  };

  addTranslation() {
    if (this.word.trim() == "" || this.translations.trim() == "" || this.description.trim() == "" || this.keyword.trim() == "") {
      this.ccapi.openDialog('warning', "All Fields are Mandatory");
      return;
    }
    let obj: any = {
      "messageList": [
        {
          "language": this.env.languages[0].value,
          "message": this.ccapi.trimtext(this.word)
        },
        {
          "language": this.env.languages[1].value,
          "message": this.ccapi.trimtext(this.translations)
        }
      ],
      "description": this.ccapi.trimtext(this.description),
      "keyword": this.ccapi.trimtext(this.keyword),
      "createdby": this.ccapi.getUserId()
    };

    this.ccapi.postData('translator/update', obj).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
        this.translations = ""; this.keyword = ""; this.description = ""; this.word = "";
        this.getTranslations();
      }
      else
        this.ccapi.openDialog('warning', resp.message);
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));

  };
  saveTranslation() {
  
    let obj: any = {
      "messageList": [
        {
          "language": this.env.languages[0].value,
          "message": this.ccapi.trimtext(this.word)
        },
        {
          "language":this.ccapi.trimtext(this.translations),
          "message": this.ccapi.trimtext(this.description)
        }
      ],
      "description": this.ccapi.trimtext(this.description),
      "keyword": this.keyword,
      "createdby": this.ccapi.getUserId()
    };
    if (this.word.trim() == "" || this.translations.trim() == "" || this.description.trim() == "" || this.keyword.trim() == "") {
      this.ccapi.openDialog('warning', "All Fields are Mandatory");
      return;
    }
    this.ccapi.postData('translator/update', obj).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
        this.resetToSearch();
        this.getTranslations();
      }
      else
        this.ccapi.openDialog('warning', resp.message);
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }));
  };

  resetToSearch() {
    this.isAddOpen = false;
    this.isOpen = true;
    this.id = 0;
    this.translations = "";
    this.keyword = "";
    this.description = "";
    this.word = "";
  }
  toggle() {
    this.id = 0;
    this.keyword = "";
    this.word = "";
    this.translations = "";
    this.description = "";
    this.isOpen = !this.isOpen;
    this.isAddOpen = false;
  };
  toggleadd(obj) {
  
    this.isAddOpen = !this.isAddOpen;
    this.isOpen = false;
    if (obj == undefined || obj == null) {
      this.id = 0;
      this.keyword = "";
      this.word = "";
      this.translations = "";
      this.description = "";
      this.isAddOpen = true;
    }
    else {
     
      
      this.id = obj.id;
      this.keyword = obj.keyword;
      this.word = obj.messageen;
      
      this.isAddOpen = true;
      this.newlanglist=obj.messageList;
      if(obj.messageList.length>=2){
        let lastobj=obj.messageList.filter(x => x.language == "hi")

      
        this.translations = lastobj[0].language;
        this.description=lastobj[0].message;
      }
    }

  }
  refreshTranslations() {
    let req = { "translations": "true" }
    this.ccapi.postData("refresh/all", req).subscribe((resp: any) => {
      if (resp.code == "200") {
        this.ccapi.openDialog('success', resp.message);
        this.resetToSearch();
        this.getTranslations();
      }
      else
        this.ccapi.openDialog('warning', resp.message);
    }, (err => {
      this.ccapi.HandleHTTPError(err);
    }))
  }

  getlanguages() {
    

    
    this.dataSource = new MatTableDataSource([]);
    this._httpobj1 = this.ccapi.postData('template/json ',{"type": "Circles"}).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200") {
        if (response.data != null && response.status == "success") {
        
          let newlist=JSON.parse(response.data)
          this.languageList=newlist.data.languages;
          console.log(this.languageList)
        }
        else {
          this.dataSource = new MatTableDataSource([]);
         
          this.ccapi.openSnackBar("No Records Found");
        }
      }
    }, error => {
      this.ccapi.HandleHTTPError(error);
    });
  };
}
