import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { SwiperOptions } from 'swiper';
@Component({
  selector: 'app-languagewiselist',
  templateUrl: './languagewiselist.component.html',
  styleUrls: ['./languagewiselist.component.css']
})
export class LanguagewiselistComponent implements OnInit {
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
  @Input() data: any = [];
  disabledbtn:boolean=false;
  languagewiseList: any = [];
  language_groups: any = [];
  hiobj:any;
  subLanguage: any = [];
  hidetitle:boolean=true;
  constructor(private ccapi: CommonService) {
    // this.language_groups=[
    //   {
    //     language: "Hindi",
    //     contents: [
    //       {
    //         contentid: "7279109",
    //         title: "PEHLA PEHLA PYAR HAI",
    //         album: "Looop Lapeta",
    //         shortdescription: "PEHLA PEHLA PYAR HAI",
    //         imageurl: "https://partner.d21.co.in/image.jpg",
    //         wavfileurl: "https://partner.d21.co.in/CMSPreviewProxy/7279055.voth?pt=DWN&f=1",
    //         groupname: "Hindi songs",
    //         artist: "Ronkini Gupta,Raghav Kaushik",
    //         language: "Hindi",
    //         yearofrelease: "2022"
    //       },
    //       {
    //         contentid: "7279109",
    //         title: "PEHLA PEHLA PYAR HAI",
    //         album: "Looop Lapeta",
    //         shortdescription: "PEHLA PEHLA PYAR HAI",
    //         imageurl: "https://partner.d21.co.in/image.jpg",
    //         wavfileurl: "https://partner.d21.co.in/CMSPreviewProxy/7279055.voth?pt=DWN&f=1",
    //         groupname: "Hindi songs",
    //         artist: "Ronkini Gupta,Raghav Kaushik",
    //         language: "Hindi",
    //         yearofrelease: "2022"
    //       },
    //       {
    //         contentid: "7279109",
    //         title: "PEHLA PEHLA PYAR HAI",
    //         album: "Looop Lapeta",
    //         shortdescription: "PEHLA PEHLA PYAR HAI",
    //         imageurl: "https://partner.d21.co.in/image.jpg",
    //         wavfileurl: "https://partner.d21.co.in/CMSPreviewProxy/7279055.voth?pt=DWN&f=1",
    //         groupname: "Hindi songs",
    //         artist: "Ronkini Gupta,Raghav Kaushik",
    //         language: "Hindi",
    //         yearofrelease: "2022"
    //       },
    //       {
    //         contentid: "7279109",
    //         title: "PEHLA PEHLA PYAR HAI",
    //         album: "Looop Lapeta",
    //         shortdescription: "PEHLA PEHLA PYAR HAI",
    //         imageurl: "https://partner.d21.co.in/image.jpg",
    //         wavfileurl: "https://partner.d21.co.in/CMSPreviewProxy/7279055.voth?pt=DWN&f=1",
    //         groupname: "Hindi songs",
    //         artist: "Ronkini Gupta,Raghav Kaushik",
    //         language: "Hindi",
    //         yearofrelease: "2022"
    //       },
    //       {
    //         contentid: "7279109",
    //         title: "PEHLA PEHLA PYAR HAI",
    //         album: "Looop Lapeta",
    //         shortdescription: "PEHLA PEHLA PYAR HAI",
    //         imageurl: "https://partner.d21.co.in/image.jpg",
    //         wavfileurl: "https://partner.d21.co.in/CMSPreviewProxy/7279055.voth?pt=DWN&f=1",
    //         groupname: "Hindi songs",
    //         artist: "Ronkini Gupta,Raghav Kaushik",
    //         language: "Hindi",
    //         yearofrelease: "2022"
    //       }
    //     ]
    //   },
    //   {
    //     language: "Punjabi",
    //     contents: [
    //       {
    //         contentid: "7279109",
    //         title: "PEHLA PEHLA PYAR HAI",
    //         album: "Looop Lapeta",
    //         shortdescription: "PEHLA PEHLA PYAR HAI",
    //         imageurl: "https://partner.d21.co.in/image.jpg",
    //         wavfileurl: "https://partner.d21.co.in/CMSPreviewProxy/7279055.voth?pt=DWN&f=1",
    //         groupname: "Punjabi songs",
    //         artist: "Ronkini Gupta,Raghav Kaushik",
    //         language: "Punjabi",
    //         yearofrelease: "2022"
    //       },
    //       {
    //         contentid: "7279109",
    //         title: "PEHLA PEHLA PYAR HAI",
    //         album: "Looop Lapeta",
    //         shortdescription: "PEHLA PEHLA PYAR HAI",
    //         imageurl: "https://partner.d21.co.in/image.jpg",
    //         wavfileurl: "https://partner.d21.co.in/CMSPreviewProxy/7279055.voth?pt=DWN&f=1",
    //         groupname: "Punjabi songs",
    //         artist: "Ronkini Gupta,Raghav Kaushik",
    //         language: "Punjabi",
    //         yearofrelease: "2022"
    //       }
    //     ]
    //   },
    //   {
    //     language: "telugu",
    //     contents: [
    //       {
    //         contentid: "7279109",
    //         title: "PEHLA PEHLA PYAR HAI",
    //         album: "Looop Lapeta",
    //         shortdescription: "PEHLA PEHLA PYAR HAI",
    //         imageurl: "https://partner.d21.co.in/image.jpg",
    //         wavfileurl: "https://partner.d21.co.in/CMSPreviewProxy/7279055.voth?pt=DWN&f=1",
    //         groupname: "telugu songs",
    //         artist: "Ronkini Gupta,Raghav Kaushik",
    //         language: "telugu",
    //         yearofrelease: "2022"
    //       },
    //       {
    //         contentid: "7279109",
    //         title: "PEHLA PEHLA PYAR HAI",
    //         album: "Looop Lapeta",
    //         shortdescription: "PEHLA PEHLA PYAR HAI",
    //         imageurl: "https://partner.d21.co.in/image.jpg",
    //         wavfileurl: "https://partner.d21.co.in/CMSPreviewProxy/7279055.voth?pt=DWN&f=1",
    //         groupname: "telugu songs",
    //         artist: "Ronkini Gupta,Raghav Kaushik",
    //         language: "telugu",
    //         yearofrelease: "2022"
    //       }
    //     ]
    //   }
    // ]
  }

