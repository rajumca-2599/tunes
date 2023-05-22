import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
import { CommonService } from '../../../../../shared/services/common.service';
import { AngularEditorConfig } from '@kolkov/angular-editor/';
import { EnvService } from '../../../../../shared/services/env.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-add-emailtemplate',
  templateUrl: './add-emailtemplate.component.html',
  styleUrls: ['./add-emailtemplate.component.css']
})
export class AddEmailtemplateComponent implements OnInit {
  public title: string = "ADD TEMPLATE";
  public etobj: any;
  chagevale:string="";
  private _httpobj1: Subscription;
  dropdnvale:any;
  langtextarea:any;
  newtemlist:any;
  plansCopy:any;
  language11:any;
  template1:any;
  description1;any;
  template11:any;
  description11:any;
  pushobjvalue:boolean=false;
  pushnewlangobj:boolean=true;
  dataSource: any = new MatTableDataSource();
  languageList:any=[];
  public mode: string = 'update';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    enableToolbar: true,
    showToolbar: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
   
    
    // defaultFontName: 'Times New Roman',
    // fonts: [
    //   { class: 'arial', name: 'Arial' },
    //   { class: 'times-new-roman', name: 'Times New Roman' },
    //   { class: 'calibri', name: 'Calibri' },
    //   { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    // ],
    // customClasses: [
    //   {
    //     name: "quote",
    //     class: "quote",
    //   },
    //   {
    //     name: 'redText',
    //     class: 'redText'
    //   },
    //   {
    //     name: "titleText",
    //     class: "titleText",
    //     tag: "h1",
    //   },
    // ]
  };
  modelobject: any;
  constructor(private comm: CommonService, private dialogRef: MatDialogRef<AddEmailtemplateComponent>, @Inject(MAT_DIALOG_DATA) data,public env:EnvService) {
    this.modelobject = data;
    this.getlanguages();
    this.etobj = {
      id: "",
      name: "",
      type: "email",
      templateInfo: [
        {
          "language": "en",
          "template": "",
          "description": ""
        },
        {
          "language": "",
          "template": "",
          "description": ""
        }
      ],
      status: "1",
      mode: "insert"
    };
    this.mode = data.mode;
    if (data.mode == "update") {
      this.mode = "update";
      this.title = "EDIT TEMPLATE (" + data.name + ")";
      this.etobj.id = data.id;
      this.etobj.name = data.name;
      this.etobj.type = data.type;
      this.etobj.templateInfo = data.templateInfo
      this.etobj.status = data.status+"";	
    }

  }

  ngOnInit() {

    this.newtemlist=this.modelobject.templateInfo;
    this.plansCopy  = this.newtemlist.map(obj => ({...obj}));
    if (this.modelobject.mode == "update") {
      this.mode = "update";
      this.title = "EDIT TEMPLATE (" + this.modelobject.name + ")";
      this.etobj.id = this.modelobject.id;
      this.etobj.name = this.modelobject.name;
      this.etobj.type = this.modelobject.type.toLowerCase();
      this.etobj.templateInfo = this.modelobject.templateInfo
      this.etobj.status = this.modelobject.status+"";
      
    }
    if(this.etobj.templateInfo.length>=2){
      let engobj=this.etobj.templateInfo.filter(x => x.language == "en")
      this.description1=engobj[0].description;
      this.template1=engobj[0].template;
      let hiobj=this.etobj.templateInfo.filter(x => x.language == "hi")
      this.description11=hiobj[0].description;
      this.template11=hiobj[0].template;
      this.language11=hiobj[0].language;
      // if(this.language11!="id" && this.language11!=undefined && this.language11!="" ){
      // let lastobj=this.etobj.templateInfo[this.etobj.templateInfo.length-1];
      // // this.langtextarea= lastobj.language;
      // this.dropdnvale= lastobj.language;
      // this.language11 = lastobj.language;
     
      // this.description11=lastobj.description;
      // this.template11=lastobj.template;
      // }
      // else{
      //   let lastobj=this.etobj.templateInfo[this.etobj.templateInfo.length-2];
      //   this.language11 = lastobj.language;
      //   this.description11=lastobj.description;
      //   this.template11=lastobj.template;
      // }
    }
    console.log(this.etobj)
 
  }
  close() {
    this.dropdnvale="";
    this.dialogRef.close();
   
  }
  public ifColorDark(color: string): boolean {
    return color.indexOf('English' || 'english') !== -1;
  }
//   someMethod(value:any){
//     var filter_array = this.plansCopy.filter(x => x.language == value);
//  if(filter_array.length>0){
//   this.etobj.templateInfo[1].language=filter_array[0].language;
//   this.etobj.templateInfo[1].template=filter_array[0].template;
//   this.etobj.templateInfo [1].description=filter_array[0].description;
//  }
//  else{
//   this.etobj.templateInfo[1].template="";
//   this.etobj.templateInfo [1].description=filter_array[0].description;
//  }
  
