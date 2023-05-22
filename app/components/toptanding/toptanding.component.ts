import { Component, OnInit, Input,EventEmitter,Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'ngx-useful-swiper';
import { valentine } from 'ngx-bootstrap-icons';
@Component({
  selector: 'app-toptanding',
  templateUrl: './toptanding.component.html',
  styleUrls: ['./toptanding.component.css']
})
export class ToptandingComponent implements OnInit {

  config: SwiperOptions = {
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    spaceBetween: 10,
    slidesPerView: 2.2
  };

  @Input() data: any = []
  @Output() sendChildValue: EventEmitter<string> = new EventEmitter<string>();
  singlesonglist=[];
  contentList: any=[];
  trandingTitle: any;
  albumList: any = [];
  disabledbtn:boolean=false;
  hidetitle:boolean=true;
  newitemdata:any;
  popupData:any;
  constructor(private router: Router, private ccapi: CommonService) {

  }

  ngOnInit() {
    // console.log("toptrenaind", this.data)
    // if(this.data.length>0){
    // for(let i=0;i<this.data.length;i++){
    if (this.data.moduleid == 100 ) {
      this.contentList = this.data
      this.trandingTitle = this.data.metadata.title
      this.contentlist();
    }
    // if(response.data[i].moduleid==101 || response.data[i].moduleid==4){
    //   this.getbyidList=response.data[i]
    // }
    // if(response.data[i].moduleid==102){
    //   this.languagewiseList=response.data[i]
    //   this.tarndingNtList=response.data[i].metadata.title
    // }
    // }

    // }


  }
  contentlist() {

    // console.log(this.contentList.method, this.contentList.reqbody)
    this.ccapi.postData(this.contentList.method, this.contentList.reqbody).subscribe((response: any) => {
      // debugger;
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.data != null) {
        if (response.status == "0") {
          let resp = response.data.contentlist;
          if(resp.length>0){
            resp.forEach((obj: any) => {
              this.albumList.push(obj);
            })
            this.albumList.forEach(function (itm: any) {
              itm.playsong = false;
            });
            sessionStorage.setItem('toptrandingsongsdata',JSON.stringify(this.albumList))
            // console.log(this.albumList)
          }
          else{
            this.hidetitle=false;

          }
         
          // this.albumList=[...response.data.contentlist,]
          // console.log(this.albumList,"albumlist12")

        }
        else {
          this.ccapi.openDialog("warning", response.message);
          this.hidetitle=false;
          // this.ccapi.openSnackBar("No Records found");
        }
      }
      else{
        this.ccapi.openDialog("warning", response.message);
        this.hidetitle=false;
      }
    }, (err => {
      
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));
  };
  setthesong() {
  
  this.setsonglog(this.popupData);
   
    let postData = {
      contentid: this.popupData.contentid,
      packid:"",
      type: "RBT"
    }
    this.ccapi.postData("/rbt/setrbt", postData).subscribe((response: any) => {
      // debugger;
    
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response != null) {
        if (response.status == "0") {
          this.ccapi.openDialog("success", response.message);
          this.pausesong("data",1)
        

        }
        else {
          this.ccapi.openDialog("warning", response.message);
          this.pausesong("data",1)
          // this.ccapi.openSnackBar("No Records found");
        }
      }
    }, (err => {
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));
  };
 
  pausesong(item:any,num:any){
  //  debugger;
    if(num==2 || num==1){
      this.sendChildValue.emit(num);
      this.albumList.forEach(function (itm: any) {
        itm.playsong = false;
      });
  
    }else{
    this.sendChildValue.emit(num);
    this.albumList.forEach(function (itm: any) {
      itm.playsong = false;
    });
    }

  }
  titletrim(album:any){
if(album.length<8){
  return album.trim()

}
else{
 return album.slice(0,8).trim()+'...'
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
          // console.log(response,"rsp")
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
  playinvidualsongs(value:any){
    // let postData = {
    //   contentid: value.contentid,
    //   packid:"",
    //   type: "RBT"
    // }
    let postData=  {
          
       contentid :  value.contentid, 
      //   contentid : "C20221028141459036", 
      
         
    
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
     
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response != null) {
        if (response.status == "0") {
          this.playsonglog(value)
          sessionStorage.setItem('singlesongdata',JSON.stringify(value))
          this.sendChildValue.emit(response.data.wav_url);
          for(let i=0;i<this.albumList.length;i++){
            if(this.albumList[i].contentid==value.contentid){
              this.albumList[i].playsong=true
             
              
            }
            else{
              this.albumList[i].playsong=false;
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
  setthesongforpopup(data:any){

this.popupData=data;
  }
  changethestatus(){
    this.albumList.forEach(function (itm: any) {
      itm.playsong = false;
    });
  }
  forwardbackwardsongstatus(value:any){
    for(let i=0;i<this.albumList.length;i++){
      if(this.albumList[i].contentid==value.contentid){
       
        this.albumList[i].playsong=true
       
        
      }
      else{
        this.albumList[i].playsong=false;
      }
    }
  }
}
