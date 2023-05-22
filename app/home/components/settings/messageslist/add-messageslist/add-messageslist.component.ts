import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
import { CommonService } from '../../../../../shared/services/common.service';
import { Subscription } from 'rxjs';
import { EnvService } from '../../../../../shared/services/env.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';



@Component({
  selector: 'app-add-messageslist',
  templateUrl: './add-messageslist.component.html',
  styleUrls: ['./add-messageslist.component.css']
})
export class AddMessageslistComponent implements OnInit, OnDestroy {
  public title: string = "Manage Message";
  public msgObj: any;
  public mode: string = 'insert';
  chagevale:string="";
  messagenewlist:any;
  newmsg:string="";
  dataSource: any = new MatTableDataSource();
  private _dialog1: Subscription;
  private _httpobj1: Subscription;
  private _httpobj2: Subscription;



  public eventtypes: any = [{ name: 'Critical', value: 'critical' }, { name: 'Debug', value: 'debug' }, { name: 'Info', value: 'info' }];
  public langlist: any = [{ name: 'English', value: 'EN' }, { name: 'Bahasa', value: 'ID' }];
  constructor(private comm: CommonService, private dialogRef: MatDialogRef<AddMessageslistComponent>, @Inject(MAT_DIALOG_DATA) data,public env:EnvService) {
    this.msgObj = {
      "mode": data.mode,
      "code": data.code,
      "message": data.message,
      "messageba": data.messageba,
      "description": data.description,
      "keyword": data.keyword,
      "status": data.status,
      "module": data.module,
      "languages":data.language,
      "lagnuage1":data.lagnuage1,
      "message1":data.message1,
    }
    this.getlanguages();
    this.mode = data.mode;
    this.chagevale=data.lagnuage1;

    this.newmsg=data.message1;
    this.messagenewlist=data.message_list
    
  }
  moduleList: any = [];
  modulemasterlist: any = [];
  languageList:any=[];
  ngOnInit() {
   
    
 
    //this.loadModule();
    this.modulemasterlist = JSON.parse(this.comm.getSession("masterconfig")).moduleslist;
    let filter_array = this.messagenewlist.filter(x => x.language == "HI" || x.language == "hi");
    this.msgObj.lagnuage1=filter_array[0].language.toLowerCase();
    this.msgObj.message1=filter_array[0].message;
   
    
  }
  public ifColorDark(color: string): boolean {
    return color.indexOf('English' || 'english') !== -1;
  }
  loadModule() {
    this._httpobj1 = this.comm.getContentJSON("assets/json/moduleList.json").subscribe((resp: any) => {
      console.log(resp);
    }, err => {
      console.log(err);
    });

  }
  close() {
    this.dialogRef.close();
  }
  validate(): Boolean {
    let bool: Boolean = false;
    if (!this.msgObj.keyword || this.msgObj.keyword.trim() == "") {
      this.comm.openDialog('warning', 'Enter Message Key.'); return false;
    }
    if (!this.msgObj.code) {
      this.comm.openDialog('warning', 'Enter Message Code.'); return false;
    }
    if (!this.msgObj.module || this.msgObj.module.trim() == "") {
      this.comm.openDialog('warning', 'Enter Module.'); return false;
    }
    if (!this.msgObj.message || this.msgObj.message.trim() == "") {
      this.comm.openDialog('warning', 'Enter English Message.'); return false;
    }
    if (!this.msgObj.message1 || this.msgObj.message1.trim() == "") {
      this.comm.openDialog('warning', 'Enter  Message.'); return false;
    }
    if (!this.msgObj.lagnuage1 || this.msgObj.lagnuage1.trim() == "") {
      this.comm.openDialog('warning', 'Enter  second sceond.'); return false;
    }
    this.msgObj.description = this.comm.trimtext(this.msgObj.description);
    // if (!this.msgObj.description || this.msgObj.description.trim() == "") {
    //   this.comm.openDialog('warning', 'Enter Description.'); return false;
    // }
    return true;
  }
  someMethod(value:any){
  
  var filter_array = this.messagenewlist.filter(x => x.language == value);
 if(filter_array.length>0){
  this.msgObj.message1=filter_array[0].message;
  
 }
 else{
  this.msgObj.message1="";
 }
    
  }
   
  submitRule() {
    if (!this.validate())
      return;
    let enobj = { language: this.env.languages[0].value, message: this.msgObj.message };
    let baobj = { language: this.msgObj.lagnuage1, message: this.msgObj.message1 };
    let req = {
      "code": this.msgObj.code,
      "messageList": [enobj, baobj],
      "description": this.msgObj.description,
      "keyword": this.msgObj.keyword,
      "language": this.msgObj.language,
      "status": this.msgObj.status,
      "module": this.msgObj.module,
      "createdBy": this.comm.getUserId(),
      "modifiedBy": this.comm.getUserId()
    };

    let url = "messages/add";
    if (this.msgObj.mode == "update")
      url = "messages/update";

    this._httpobj2 = this.comm.postData(url, req).subscribe((resp: any) => {
      if (resp.code == 200)
        this.comm.openDialog('success', resp.message);
      else
        this.comm.openDialog('error', resp.message);
      this.dialogRef.close(resp);
    }, (err => {
      console.log(err);
      this.comm.HandleHTTPError(err);
    }));
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
  getlanguages() {
    this.dataSource = new MatTableDataSource([]);
    this._httpobj1 = this.comm.postData('template/json ',{"type": "Circles"}).subscribe((response: any) => {
      if (response.code == "500") {
        this.comm.openDialog("warning", response.message);
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
         
          this.comm.openSnackBar("No Records Found");
        }
      }
    }, error => {
      this.comm.HandleHTTPError(error);
    });
  };

}