//  }
  submitEmailTemplate() {
    let url = "template/add";
    if (this.etobj.type == "" || this.etobj.type == undefined || this.etobj.type == null) {
      this.comm.openDialog('error', 'Template type is required.');
      return false;
    }
    if (this.etobj.name == "" || this.etobj.name == undefined || this.etobj.name == null) {
      this.comm.openDialog('error', 'Template name is required.');
      return false;
    }
    if (this.etobj.name.trim() == "") {
      this.comm.openDialog('error', 'Enter a valid Template Name.');
      return false;
    }
    if (this.description1 == "" || this.description1 == undefined || this.description1 == null) {
      this.comm.openDialog('error', 'English Description  Mandatory');
      return false;
    }
    if (this.description1.trim() == "") {
      this.comm.openDialog('error', 'Enter a valid English Descriptions');
      return false;
    }
    if (this.description11 == "" || this.description11 == undefined || this.description11 == null) {
      this.comm.openDialog('error', 'Bahasa Description Mandatory');
      return false;
    }
    if (this.description11.trim() == "") {
      this.comm.openDialog('error', 'Enter a valid Bahasa Description');
      return false;
    }
    if (this.template1 == "" || this.template1 == undefined
      || this.template1 == null) {
      this.comm.openDialog('error', 'English Template is Mandatory');
      return false;
    }
    if (this.template1.trim() == "") {
      this.comm.openDialog('error', 'Enter a valid English Template Description');
      return false;
    }
    if (this.template11 == "" || this.template11 == undefined || this.template11 == null) {
      this.comm.openDialog('error', 'Bahasa Template is Mandatory');
      return false;
    }
    if(this.template11.trim() == "") {
      this.comm.openDialog('error', 'Enter a valid Bahasa Template');
      return false;
    }
     //Changes for JIRA ID: DIGITAL-4647 on 07-09-2020
    if(this.etobj.type == "json" && !this.isJson(this.template1)){
      this.comm.openDialog('error', 'Enter a valid Json for English Template');
      return false;
    }
    if(this.etobj.type == "json" && !this.isJson(this.template11)){
      this.comm.openDialog('error', 'Enter a valid Json for Bahasa Template');
      return false;
    }
    if(this.pushnewlangobj){
      let newobj={
        "language": this.language11,
        "template": this.template11,
        "description": this.description11
      
    }
    this.etobj.templateInfo = this.etobj.templateInfo.filter(x=>x.language!=this.language11);
    this.etobj.templateInfo.push(newobj);
    // let newlag=this.etobj.templateInfo.find(x=>x.language=="en")
    this.etobj.templateInfo.find(v => v.language === "en").template = this.template1;
    this.etobj.templateInfo.find(v => v.language === "en").description1 = this.description1;

  //   this.etobj.templateInfo = this.etobj.templateInfo.filter(x=>x.language!= newlag[0].language);
  //   let engobj={
  //     "language": newlag[0].language,
  //     "template": this.template1,
  //     "description": this.description1
    
  // }
  // this.etobj.templateInfo.push(engobj);
    
    }
    if(this.pushobjvalue){
      let newobj={

        
          "language": this.language11,
          "template": this.template11,
          "description": this.description11
        
      }
      this.etobj.templateInfo.push(newobj)
    }
    let req = {
      "id": 0,
      "name": this.etobj.name,
      "type": this.etobj.type,
      "status": this.etobj.status,
      "templateInfo": this.etobj.templateInfo
    };
    if (this.mode == "update") {
      req.id = this.etobj.id;
      url = "template/update";
    }
    else {
      if (this.etobj.status != "1") {
        this.comm.openDialog('error', 'Status Should be Active');
        return false;
      }
    }
    this.comm.postData(url, req).subscribe((resp: any) => {
      if (resp.code == "500") {
        this.comm.openDialog("warning", resp.message);
      }
      else if (resp.code == "200") {
        this.comm.openDialog('success', resp.message);
      }
      // this.dialogRef.close(resp);
    }, (err => {
      console.log(err);
      this.comm.HandleHTTPError(err);
    }));
  }
  isJson(str):boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
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
       
        let angtextarea1 = this.languageList.find(x => x.id == this.language11);
        this.langtextarea=angtextarea1.title
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
changethevalue(value:any){
 
  this.langtextarea=value.title;
 
  var filter_array = this.plansCopy.filter(x => x.language == value.id);
  if(filter_array.length>0){
    this.language11=filter_array[0].language;
   this.template11=filter_array[0].template;
   this.description11=filter_array[0].description;
  }
  else{
   this.template11="";
   this.description11="";
   this.pushobjvalue=true;
   this.pushnewlangobj=false;
  }
}
}
