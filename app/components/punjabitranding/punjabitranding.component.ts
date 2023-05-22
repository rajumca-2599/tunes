import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'ngx-useful-swiper';

@Component({
  selector: 'app-punjabitranding',
  templateUrl: './punjabitranding.component.html',
  styleUrls: ['./punjabitranding.component.css']
})
export class PunjabitrandingComponent implements OnInit {

  config: SwiperOptions = {
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    spaceBetween: 10,
    slidesPerView: 2.3
  };

@Input() data: any=[]
@Output() sendChildValue: EventEmitter<string> = new EventEmitter<string>();
contentList:any;
disabledbtn:boolean=false;
trandingTitle:any;
albumList:any=[];
hidetile:boolean=true;
  constructor(private router:Router,private ccapi:CommonService) { 
   
  }

  ngOnInit() {
    // console.log(this.data)
    // if(this.data.length>0){
      // for(let i=0;i<this.data.length;i++){
        if(this.data.moduleid==106){
          this.contentList=this.data
          this.trandingTitle=this.data.metadata.title
        
           this.contentlist();
        // }
        // if(response.data[i].moduleid==101 || response.data[i].moduleid==4){
        //   this.getbyidList=response.data[i]
        // }
        // if(response.data[i].moduleid==102){
        //   this.languagewiseList=response.data[i]
        //   this.tarndingNtList=response.data[i].metadata.title
        // }
      }

    
    
    
  }
  contentlist() {
    
    //  console.log(this.contentList.method,this.contentList.reqbody)
    this.ccapi.postData(this.contentList.method,this.contentList.reqbody).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.data != null) {
        if (response.status=="0") {
          let resp = response.data.contentlist;
          if(resp.length>0){
            resp.forEach((obj: any)=>{
              this.albumList.push(obj);
            })
            // this.albumList=[...response.data.contentlist,]
            // console.log(this.albumList)
            this.albumList.forEach(function (itm: any) {
              itm.playsong = false;
            });
            sessionStorage.setItem('punjabitrandingsongsdata',JSON.stringify(this.albumList))
            // console.log(this.albumList)
          }
          else{
            this.hidetile=false;
          }
         
          
        }
        else {
          this.hidetile=false;
          this.ccapi.openDialog("warning", response.message);
          // this.ccapi.openSnackBar("No Records found");
        }
      }
      else{
        this.ccapi.openDialog("warning", response.message);
        this.hidetile=false;
      }
    }, (err => {
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));
  };
  setthesong(item:any){
 let postData={
  contentid:item.contentid,
  type:"RBT"
 }
    this.ccapi.postData("rbt/setrbt", postData).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.data != null) {
        if (response.status=="0") {
          this.ccapi.openDialog("success", response.message);
          
        }
        else {
          
          // this.ccapi.openSnackBar("No Records found");
        }
      }
    }, (err => {
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));
  };
//   playsong(value:any){
//     this.sendChildValue.emit(value);
//    this.disabledbtn=true;
 
//    this.albumList.forEach(function (itm: any) {
//      itm.playsong = false;
//      // console.log(value)
    
//    });
   
//    value.palysong=true
//  }
 pausesong(item:any,num:any){
  if(num==2){
    this.sendChildValue.emit(num);
    this.albumList.forEach(function (itm: any) {
      itm.playsong = false;
    });

  }
  else{
  this.sendChildValue.emit(num);
  this.albumList.forEach(function (itm: any) {
    itm.playsong = false;
  });

  }
 }
 titletrim(album:any){
  if(album.length<15){
    return album.trim()
  
  }
  else{
   return album.slice(0,15).trim()+'...'
  }
    }
    
    playinvidualsongs(value:any){
      // let postData = {
      //   contentid: value.contentid,
      //   packid:"",
      //   type: "RBT"
      // }
      let postData=  {
            
        contentid :  value.contentid, 
        //  contentid : "C20221104130421001",   
           
      
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
