import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { soundwave, tree } from 'ngx-bootstrap-icons';

@Component({
  selector: 'app-personalizenametune',
  templateUrl: './personalizenametune.component.html',
  styleUrls: ['./personalizenametune.component.css']
})
export class PersonalizenametuneComponent implements OnInit {

  @Input() data: any;
  @ViewChild(ModalDirective, { static: false }) modal?: ModalDirective;
  audio: any;
  disabledbtn:boolean=false;
  messages?: string[];
  getbyidList: any;
  options: any=[];
  nortzoneOptions:any=[];
  westzoneOptions:any=[];
  seachbtn: boolean = true;
  popboolvalue: boolean = true;
  popboolvalue1: boolean = true;
  multiBannerList: any;
  nameTunevalue: string="";
  nameTunevalue1:string="";
  chackValue: string="";
  tunes: any = [];
  newZoneid:any;
  modelvalue: boolean = true;
  modelvale3: boolean = false;
  modelvalue1: boolean = true;
  modelvalue11:boolean=true;
  noresultpopup:boolean=true;
  display = 'none';
  tuneid: any;
  searchbtnvalue:boolean=true;
  modalRef?: BsModalRef;
  modalRef2?: BsModalRef;
  constructor(private ccapi: CommonService, private modalService: BsModalService) {
    this.options = [{ name: 'Hindi', value: 'Hi', checked: true },
    { name: 'Punjabi', value: 'Pu', checked: false },
    { name: 'Marathi', value: 'Ma', checked: false },
    { name: 'Gujarati', value: 'Gu', checked: false },
    { name: 'Rajasthani', value: 'Ra', checked: false },
    { name: 'Haryanvi', value: 'Ha', checked: false },
    { name: 'Himachali', value: 'Hm', checked: false }]
    this.nortzoneOptions=[{ name: 'Hindi', value: 'Hi', checked: true },
    { name: 'Punjabi', value: 'Pu', checked: false },
    { name: 'English', value: 'En', checked: false },
    { name: 'Rajasthani', value: 'Ra', checked: false },
   ]
   this.westzoneOptions=[
    { name: 'Hindi', value: 'Hi', checked: true },
    { name: 'Marathi', value: 'Ma', checked: false }, 
    { name: 'English', value: 'En', checked: false },
    {name:'Gujarati',value:'Gu',checked:false}
   
   ]
    // this.options=["Hindi"," Punjabi","Marathi","Gujarati","Rajasthani","Rajasthani","Haryanvi","Himachali"]
    // this.tunes=[
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "Srikanth",
    //     wavfileurl: "assets/images/play_black.svg"
    //   }
    // ]

  }


