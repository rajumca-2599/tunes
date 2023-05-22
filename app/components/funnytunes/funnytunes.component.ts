import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { SwiperOptions } from 'swiper';
@Component({
  selector: 'app-funnytunes',
  templateUrl: './funnytunes.component.html',
  styleUrls: ['./funnytunes.component.css']
})
export class FunnytunesComponent implements OnInit {
  config: SwiperOptions = {
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    spaceBetween: 10,
    slidesPerView: 2.3
  };

  @Input() data: any = [];
  @Output() sendChildValue: EventEmitter<string> = new EventEmitter<string>();
  funnytuneslist: any = [];
  funnysonglist: any = [];
  playpopup: boolean = true;
  funnysongstitle: any = [];
  constructor(private router: Router, private ccapi: CommonService) {
    // this.funnytuneslist= [
    //   {
    //     contentid: "7279109",
    //     title: "PEHLA PEHLA PYAR HAI",
    //     album: "Looop Lapeta",
    //     shortdescription: "PEHLA PEHLA PYAR HAI",
    //     imageurl: "https://partner.d21.co.in/image.jpg",
    //     wavfileurl: "https://partner.d21.co.in/CMSPreviewProxy/7279055.voth?pt=DWN&f=1",
    //     groupname: "Hindi songs",
    //     artist: "Ronkini Gupta,Raghav Kaushik",
    //     language: "Hindi",
    //     yearofrelease: "2022"
    //   },
    //   {
    //     contentid: "7279109",
    //     title: "PEHLA PEHLA PYAR HAI",
    //     album: "Looop Lapeta",
    //     shortdescription: "PEHLA PEHLA PYAR HAI1",
    //     imageurl: "https://partner.d21.co.in/image.jpg",
    //     wavfileurl: "https://partner.d21.co.in/CMSPreviewProxy/7279055.voth?pt=DWN&f=1",
    //     groupname: "Hindi songs",
    //     artist: "Ronkini Gupta,Raghav Kaushik",
    //     language: "Hindi",
    //     yearofrelease: "2022"
    //   },
    //   {
    //     contentid: "7279109",
    //     title: "PEHLA PEHLA PYAR HAI",
    //     album: "Looop Lapeta",
    //     shortdescription: "PEHLA PEHLA PYAR HAI2",
    //     imageurl: "https://partner.d21.co.in/image.jpg",
    //     wavfileurl: "https://partner.d21.co.in/CMSPreviewProxy/7279055.voth?pt=DWN&f=1",
    //     groupname: "Hindi songs",
    //     artist: "Ronkini Gupta,Raghav Kaushik",
    //     language: "Hindi",
    //     yearofrelease: "2022"
    //   },
    //   {
    //     contentid: "7279109",
    //     title: "PEHLA PEHLA PYAR HAI",
    //     album: "Looop Lapeta",
    //     shortdescription: "PEHLA PEHLA PYAR HAI3",
    //     imageurl: "https://partner.d21.co.in/image.jpg",
    //     wavfileurl: "https://partner.d21.co.in/CMSPreviewProxy/7279055.voth?pt=DWN&f=1",
    //     groupname: "Hindi songs",
    //     artist: "Ronkini Gupta,Raghav Kaushik",
    //     language: "Hindi",
    //     yearofrelease: "2022"
    //   }
    // ]
  }


  ngOnInit() {
    // for(let i=0;i<this.data.length;i++){
    if (this.data.moduleid == 104) {
      this.funnysonglist = this.data
      this.funnysongstitle = this.data.metadata.title

      this.contentlist();
      // }
    }
  }
  contentlist() {

    this.ccapi.postData(this.funnysonglist.method, this.funnysonglist.reqbody).subscribe((response: any) => {
      
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.data != null) {
        if (response.status == "0") {
          this.funnytuneslist = response.data.contentlist;
          // resp.forEach((obj: any) => {
          //   this.funnytuneslist.push(obj);
          // })
          // this.albumList=[...response.data.contentlist,]
          
          this.funnytuneslist.forEach(function (itm: any) {
            itm.playsong = false;
          });
          // console.log(this.funnytuneslist,"raju")
          sessionStorage.setItem('funnysongsdata',JSON.stringify(this.funnytuneslist))

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
   
  };
  // playAllsongs(data:any) {
  //   this.sendChildValue.emit(data);
  //   this.funnytuneslist.forEach(function (itm: any) {
  //     itm.playsong = false;
  //   });


  // }
  // pauseAllsongs(num: any) {

  //   this.sendChildValue.emit(num);
  //   this.playpopup = true
  // }
  pauseAllsongs(item:any,num:any){
    // debugger;
    this.playpopup = true
      if(num==2 || num==1){
        this.sendChildValue.emit(num);
      // this.disabledbtn=false;
      item.palysong=false;
      }else{
      this.sendChildValue.emit(num);
      // this.disabledbtn=false;
      item.palysong=false;
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

      playinvidualsongs(value:any){
        // let postData = {
        //   contentid: value.contentid,
        //   packid:"",
        //   type: "RBT"
        // }
        let postData=  {
              
          contentid :  value.contentid, 
          // contentid : "C20221104130421001",   
             
        
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
              for(let i=0;i<this.funnytuneslist.length;i++){
                if(this.funnytuneslist[i].contentid==value.contentid){
                  this.funnytuneslist[i].playsong=true
                 
                  
                }
                else{
                  this.funnytuneslist[i].playsong=false;
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
        this.funnytuneslist.forEach(function (itm: any) {
          itm.playsong = false;
        });
      }
      forwardbackwardsongstatus(value:any){
        
        for(let i=0;i<this.funnytuneslist.length;i++){
          if(this.funnytuneslist[i].contentid==value.contentid){
            this.funnytuneslist[i].playsong=true
           
            
          }
          else{
            this.funnytuneslist[i].playsong=false;
          }
        }
      }
}