  ngOnInit() {


      if (this.data.moduleid == 102 ) {
        this.languagewiseList = this.data

      

    }

    this.languagewiselist();

  }
  languagewiselist() {
// debugger;
    // let reqbody = {
    //   sourceid: this.languagewiseList.sourceid
    // }
    this.ccapi.postData(this.languagewiseList.method, this.languagewiseList.reqbody).subscribe((response: any) => {
        // debugger;

      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.data != null) {
        if (response.status == "0") {
          //  this.language_groups=response.data.language_groups
          let resp = response.data;
          if(resp.length>0){
            resp.forEach((obj: any) => {
           
              if(obj.language.toLowerCase()=="hindi"){
                this.hiobj=obj
              }
              if(obj.language.toLowerCase()!="hindi"){
                this.language_groups.push(obj);
              }
            
              // console.log(this.language_groups)
            })
           
            this.language_groups.unshift(this.hiobj)
            this.language_groups.forEach(function (itm: any) {

              itm.global = false;
  
            });
          
          }
          else{
            // this.ccapi.openDialog("warning","No Data Found in Sweet 90s popular lis");
            this.hidetitle=false;

          }
         
          
          // console.log(this.language_groups)
          if (this.language_groups.length > 0) {

            for (let j = 0; j < this.language_groups.length; j++) {
              if (this.language_groups[j].language == "Hindi" || this.language_groups[j].language == "hindi") {
                this.showthantlist(this.language_groups[j])
                

              }
            }
          }

        }
        else {
          this.hidetitle=false;
          this.ccapi.openDialog("warning", response.message);
          //  this.ccapi.openSnackBar("No Records found");
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
  showthantlist(data: any) {
  
  
    this.subLanguage = data.contentList
    this.subLanguage.forEach(function (itm: any) {
      itm.playsong = false;
    });
    
    this.language_groups.forEach(function (itm: any) {

      itm.global = false;

    });
    data.global = !data.global

    sessionStorage.setItem('langagewisegsongsdata',JSON.stringify(this.subLanguage))

    // console.log(this.subLanguage)
  }
  // showthantlist(data: any) {

  //   this.disabledbtn=false;

  //   this.language_groups.forEach(function (itm: any) {

  //     itm.global = false;

  //   });

  //   this.subLanguage = data

  //   data.global = !data.global



  //   // console.log(this.subLanguage)

  // }
//   playsong(value:any){
//     this.sendChildValue.emit(value);
//    this.disabledbtn=true;
 
//    this.language_groups.forEach(function (itm: any) {
//      itm.playsong = false;
//      // console.log(value)
    
//    });
   
//    value.palysong=true
//  }
playinvidualsongs(value:any){
  // let postData = {
  //   contentid: value.contentid,
  //   packid:"",
  //   type: "RBT"
  // }
  let postData=  {
        
    contentid :  value.contentid, 
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

    if (response.code == "500") {
      this.ccapi.openDialog("warning", response.message);
      return;
    }
    else if (response != null) {
      if (response.status == "0") {
        this.playsonglog(value)
        sessionStorage.setItem('singlesongdata',JSON.stringify(value))
        this.sendChildValue.emit(response.data.wav_url);
        for(let i=0;i<this.subLanguage.length;i++){
          if(this.subLanguage[i].contentid==value.contentid){
            this.subLanguage[i].playsong=true
            // console.log(this.subLanguage,"ertyuiuytr")
            break;
           
            
          }
          else{
            this.subLanguage[i].playsong=false;
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
 pausesong(item:any,num:any){
  
  if(num==2){
    this.sendChildValue.emit(num);
    this.subLanguage.forEach(function (itm: any) {
      itm.playsong = false;
    });
  }else{
  this.sendChildValue.emit(num);
  this.subLanguage.forEach(function (itm: any) {
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
    changethestatus(){
      this.subLanguage.forEach(function (itm: any) {
        itm.playsong = false;
      });
    }
    forwardbackwardsongstatus(value:any){
   
      for(let i=0;i<this.subLanguage.length;i++){
        if(this.subLanguage[i].contentid==value.contentid){
          this.subLanguage[i].playsong=true
          // console.log(this.subLanguage,"ertyuiuytr")
        
         
          
        }
        else{
          this.subLanguage[i].playsong=false;
        }
      }
    }
}
