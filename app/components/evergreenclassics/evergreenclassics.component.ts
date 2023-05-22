import { Component, OnInit ,Input,Output,EventEmitter} from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { SwiperOptions } from 'swiper';
@Component({
  selector: 'app-evergreenclassics',
  templateUrl: './evergreenclassics.component.html',
  styleUrls: ['./evergreenclassics.component.css']
})
export class EvergreenclassicsComponent implements OnInit {
  config: SwiperOptions = {
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    spaceBetween: 10,
    slidesPerView: 2.3
  };
@Output() sendChildValue: EventEmitter<string> = new EventEmitter<string>();
@Input() data:any=[];
evergreenlist:any=[];
evergreenalbumlist:any=[];
disabledbtn:boolean=false;
hidetitle:boolean=true;
trandingTitle:string="";
  constructor(private ccapi:CommonService) {
    // this.evergreenalbumlist=[
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
    //     title: "PEHLA PEHLA PYAR HAI2",
    //     album: "Looop Lapeta",
    //     shortdescription: "PEHLA PEHLA PYAR HAI",
    //     imageurl: "https://partner.d21.co.in/image.jpg",
    //     wavfileurl: "https://partner.d21.co.in/CMSPreviewProxy/7279055.voth?pt=DWN&f=1",
    //     groupname: "hindi songs",
    //     artist: "Ronkini Gupta,Raghav Kaushik",
    //     language: "Hindi",
    //     yearofrelease: "2022"
    //   }
    // ]
   }

  ngOnInit() {
    // for(let i=0;i<this.data.length;i++){
      if(this.data.moduleid==105  ){
        this.evergreenlist=this.data
        this.trandingTitle = this.data.metadata.title
        // console.log(this.data,"atatata")
        this.contentlist() 
        //  }
  }

}
contentlist() {
  // console.log(this.evergreenlist.method,this.evergreenlist.reqbody)
 this.ccapi.postData(this.evergreenlist.method,this.evergreenlist.reqbody).subscribe((response: any) => {
  
   if (response.code == "500") {
     this.ccapi.openDialog("warning", response.message);
     return;
   }
   else if (response.data != null) {
    if (response.status=="0") {
      let resp = response.data.contentlist;

      // console.log(resp,this.evergreenlist.method,this.evergreenlist.reqbody)
      if(resp.length>0){
        resp.forEach((obj: any)=>{
          this.evergreenalbumlist.push(obj);
        })
        this.evergreenalbumlist.forEach(function (itm: any) {
          itm.playsong = false;
        });
        sessionStorage.setItem('evergreensongsdata',JSON.stringify(this.evergreenalbumlist))

      }
      else{
        this.hidetitle=false;
      }
     
      // this.albumList=[...response.data.contentlist,]
      // console.log(this.evergreenalbumlist)
      
    }
    else {
      this.hidetitle=false;
      this.ccapi.openDialog("warning", response.message);
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
// playsong(value:any){
//    this.sendChildValue.emit(value);
//   this.disabledbtn=true;

//   this.evergreenalbumlist.forEach(function (itm: any) {
//     itm.playsong = false;
//     // console.log(value)
   
//   });
  
//   value.palysong=true
// }
pausesong(item:any,num:any){
  if(num==2){
    this.sendChildValue.emit(num);
    this.evergreenalbumlist.forEach(function (itm: any) {
      itm.playsong = false;
    });
  

  }
  else{
  this.sendChildValue.emit(num);
  this.evergreenalbumlist.forEach(function (itm: any) {
    itm.playsong = false;
  });
  }
}
titletrim(album:any){
  if(album.length<10){
    return album.trim()
  
  }
  else{
   return album.slice(0,10).trim()+'...'
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
            for(let i=0;i<this.evergreenalbumlist.length;i++){
              if(this.evergreenalbumlist[i].contentid==value.contentid){
                this.evergreenalbumlist[i].playsong=true
                
               
                
              }
              else{
                this.evergreenalbumlist[i].playsong=false;
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
      this.evergreenalbumlist.forEach(function (itm: any) {
        itm.playsong = false;
      });
    }
    forwardbackwardsongstatus(value:any){
      for(let i=0;i<this.evergreenalbumlist.length;i++){
        if(this.evergreenalbumlist[i].contentid==value.contentid){
          this.evergreenalbumlist[i].playsong=true
          // console.log(this.evergreenalbumlist,"ertyuiuytr")
          // break;
         
          
        }
        else{
          this.evergreenalbumlist[i].playsong=false;
        }
      }
    }
  
}