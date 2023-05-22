import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-searchsongs',
  templateUrl: './searchsongs.component.html',
  styleUrls: ['./searchsongs.component.css']
})
export class SearchsongsComponent implements OnInit {

  constructor(private ccapi: CommonService, private router: Router,private spinner: NgxSpinnerService) { }
  nameTunes: any=[];
  tabConditionValue: any;
  hidepopup: boolean = false;
  tuneName: string = "";
  songName:string="";
  tabintput:boolean=true;
  audio: any;
  btnbool: boolean = false;
  btnbool1: boolean = true;
  seachbtn: boolean = true;
  disabledbtn:boolean=false;
  typevalue:string="";
  newPopupData:any;
  ngOnInit(): void {
    this.tabConditionValue="name"
    this.ccapi.domainname=true;
    // this.nameTunes = [
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },

    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },

    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "srikanth",
    //     wavfileurl: "assets/images/play_black1.svg"
    //   },
    //   {
    //     cid: "C2022XXXXXXXX",
    //     name: "Srikanth",
    //     wavfileurl: "assets/images/play_black.svg"

    //   }
    // ]
  }
  searchnameTunes() {
    
this.searchnamesonglog();
    this.seachbtn = false;

    // $('#nametunepopup').show

    // let postData={
    //   name:this.nameTunevalue,
    //   language:this.chackValue
    //  }
    if (this.tabConditionValue == "song") {
      this.typevalue="SONGPACK"
      this.hidepopup = true;
      this.spinner.show();
      this.ccapi.postData("/rbt/searchsong", {
        "search_text": this.tuneName, "search_type": "title"}
      ).subscribe((response: any) => {
        this.spinner.hide();
        // debugger;
        if (response.code == "500") {
          this.ccapi.openDialog("warning", response.message);
          return;
        }
        else if (response !=null) {
          if (response.status == 0) {
            this.nameTunes = response.data.tunes
            if(this.nameTunes.length>0){
              this.nameTunes.forEach(function (itm: any) {
                itm.playsong = false;
              })

            }
            else{
              this.ccapi.openDialog("warning", "Records Not Found");
              return;
            }
           

          }
          else {
            this.ccapi.openDialog("warning", response.message);
            return;
            // this.ccapi.openSnackBar("No Records found");
          }
        }
        else {
          this.ccapi.openDialog("warning", response.message);
          return;
          
        }
      }, (err => {
        this.spinner.hide();
        console.log(err);
        this.ccapi.HandleHTTPError(err);
      }));
    }
   
   else if (this.tabConditionValue == "name") {
    this.typevalue="NAMETUNE"
      this.tabintput=false;
      this.hidepopup = false;
      this.spinner.show();
        this.ccapi.postData("/rbt/searchnametune", { 
          "name" : this.tuneName,
          "language":""
       }
       ).subscribe((response: any) => {
        this.spinner.hide();
       
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            return;
          }
          else if (response !=null) {
            if (response.status == 0) {
              this.nameTunes = response.data.tunes

              if(this.nameTunes.length>0){
                this.nameTunes.forEach(function (itm: any) {
                  itm.playsong = false;
                })
  
              }
              else{
                this.ccapi.openDialog("warning", "Records Not Found");
                return;
              }
            
            }
            else {
              this.ccapi.openDialog("warning", response.message);
              return;
              // this.ccapi.openSnackBar("No Records found");
            }
          }
          else{
            this.ccapi.openDialog("warning", response.message);
            return;
          }
        }, (err => {
          this.spinner.hide();
          console.log(err);
          this.ccapi.HandleHTTPError(err);
        }));

    }
    else{
      this.ccapi.openDialog("warning", "plese select the song ");
    }
   

  };
  nametune(value: any) {
    this.tabConditionValue = value
    this.btnbool = false;
    this.btnbool1 = true;
    this.tuneName = "";
    this.seachbtn=true;
    this.nameTunes=[];

  }
  song(value: any) {
    this.tabConditionValue = value
    this.btnbool1 = false;
    this.btnbool = true;
    this.tuneName = "";
    this.seachbtn=true;
    this.nameTunes=[]
  }
  closethedata() {
    this.hidepopup = false;
    this.seachbtn = true;
    this.tuneName = "";
    
  }
  navigatetorbt() {
    let navtokenid = "RBT";
    sessionStorage.setItem('nav_id', navtokenid)
    this.router.navigate(["dashboard"]);
  }
  // playSound(songdata: any, bool: boolean) {
  //   this.nameTunes.forEach(function (itm: any) {
  //     itm.playsong = false;
  //   });
  //  this.disabledbtn=true;
  //   this.audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3');
  //   songdata.playsong = !songdata.playsong
  //   if (songdata.playsong == true) {
  //     this.audio.play();
  //   }

  // }
  playinvidualsongs(value:any){
    // let postData = {
    //   contentid: value.contentid,
    //   packid:"",
    //   type: "RBT"
    // }
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
    
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response != null) {
        if (response.status == "0") {
          this.playsonglog(value)
        
          this.playSound(response.data.wav_url);
          for(let i=0;i<this.nameTunes.length;i++){
            if(this.nameTunes[i].cid==value.cid){
              this.nameTunes[i].playsong=true
             break;
              
            }
            else{
              this.nameTunes[i].playsong=false;
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
  playSound(songdata: any) {

  
    if(this.disabledbtn==true){
      this.audio.pause()
    }
    this.audio = new Audio(songdata);
      this.audio.play();
      this.disabledbtn=true

  }
  plauseSound(val:any){
    this.audio.pause();
    val.playsong=false;
    this.disabledbtn=false;
  }
  setnewnametune(data:any){
this.newPopupData=data
  }
  setnametune() {
    
  this.searchnamesonglogsubmit()
    let postData = {
      contentid: this.newPopupData.cid,
      packid:"",
      type: this.typevalue
    }
    this.ccapi.postData("/rbt/setrbt", postData).subscribe((response: any) => {
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response !=null) {
        if (response.status == 0) {
          this.ccapi.openDialog("success", response.message);
         
          this.closethedata()
          this.plauseSound(this.newPopupData)
        }
        else {
          this.ccapi.openDialog("warning", response.message);
          this.closethedata()
          this.plauseSound(this.newPopupData)

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
      event_name : "NAMETUNE|"+this.tuneName+"|"+this.typevalue
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
      event_name : "NAMETUNE|"+this.tuneName+"|"+this.typevalue
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
}
