import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Router, TitleStrategy } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { SwiperOptions } from 'swiper';
@Component({
  selector: 'app-freesongpack',
  templateUrl: './freesongpack.component.html',
  styleUrls: ['./freesongpack.component.css']
})
export class FreesongpackComponent implements OnInit {
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
@Input() data:any;
freesongslist:any=[];
freesongstitle:any=[];
combolist:any=[];
playbtn:boolean=false;
numberofSongs:number=0;
playpopup:boolean=true;
  constructor(private router:Router,private ccapi:CommonService) {
    // this.combolist= [
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
      if(this.data.moduleid==103 ){
        this.freesongslist=this.data
        this.freesongstitle=this.data.metadata.title
        
         this.contentlist();
      // }

  }
  // console.log(this.freesongslist, this.freesongstitle,"title")
}
contentlist() {
  // console.log(this.freesongslist.method,this.freesongslist.reqbody)
 this.ccapi.postData(this.freesongslist.method,this.freesongslist.reqbody).subscribe((response: any) => {

   if (response.code == "500") {
     this.ccapi.openDialog("warning", response.message);
     return;
   }
   else if (response.data != null) {
     if (response.status == "0" ) {
      let resp = response.data.contentlist;
      if(resp.length>0){
        resp.forEach((obj: any)=>{
          this.combolist.push(obj);
        })
        this.numberofSongs=this.combolist.length
        // console.log(this.combolist,"combolist")

      }
      else{
        // this.ccapi.openDialog("warning", "No Data Found In Free Song Pack");
        this.playbtn=true
      }
      
       
     }
     else {

         this.ccapi.openDialog("warning", response.message);
         this.playbtn=true
      //  this.ccapi.openSnackBar("No Records found");
     }
   }
 }, (err => {
   console.log(err);
   this.ccapi.HandleHTTPError(err);
 }));
};
playAllsongs(){
  //  debugger;
  sessionStorage.setItem('groupid', this.data.reqbody.groupid)
  // this.combolist.push(this.data.reqbody)
  this.sendChildValue.emit(this.combolist);
  this.playpopup=false;
  // console.log(this.combolist,"combolist")
  // sessionStorage.setItem('combolist',JSON.stringify(this.combolist))

}
pauseAllsongs(data:any,num:any){
  if(num==1){
    this.sendChildValue.emit(num);
  this.playpopup=true;
  }
  else{
this.sendChildValue.emit(num);
  this.playpopup=true;
  }
  

}

titletrim(album:any){
  if(album !=undefined){
    // console.log(typeof(album))
    if(album.length<8){
      return album.trim()
    
    }
    else{
     return album.slice(0,8).trim()+'...'
    }

  }
 
    }
    
  
}