  ngOnInit() {

   this.newZoneid= sessionStorage.getItem("Zone_id")
   
  this.chackValue = this.options[0].value;
    if (this.data.moduleid == 101) {
      this.getbyidList = this.data
      // console.log(this.getbyidList)
      this.getbyid();
    }

    this.options.forEach((lang:any)=>{
      
    // if(lang.name=="Hindi"){
    //   this.updateCheckedOptions(lang)
    //   return;
    //   // lang.checked=true;
    // }
    })





  }
  hidepopup() {
    this.noresultpopup= false;
  }
  updateCheckedOptions(option: any) {
    // debugger;
   
    // if (option.checked == true) {
    //   this.chackValue = option.name
    // }
    // else {
    //   this.chackValue = "";
    // }
    option.checked = true

    this.chackValue = option.name
  }
  getbyid() {
    let reqbody = {
      sourceid: this.getbyidList.sourceid
    }
    this.ccapi.postData(this.getbyidList.method, reqbody).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.data != null) {
        if (response.status == "0") {
          //  console.log(response.data,typeof(response.data),response.data[0].banner_info[0].src)
          this.multiBannerList = response.data[0].banner_info[0].src

        }
        else {

          this.ccapi.openDialog("warning", response.message);
        }
      }
    }, (err => {
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));
  };
  searchnameTunes() {
    this.searchnamesonglog();
    this.seachbtn = false;
    if (this.nameTunevalue.length >= 3 && this.chackValue != "") {
      // this.popboolvalue=false;
      // $('#nametunepopup').show
      // this.searchbtnvalue=false

      let postData = {
        name: this.nameTunevalue,
        language: this.chackValue
      }
      this.ccapi.postData("/rbt/searchnametune", postData).subscribe((response: any) => {

        if (response.code == "500") {
          this.ccapi.openDialog("warning", response.message);
          return;
        }
       
          if (response.status == 0) {
            this.tunes = response.data.tunes
            if(this.tunes.length>0){
              this.tunes.forEach(function (itm: any) {
                itm.playsong = false;
              });

            }
            else{
              this.modelvalue11=false;
            this.modelvalue1 = false;
            this.noresultpopup=true;

            }
           
            //  this.showModal();

          }
          else {

           if(response==null || response.data.tunes.language==0 ||response.data.tunes.language==undefined){
            this.modelvalue11=false;
            this.modelvalue1 = false;

           }
               
             
          }
        
      }, (err => {
        console.log(err);
        this.ccapi.HandleHTTPError(err);
      }));

    }
    else {
      if (this.chackValue == "") {
        this.seachbtn = true;
        this.ccapi.openDialog("warning", "please select the language");
        return;
      }
      if( this.nameTunevalue=="") {
        this.seachbtn = true;
        this.ccapi.openDialog("warning", "please enter the name");
        return;
      }
      if(this.nameTunevalue.length<3 ){
        this.seachbtn = true;
        this.ccapi.openDialog("warning", "please enter the name morethen  3 letters");
        return;

      }

    }


  };
  proced(tune1: any) {
    this.setsonglog(tune1)
    this.modelvalue = false;
    // this.modelvalue1 = false;
    this.tuneid = tune1.cid
    this.plauseSound(tune1)
    this.closethedata();
  }
  setnametune() {

    let postData = {
      contentid: this.tuneid,
      packid:"",
      type: "NAMETUNE"
    }
    this.ccapi.postData("/rbt/setrbt", postData).subscribe((response: any) => {
     
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response !=null) {
        if (response.status == 0) {
          this.ccapi.openDialog("success", response.message);
          this.popboolvalue = false
          this.chackValue = this.options[0].value;
        }
        else {
          this.ccapi.openDialog("warning", response.message);

          // this.ccapi.openSnackBar("No Records found");
        }
      }
    }, (err => {
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));
    // window.setTimeout( function() {
    //   window.location.reload();
    // }, 5000);
  this.closethedata();
  }
  showModal() {
    this.messages = [];
    this.modal?.show();
  }
  hidemodal() {
    this.modal?.hide();
  }
  handler(type: string, $event: ModalDirective) {
    this.messages?.push(
      `event ${type} is fired${$event.dismissReason
        ? ', dismissed by ' + $event.dismissReason
        : ''}`
    );
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  searchnameforTunes() {


  this.searchnamesonglogsubmit();
    let postData = {
      name: this.nameTunevalue1,
      language: this.chackValue
    }
    this.ccapi.postData("/rbt/newnametune", postData).subscribe((response: any) => {
      
      
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response !=null) {
        if (response.status == 0) {
          this.ccapi.openDialog("success", response.message);
          this.chackValue = this.options[0].value;
          this.seachbtn=true;
        }
        else {
          this.ccapi.openDialog("warning", response.message);
          // this.ccapi.openSnackBar("No Records found");
        }
      }
    }, (err => {
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));
    // window.setTimeout(function () {
    //   window.location.reload();
    // }, 2000);
    this.nameTunevalue1="";
    this.nameTunevalue="";
   
    this.modelvalue11=true;
    this.noresultpopup= true;
    this.modelvalue1=true;
  
  
 
  }
  namesubmition(vales:any){

    if(vales.length>=3){
      this.searchbtnvalue=false;
      console.log("11")
    }
  }
  playsonglog(value:any){
    // let postData = {
    //   contentid: value.contentid,
    //   packid:"",
    //   type: "RBT"
    // }
    let postData=  {
      event_attributes : {
        page : "RBTPORTAL",      
        screenName : value.contentid,   
        mobileNumber : " "    
      },
      "event_name" : "RBTPLAY"
  }
    this.ccapi.postData("/userjourney/addlog", postData).subscribe((response: any) => {
      // debugger;
    
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response != null) {
        if (response.status == "0") {
          console.log(response,"rsp")
          // this.ccapi.openDialog("success", response.message);

        }
        else {
          this.ccapi.openDialog("warning", response.message);
          // this.ccapi.openSnackBar("No Records found");
        }
      }
    }, (err => {
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));

  }
  playSound(songdata: any) {

  
    if(this.disabledbtn==true){
      this.audio.pause()
    }
    this.audio = new Audio(songdata);
      this.audio.play();
      this.disabledbtn=true

  }
  
    setsonglog(value:any){
      // let postData = {
      //   contentid: value.contentid,
      //   packid:"",
      //   type: "RBT"
      // }
      let postData=  {
        event_attributes : {
          page : "RBTPORTAL",      
          screenName : value.contentid,   
          mobileNumber : " "    
        },
        event_name : "SETRBT"
    }
      this.ccapi.postData("/userjourney/addlog", postData).subscribe((response: any) => {
        // debugger;
      
        if (response.code == "500") {
          this.ccapi.openDialog("warning", response.message);
          return;
        }
        else if (response != null) {
          if (response.status == "0") {
            console.log(response,"rsp")
            // this.ccapi.openDialog("success", response.message);
  
          }
          else {
            this.ccapi.openDialog("warning", response.message);
            // this.ccapi.openSnackBar("No Records found");
          }
        }
      }, (err => {
        console.log(err);
        this.ccapi.HandleHTTPError(err);
      }));
  
    }
  plauseSound(val:any){
    this.audio.pause();
    val.playsong=false;
    
  }
  closethedata() {
    this.nameTunevalue = "";
    this.seachbtn = true;
    this.tunes = [];
    this.nameTunevalue1="";
    this.modelvalue11=true
    this.modelvalue1=true;

  }
  titletrim(album:any){
    if(album.length<15){
      return album.trim()
    
    }
    else{
     return album.slice(0,15).trim()+'...'
    }
      }
      searchnamesonglog(){
        // let postData = {
        //   contentid: value.contentid,
        //   packid:"",
        //   type: "RBT"
        // }
        let postData= {
          event_attributes : {
            page : " RBTNAMETUNE",      
            screenName : "NAMETUNE",   
            mobileNumber : ""    
          },
          event_name : "NAMETUNE|"+this.chackValue+"|"+this.nameTunevalue1
      }
        this.ccapi.postData("/userjourney/addlog", postData).subscribe((response: any) => {
          // debugger;
        
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            return;
          }
          else if (response != null) {
            if (response.status == "0") {
              console.log(response,"rsp")
              // this.ccapi.openDialog("success", response.message);
    
            }
            else {
              this.ccapi.openDialog("warning", response.message);
              // this.ccapi.openSnackBar("No Records found");
            }
          }
        }, (err => {
          console.log(err);
          this.ccapi.HandleHTTPError(err);
        }));
    
      }
      searchnamesonglogsubmit(){
        // let postData = {
        //   contentid: value.contentid,
        //   packid:"",
        //   type: "RBT"
        // }
        let postData= {
          event_attributes : {
            page : " RBTNAMETUNE",      
            screenName : "NAMETUNE",   
            mobileNumber : ""    
          },
          event_name : "NAMETUNE|"+this.chackValue+"|"+this.nameTunevalue
      }
        this.ccapi.postData("/userjourney/addlog", postData).subscribe((response: any) => {
          // debugger;
        
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            return;
          }
          else if (response != null) {
            if (response.status == "0") {
              console.log(response,"rsp")
              // this.ccapi.openDialog("success", response.message);
    
            }
            else {
              this.ccapi.openDialog("warning", response.message);
              // this.ccapi.openSnackBar("No Records found");
            }
          }
        }, (err => {
          console.log(err);
          this.ccapi.HandleHTTPError(err);
        }));
    
      }
      playinvidualsongs(value:any){
        // let postData = {
        //   contentid: value.contentid,
        //   packid:"",
        //   type: "RBT"
        // }
        console.log(value)
        let postData=  {
              
          contentid :  value.cid, 
          // contentid : "C20221104130421001",   
            //  
        
      }
    //   let postData=  {
    //     event_attributes : {
    //       page : "RBTPORTAL",      
    //       screenName : value.contentid,   
    //       mobileNumber : " "    
    //     },
    //     event_name : "RBTPLAY|"+this.trandingTitle
    // }
        this.ccapi.postData("/rbt/getcontentwav", postData).subscribe((response: any) => {
        // console.log(response,value.cid)
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            return;
          }
          else if (response != null) {
            if (response.status == "0") {
              this.playsonglog(value)
            
              this.playSound(response.data.wav_url);
              for(let i=0;i<this.tunes.length;i++){
                if(this.tunes[i].cid==value.cid){
                  this.tunes[i].playsong=true
                 break;
                  
                }
                else{
                  this.tunes[i].playsong=false;
                }
              }
             
              // this.ccapi.openDialog("success", response.message);
    
            }
            else {
              this.ccapi.openDialog("warning", response.message);
              // this.ccapi.openSnackBar("No Records found");
            }
          }
        }, (err => {
          console.log(err);
          this.ccapi.HandleHTTPError(err);
        }));
    
      }
     
}


