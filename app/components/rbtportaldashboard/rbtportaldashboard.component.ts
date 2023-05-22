import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { ToptandingComponent } from '../toptanding/toptanding.component';
import { LanguagewiselistComponent } from '../languagewiselist/languagewiselist.component';
import { PunjabitrandingComponent } from '../punjabitranding/punjabitranding.component';
import { EvergreenclassicsComponent } from '../evergreenclassics/evergreenclassics.component';
import { FunnytunesComponent } from '../funnytunes/funnytunes.component';
import { FreesongpackComponent } from '../freesongpack/freesongpack.component';
// import androidwebkit.JavascriptInterface;
declare var $: any;
declare var jsInterface: any;
@Component({
  selector: 'app-rbtportaldashboard',
  templateUrl: './rbtportaldashboard.component.html',
  styleUrls: ['./rbtportaldashboard.component.css']
})
export class RBTportaldashboardComponent implements OnInit {
  jwt: any;
  typeValue: string = "RBT";
  packid: string = "";
  playbooldis:boolean=false;
  audio: any;
  songurl:any
  playedduration: any;
  deviceOS: string = '';
  jwt_client = "";
  jwt_token = "";
  contentList: any;
  albumList: any;
  getbyidList: any;
  multiBannerList: any;
  newvaluerbt: any;
  languagewiseList: any;
  language_groups: any;
  subLanguage: any;
  data: any;
  boolval: boolean = false;
  boolval1: boolean = false;
  boolval2: boolean = false;
  boolval3: boolean = false;
  boolval4: boolean = false;
  boolval5:boolean=false;
  forwaredbackwardbool:boolean=false;
  pausedcheckedbool:boolean=true
  forwaredbackwardbooltoptranding:boolean=false;
  forwaredbackwardboollangwisebool:boolean=false;
  forwaredbackwardeverclsbool:boolean=false;
  forwaredbackwardpunjabibool:boolean=false;
  forwaredbackwardfunnybool:boolean=false;
  playnextsongFreesongpack:boolean=false;
  timedurationbool:boolean=false;
  favoritebannerBool:boolean=false
  durationinmints: any;
  durationinhours: any;
  playedduraioninmints:any;
  playedduraioninhours:any
  msaapDisplayTitle = true;
  msaapDisplayPlayList = true;
  msaapPageSizeOptions = [2, 4, 6];
  msaapDisplayVolumeControls = true;
  msaapDisplayRepeatControls = true;
  msaapDisplayArtist = false;
  msaapDisplayDuration = false;
  msaapDisablePositionSlider = true;
  musicplayerbool: boolean = false;
  pasuesongbool: boolean = true;
  singlesongdata: any = [];
  multisongdata: any = [];
  playsongbool: boolean = true;
  forwardbool: boolean = false;
  toptrandingmultisongdata:any=[];
  langwisesongsdata:any=[];
  evergreensongsdata:any=[];
  punjabitrandingsongsdata:any=[];
  funnysongsdata:any=[];
  @ViewChild(ToptandingComponent) ChildComponent1: any;
  @ViewChild(LanguagewiselistComponent) ChildComponent2: any;
  @ViewChild(PunjabitrandingComponent) ChildComponent3: any;
  @ViewChild(EvergreenclassicsComponent) ChildComponent4: any;
  @ViewChild(FunnytunesComponent) ChildComponent5: any;
  @ViewChild(FreesongpackComponent) ChildComponent6: any;
  // eslint no-undef: "off"
  // audioList:any;
  // audioList = [
  //   {
  //     url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  //     title: "Smaple1",
  //     cover: "https://i1.sndcdn.com/artworks-000249294066-uow7s0-t500x500.jpg"
  //   }]
  //   {
  //     url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  //     title: "Sample 2",
  //     cover: "https://i1.sndcdn.com/artworks-000249294066-uow7s0-t500x500.jpg"
  //   },
  //   {
  //     url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
  //     title: "Sample 3",
  //     cover: "https://i1.sndcdn.com/artworks-000249294066-uow7s0-t500x500.jpg"
  //   }
  // ];
  // msaapPlaylist = [
  //   {
  //     title: 'Audio One Title',
  //     link: 'assets\images\file_example_MP3_1MG.mp3',
  //     artist: 'Audio One Artist'

  //   },
  //   {
  //     title: 'Audio Two Title',
  //     link: 'assets\images\file_example_MP3_1MG.mp3',
  //     artist: 'Audio Two Artist'

  //   },
  //   {
  //     title: 'Audio Three Title',
  //     link: 'assets\images\file_example_MP3_1MG.mp3',
  //     artist: 'Audio Three Artist'
  //   },
  // ];

  constructor(private router: Router, private ccapi: CommonService) {
    // this.newvaluerbt=sessionStorage.getItem("nav_id")
    // if(this.newvaluerbt="RBT"){
    //  setTimeout(()=>{
    //    window.location.reload()
    //   },3000)
    // }

    // this.data= [
    //   {
    //     id: 51,
    //     moduleid: 100,
    //     name: "RBT Group",
    //     description: "Normal RBT group lay",
    //     module_type: 1,
    //     category: 4,
    //     sourceid: 0,
    //     method: "/rbt/contentlist",
    //     reqbody: {
    //       groupid: "TTN"
    //     },
    //     metadata: {
    //       title: "Top Trending Now!"
    //     }
    //   },
    //   {
    //     id: 52,
    //     moduleid: 101,
    //     name: "RBT Name Tune",
    //     description: "Name tunes banner",
    //     module_type: 3,
    //     category: 3,
    //     sourceid: 13,
    //     method: "/banners/getbyid",
    //     version: "",
    //     uniqueid: "PM_RBT_52_101_8_3",
    //     reqbody: {},
    //     metadata: {}
    //   },
    //   {
    //     id: 53,
    //     moduleid: 102,
    //     name: "RBT Language filter",
    //     description: "Language filter",
    //     module_type: 1,
    //     category: 4,
    //     sourceid: 0,
    //     method: "/rbt/languagewiselist",
    //     reqbody: {
    //       groupid: "SNP"
    //     },
    //     metadata: {}
    //   },
    //   {
    //     id: 54,
    //     moduleid: 103,
    //     name: "RBT Free Song Pack",
    //     description: "Free Song Pack",
    //     module_type: 1,
    //     category: 4,
    //     sourceid: 0,
    //     method: "/rbt/contentlist",
    //     reqbody: {
    //       groupid: "FSP"
    //     },
    //     metadata: {}
    //   },
    //   {
    //     id: 56,
    //     moduleid: 104,
    //     name: "Funny Tunes",
    //     description: "Funny Tunes",
    //     module_type: 1,
    //     category: 4,
    //     sourceid: 0,
    //     method: "/rbt/contentlist",
    //     reqbody: {
    //       groupid: "FTN"
    //     },
    //     metadata: {}
    //   },
    //   {
    //     id: 57,
    //     moduleid: 105,
    //     name: "Evergreen Classics",
    //     description: "Evergreen Classics",
    //     module_type: 1,
    //     category: 4,
    //     sourceid: 0,
    //     method: "/rbt/contentlist",
    //     reqbody: {
    //       groupid: "EVC"
    //     },
    //     metadata: {}
    //   },
    //   {
    //     id: 58,
    //     moduleid: 100,
    //     name: "RBT Group",
    //     description: "Normal RBT group lay",
    //     module_type: 1,
    //     category: 4,
    //     sourceid: 0,
    //     method: "/rbt/contentlist",
    //     reqbody: {
    //       groupid: "PTP"
    //     },
    //     metadata: {
    //       title: "Top Trending Now!"
    //     }
    //   },
    //   {
    //     id: 55,
    //     moduleid: 4,
    //     name: "Promotions",
    //     description: "Promotion Banner",
    //     module_type: 3,
    //     category: 2,
    //     sourceid: 14,
    //     method: "/banners/getbyid",
    //     version: "",
    //     uniqueid: "PM_RBT_55_4_8_3",
    //     reqbody: {},
    //     metadata: {}
    //   }
    // ]

    //
  }

  ngOnInit() {

    // console.log(this.audioList)


    let newjwt = this.router.url
    if (newjwt.indexOf('?') >= 0) {


      this.jwt = decodeURIComponent(newjwt);
      let splitUrl = this.jwt.split("?");
      let splitarray = splitUrl[1].split("&");
      let splitLastarray = splitarray[0].split("=");
      let splitLastarray2 = splitarray[1].split("=")
      let splitLastarray1 = splitarray[2].split("=")
      this.jwt_client = splitLastarray[1];
      this.jwt_token = splitLastarray1[1];
      this.ccapi.token = this.jwt_client;
      this.ccapi.client = this.jwt_token;
      sessionStorage.setItem('jwt_date',splitLastarray2[1])
       console.log(this.jwt_client, this.jwt_token,splitLastarray2[1])
      this.authenticate();

    }
    else {
      this.getmodules();
    }

    this.deviceOS = this.ccapi.RC4EncryptDecrypt(this.getQuerystringValueByName('os'));
    // this.getmodules();
  }
  // dummy(){
  //   debugger;
  //   let newurl="https://stg-mybsnl.bsnl.co.in/rbtportal/#/dashboard?jwt_token=eyJhbGciOiJIUzUxMiJ9.eyJ1aWQiOiJlYmQ3MzhjNWY3ZDlmNTVmNjBiMDBiMGQiLCJzdWIiOiJlYmQ3MzhjNWY3ZDlmNTVmNjBiMDBiMGQiLCJ0b2tlbmlkIjoiOGJiMTRhYjlmNWJiOTUzMTYwYzcwZTc0ZDk5YzMyZTdlZTQ2YWI1ZTRjZmUwMjI1YTQ3YmQ4ZDE3YjQyYjdiNjYzNTRmNGFhIiwibmFtZSI6IiIsInN1YnN0eXBlIjoicHJlcGFpZCIsImxhbmciOiJlbiIsImV4cCI6MTY3NTg0ODE4MSwiaWF0IjoxNjc1ODQ3NTgxfQ.cpem0gdz-WjqzmAJJ3XVD41n1sl-5TrHGxbmW-NXsIs74JVb9JsDvSWWHjesSB7Z5uQydjiLz0EB0lL3cRHDYw&dt=08/02/2023 14:42:36&jwt_client=bsnltunes"
  //   if (newurl.indexOf('?') >= 0) {


  //     this.jwt = decodeURIComponent(newurl);
  //     let splitUrl = this.jwt.split("?");
  //     let splitarray = splitUrl[1].split("&");
  //     let splitLastarray = splitarray[0].split("=");
  //     let splitLastarray2 = splitarray[1].split("=")
  //     let splitLastarray1 = splitarray[2].split("=")
  //     this.jwt_client = splitLastarray[1];
  //     this.jwt_token = splitLastarray1[1];
  //     this.ccapi.token = this.jwt_client;
  //     this.ccapi.client = this.jwt_token;
  //     sessionStorage.setItem('jwt_date',splitLastarray2[1])
  //      console.log(this.jwt_client, this.jwt_token,splitLastarray2[1])
  //     this.authenticate();

  //   }
  // }


  navegatetosearch() {
    this.closethedata()
    this.router.navigate(['search'])
  }

  // playEvent(){
  //   console.log("datra")
  // }
  authenticate() {
  this.favoritebannerBool=true;
    // this.ccapi.token_id=response.data.tokenid
    this.ccapi.postData("/token/authenticate", {}).subscribe((response: any) => {
      // debugger;


      if (response.code != null && response.status == "0") {

        this.ccapi.token_id = response.data.tokenid
        sessionStorage.setItem('token_id', response.data.tokenid)
        sessionStorage.setItem('Zone_id', response.data.zoneid)
        sessionStorage.setItem('Msisdn_id', response.data.msisdn)
        sessionStorage.setItem('Msisdn_date', response.data.date)
       
        this.getmodules();

        // this.getmodules();
        try {
          // this.ccapi.getAlertConfigurations("alertconfigurations");
        } catch (e) {
        }

      }
      else {

        this.ccapi.openDialog("warning", response.message);
      }
    }, (err => {
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));
  };
  ParentComponentone(data: any = {}) {
    this.pausedcheckedbool=true
    this.playnextsongFreesongpack=false;
     this.typeValue = "RBT";
     this.packid="";
    this.songurl=data
       this.forwaredbackwardbooltoptranding=true;
       this.forwaredbackwardbool=false;
       this.forwaredbackwardboollangwisebool=false
       this.forwaredbackwardeverclsbool=false
       this.forwaredbackwardpunjabibool=false;
       this.forwaredbackwardfunnybool=false
    let newtoptrandingdata:any=sessionStorage.getItem("toptrandingsongsdata")
    this.toptrandingmultisongdata=JSON.parse(newtoptrandingdata)
  //  console.log(this.toptrandingmultisongdata,"mul")
  
    if(this.boolval==true){
           this.audio.pause();
        }
    this.singlesongdata=[]
    let singlecombolist: any = sessionStorage.getItem("singlesongdata")
    let newdata=JSON.parse(singlecombolist)
    newdata.trandingTitle="trandingdata";
    this.singlesongdata = newdata
    // console.log(typeof(this.singlesongdata),this.singlesongdata)
    this.musicplayerbool=true;
    this.playsongs(data)
    this.boolval=true;
    this.ChildComponent2.changethestatus();
    this.ChildComponent4.changethestatus();
    this.ChildComponent3.changethestatus();
    // this.ChildComponent6.changethestatus();
    // data.trandingTitle="trandingdata";
    //   this.singlesongdata=data;
    // debugger;
    //   this.singlesongdata=[]

    //  if(data=="1"){
    //   this.musicplayerbool=false;
    //   this.plauseSound(data)

    //  }
    //  else{
    //   if(this.boolval==true){
    //     this.audio.pause();
    //   }
    //   this.musicplayerbool=true;
    
    //   this.boolval=true;
    //  }
    //   data.trandingTitle="trandingdata";
    //   this.singlesongdata=data;
    // console.log(this.singlesongdata,"raju")
    if(data==1 || data==2){
      this.musicplayerbool=false;
    }
  }
  ParentComponenttwo(value: any = {}) {
    this.typeValue = "RBT";
    this.packid="";
    this.pausedcheckedbool=true;
    this.playnextsongFreesongpack=false;
    this.songurl=value
    this.forwaredbackwardbooltoptranding=false;
    this.forwaredbackwardpunjabibool=false;
       this.forwaredbackwardbool=false;
       this.forwaredbackwardboollangwisebool=false
       this.forwaredbackwardeverclsbool=true
       this.forwaredbackwardfunnybool=false
    let newevergreensongsdata:any=sessionStorage.getItem("evergreensongsdata")
    this.evergreensongsdata=JSON.parse(newevergreensongsdata)
    if(this.boolval==true){
      this.audio.pause();
   }
this.singlesongdata=[]
let singlecombolist: any = sessionStorage.getItem("singlesongdata")
let newdata=JSON.parse(singlecombolist)
newdata.trandingTitle="classicdata";
this.singlesongdata = newdata
// console.log(typeof(this.singlesongdata),this.singlesongdata)
this.musicplayerbool=true;
this.playsongs(value)
this.boolval=true;
this.ChildComponent1.changethestatus();
this.ChildComponent2.changethestatus();
// this.ChildComponent4.changethestatus();
this.ChildComponent3.changethestatus();
// this.ChildComponent6.changethestatus();
    // this.singlesongdata = []
    // // console.log(value)

    // if (value == "1") {
    //   this.musicplayerbool = false;
    //   this.plauseSound(value)
    // }
    // else {

    //   this.musicplayerbool = true;
    
    // }
    // value.trandingTitle = "classicdata";
    // this.singlesongdata = value;
    // // debugger;
    // this.audioList[0].url = value.wavfileurl;
    // this.audioList[0].title = value.title.length > 10 ? value.title.slice(0, 10) : value.title;
    // // this.audioList[0].title=data.title;
    // this.audioList[0].cover = value.imageurl.match(/\.(jpeg|jpg|gif|png)$/) != null ? value.imageurl : "assets/images/default_song_track_md.jpg";

  }
  PunjabiComponent(value: any = {}) {
    this.typeValue = "RBT";
    this.packid="";
    this.pausedcheckedbool=true;
    this.playnextsongFreesongpack=false;
    this.songurl=value
    this.forwaredbackwardbooltoptranding=false;
    this.forwaredbackwardbool=false;
    this.forwaredbackwardboollangwisebool=false
    this.forwaredbackwardeverclsbool=false;
    this.forwaredbackwardpunjabibool=true;
    this.forwaredbackwardfunnybool=false
    let newpunjabitrandingsongsdata:any=sessionStorage.getItem("punjabitrandingsongsdata")
    this.punjabitrandingsongsdata=JSON.parse(newpunjabitrandingsongsdata)
    if(this.boolval==true){
      this.audio.pause();
   }
this.singlesongdata=[]
let singlecombolist: any = sessionStorage.getItem("singlesongdata")
let newdata=JSON.parse(singlecombolist)
newdata.trandingTitle="punjabidata";
this.singlesongdata = newdata
// console.log(typeof(this.singlesongdata),this.singlesongdata)
this.musicplayerbool=true;
this.playsongs(value)
this.boolval=true;
this.ChildComponent1.changethestatus();
this.ChildComponent2.changethestatus();
this.ChildComponent4.changethestatus();
// this.ChildComponent3.changethestatus();
// this.ChildComponent6.changethestatus();

    // if (value == "1") {
    //   this.musicplayerbool = false;
    //   this.plauseSound(value)
    // }
    // else {
    //   this.musicplayerbool = true;
   
    // }
    // value.trandingTitle = "punjabidata";
    // this.singlesongdata = value;
    // this.audioList[0].url = value.wavfileurl;
    // this.audioList[0].title = value.title.length > 10 ? value.title.slice(0, 10) : value.title;
    // // this.audioList[0].title=data.title;
    // this.audioList[0].cover = value.imageurl.match(/\.(jpeg|jpg|gif|png)$/) != null ? value.imageurl : "assets/images/default_song_track_md.jpg";

  }
  languagewiseComponent(value: any = {}) {
    this.typeValue = "RBT";
    this.packid="";
    this.songurl=value
    this.pausedcheckedbool=true;
    this.playnextsongFreesongpack=false;
    this.forwaredbackwardbool=false;
    this.forwaredbackwardbooltoptranding=false
    this.forwaredbackwardpunjabibool=false;
    this.forwaredbackwardboollangwisebool=true
       this.forwaredbackwardeverclsbool=false
       this.forwaredbackwardfunnybool=false
    let newlangwisegdata:any=sessionStorage.getItem("langagewisegsongsdata")
    this.langwisesongsdata=JSON.parse(newlangwisegdata)
    if(this.boolval==true){
      this.audio.pause();
   }
this.singlesongdata=[]
let singlecombolist: any = sessionStorage.getItem("singlesongdata")
let newdata=JSON.parse(singlecombolist)
newdata.trandingTitle="langwiselist";
this.singlesongdata = newdata
// console.log(typeof(this.singlesongdata),this.singlesongdata)
this.musicplayerbool=true;
this.playsongs(value)
this.boolval=true;
this.ChildComponent1.changethestatus();
// this.ChildComponent2.changethestatus();
this.ChildComponent4.changethestatus();
this.ChildComponent3.changethestatus();
// this.ChildComponent6.changethestatus();
   
    // this.singlesongdata = []
    // if (value == "1") {

    //   this.musicplayerbool = false;
    //   this.plauseSound(value)
    // }
    // else {
    //   this.musicplayerbool = true;
    
    // }
    // value.trandingTitle = "langwiselist";
    // this.singlesongdata = value;
    // this.audioList[0].url = value.wavfileurl;
    // this.audioList[0].title = value.title.length > 10 ? value.title.slice(0, 10) : value.title;
    // // this.audioList[0].title=data.title;
    // this.audioList[0].cover = value.imageurl.match(/\.(jpeg|jpg|gif|png)$/) != null ? value.imageurl : "assets/images/default_song_track_md.jpg";

  }
  freesongpackComponent(data: any) {
    // if(data.length=0){
    //  this.audio.pause();

    // }
    this.playnextsongFreesongpack=true;
   if(data=="1"){
    this.audio.pause();
    this.musicplayerbool = false;
    return
   }
    this.pausedcheckedbool=true
    this.songurl=data
    this.forwaredbackwardbool=true;
    this.forwaredbackwardbooltoptranding=false
    this.forwaredbackwardboollangwisebool=false
       this.forwaredbackwardeverclsbool=false
       this.forwaredbackwardpunjabibool=false;
       this.forwaredbackwardfunnybool=false
    // let combolist: any = sessionStorage.getItem("combolist")
    // this.multisongdata = JSON.parse(combolist)
    this.multisongdata=data
    let moduleld: any = sessionStorage.getItem("groupid")
    this.packid = moduleld

    this.typeValue = "SONGPACK";
    this.singlesongdata=[];
    data[0].trandingTitle="freesongdata";
    this.singlesongdata=data[0]
    
   this.playinvidualsongs(this.singlesongdata)

    // this.singlesongdata = []
    // if (data != "" || data.length > 0) {

    //   if (data == "1") {
    //     this.musicplayerbool = false;
    //     this.plauseSound(data)
    //   }
    //   else {
    //     this.musicplayerbool = true;
    
    //   }
    //   data.trandingTitle = "freesongdata";
    //   this.singlesongdata = data;
    //   // console.log(data,"data123123123")
    //   // for(let i=0;i<data.length;i++){

    //   //   // let newtitle=data[i].title.length> 10 ? data[i].title.slice(0,10) : data[i].title;
    //   //   // let newobj={
    //   //   //     url: data[i].wavfileurl,
    //   //   //     title: newtitle,
    //   //   //     cover: data[i].imageurl
    //   //   // }
    //   //   this.multisongdata.push(data[i])
    //   //   // this.singlesongdata.push(data[i])
    //   // }

    // }

    // let len=data.length-1
    // this.packid=data[len].groupid
   

    // console.log(this.audioList,"imageurl")
    this.ChildComponent1.changethestatus();
 this.ChildComponent2.changethestatus();
this.ChildComponent4.changethestatus();
this.ChildComponent3.changethestatus();
    
  }
  playinvidualsongs(value:any){
    console.log(value)
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
          // sessionStorage.setItem('singlesongdata',JSON.stringify(value))
          if(this.boolval==true){
            this.audio.pause();
          }
          this.musicplayerbool=true;
          this.playsongs(response.data.wav_url);
          this.songurl=response.data.wav_url
          this.boolval=true
          this.playbooldis=false;
          return
          // for(let i=0;i<this.subLanguage.length;i++){
          //   if(this.subLanguage[i].contentid==value.contentid){
          //     this.subLanguage[i].playsong=true
          //     console.log(this.subLanguage,"ertyuiuytr")
          //     break;
             
              
          //   }
          //   else{
          //     this.subLanguage[i].playsong=false;
          //   }
          // }
         
          // this.ccapi.openDialog("success", response.message);
  
        }
        else {
          this.ccapi.openDialog("warning", response.message);
          this.ChildComponent6.playpopup=true;
          // this.ccapi.openSnackBar("No Records found");
          this.durationinhours=0
          this.durationinmints=0
          this.playedduraioninhours=0
          this.playedduraioninmints=0
          this.playsongbool = true;
          this.ChildComponent1.changethestatus();
          this.ChildComponent2.changethestatus();
         this.ChildComponent4.changethestatus();
         this.ChildComponent3.changethestatus();
         this.playbooldis=true;
        //  this.songurl="";
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
  funnysongpackComponent(data: any) {
    this.typeValue = "RBT";
     this.playnextsongFreesongpack=false;
    this.packid="";
    this.pausedcheckedbool=true
    this.songurl=data
    this.forwaredbackwardbool=false;
    this.forwaredbackwardbooltoptranding=false
    this.forwaredbackwardboollangwisebool=false
       this.forwaredbackwardeverclsbool=false
       this.forwaredbackwardpunjabibool=false;
       this.forwaredbackwardfunnybool=true;
    let newfunnysongsdata:any=sessionStorage.getItem("funnysongsdata")
    this.funnysongsdata=JSON.parse(newfunnysongsdata)
    if(this.boolval==true){
      this.audio.pause();
   }
this.singlesongdata=[]
let singlecombolist: any = sessionStorage.getItem("singlesongdata")
let newdata=JSON.parse(singlecombolist)
newdata.trandingTitle="funnysongdata";
this.singlesongdata = newdata
console.log(typeof(this.singlesongdata),this.singlesongdata)
this.musicplayerbool=true;
this.playsongs(data)
this.boolval=true;
this.ChildComponent1.changethestatus();
this.ChildComponent2.changethestatus();
this.ChildComponent3.changethestatus();
this.ChildComponent4.changethestatus();
// this.ChildComponent6.changethestatus();

    // this.singlesongdata = []
    // // console.log(this.singlesongdata)

    // if (data == "1") {
    //   this.musicplayerbool = false;
    //   this.plauseSound(data)
    // }
    // else {
    //   this.musicplayerbool = true;
    //
    // }
    // data.trandingTitle = "funnysongdata";
    // this.singlesongdata = data;
    // // console.log(data,"data123123123")
    // for (let i = 0; i < data.length; i++) {

    //   let newtitle = data[i].title.length > 10 ? data[i].title.slice(0, 10) : data[i].title;
    //   let newobj = {
    //     url: data[i].wavfileurl,
    //     title: newtitle,
    //     cover: data[i].imageurl
    //   }
    //   this.audioList.push(newobj)
    // }
    // // console.log(this.audioList,"imageurl")
  }
  newsongset(data: any) {
    // console.log(data,"newdata123")
  }
  getmodules() {

    this.ccapi.postData("/pages/getmodules", { name: "rbt" }).subscribe((response: any) => {
      setTimeout(() => {

      }, 1000)
      if (response.status == "0") {

        this.data = response.data
        this.ccapi.domainname = true;
        try {
          // this.ccapi.getAlertConfigurations("alertconfigurations");
        } catch (e) {
        }

      }
      else {

        this.ccapi.openDialog("warning", response.message);
      }
    }, (err => {
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));
  };

  //  playsong(){
  //   alert("play song")
  //  }
  closethedata() {
    
    // this.audio.pause();

    if (this.singlesongdata.trandingTitle == "trandingdata") {
      this.ChildComponent1.pausesong(this.singlesongdata, 1)
      this.musicplayerbool = false;
    }
    if (this.singlesongdata.trandingTitle == "langwiselist") {
      this.ChildComponent2.pausesong(this.singlesongdata, 1)
      this.musicplayerbool = false;
    }
    if (this.singlesongdata.trandingTitle == "punjabidata") {
      this.ChildComponent3.pausesong(this.singlesongdata, 1)
      this.musicplayerbool = false;
    }
    if (this.singlesongdata.trandingTitle == "classicdata") {
      this.ChildComponent4.pausesong(this.singlesongdata, 1)
      this.musicplayerbool = false;
    }
    if (this.singlesongdata.trandingTitle == "funnysongdata") {
      this.ChildComponent5.pauseAllsongs(this.singlesongdata, 1)
      this.musicplayerbool = false;
    }
    if (this.singlesongdata.trandingTitle == "freesongdata") {

      this.ChildComponent6.pauseAllsongs(this.singlesongdata, 1)
      this.musicplayerbool = false;
      this.audio.pause()
    }

    this.pasuesongbool = false;

  }
  getQuerystringValueByName(name: any) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    // console.log(results, "dfghjkjhgf")
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  gobackevent() {
    // alert(window.navigator.userAgent.toLowerCase())
    // debugger
    if (window.navigator.userAgent.toLowerCase().indexOf('android') > 0) {
      // alert("called wheeldesign : android");
      jsInterface.exec("mybsnl", "back", "");
    }
    else if (window.navigator.userAgent.toLowerCase().indexOf("ios") > 0 || window.navigator.userAgent.toLowerCase().indexOf("iphone") > 0) {
      let _webkit = (window as any).webkit;
      // alert("called wheeldesign : IOS");
      let DummyJson = JSON.stringify({})
      _webkit.messageHandlers.back.postMessage(DummyJson);
    }
  }
  titletrim(album: any) {
    if (album != undefined) {
      if (album.length <= 11) {
        return album.trim()

      }
      else {
        return album.slice(0, 11).trim() + '...'
      }
    }
  }
  findduration(num:any){
    { 
      this.durationinhours = Math.floor(num / 60);  
      this.durationinmints = Math.floor(num % 60);
          
    }
  }
  findplayedduration(num:any){
   
    { 
      this.playedduraioninhours = Math.floor(num / 60);  
      this.playedduraioninmints = Math.floor(num % 60);
      if(this.playedduraioninmints== this.durationinmints){
        // if (this.singlesongdata.trandingTitle == "trandingdata") {
        //   alert("data")
        // }
        this.closethedata();
      }
          
    }
  }
  playsongs(data: any) {
    
 
  

    // 
    // this.audio = new Audio(data.wavfileurl);
    if(this.pausedcheckedbool==true)
    {
      this.audio = new Audio(data);
    }

    // this.audio = new Audio(data)
    // console.log("preview url",data)
    // console.log("httpurlurl",data.replace("https","http"))
    this.audio.play();
    this.playsongbool = false
    // this.playedduration = this.audio.currentTarget.playedduration
    // this.duration = this.audio.currentTarget.duration;
    // console.log(this.duration,this.playedduration,"played duratin")
    this.audio.onloadedmetadata = () => {
      let newduration=this.audio.duration
     this.findduration(newduration)
    };

    var istimereached = false;
    this.audio.ontimeupdate = () => {
        // console.log(this.audio.currentTime)
      let newplayedduration=this.audio.currentTime
      this.findplayedduration(newplayedduration)
      if(this.playnextsongFreesongpack==true){
        if(Math.floor(this.audio.currentTime)==5 && !istimereached){
          
          this.newforwardSong(this.singlesongdata)
          istimereached = true;
        }
      }
      // this.playedduration=Math.floor(this.audio.currentTime)
    }; 
    

    if (this.singlesongdata.trandingTitle == "trandingdata") {
      this.ChildComponent1.forwardbackwardsongstatus(this.singlesongdata)
    }
    if (this.singlesongdata.trandingTitle == "langwiselist") {
     this.ChildComponent2.forwardbackwardsongstatus(this.singlesongdata)
    }
    if (this.singlesongdata.trandingTitle == "punjabidata") {
      this.ChildComponent3.forwardbackwardsongstatus(this.singlesongdata)
    }
    if (this.singlesongdata.trandingTitle == "classicdata") {
      this.ChildComponent4.forwardbackwardsongstatus(this.singlesongdata)
    }
    if (this.singlesongdata.trandingTitle == "funnysongdata") {
      this.ChildComponent5.forwardbackwardsongstatus(this.singlesongdata)
    }
    // if (this.singlesongdata.trandingTitle == "freesongdata") {
    //   this.ChildComponent6.forwardbackwardsongstatus(this.singlesongdata)

     
    // }
    // debugger;
    // this.ChildComponent1.forwardbackwardsongstatus(this.singlesongdata)
    // this.ChildComponent2.forwardbackwardsongstatus(this.singlesongdata)
//  this.ChildComponent3.forwardbackwardsongstatus(this.singlesongdata)
// this.ChildComponent4.forwardbackwardsongstatus(this.singlesongdata)
//   this.ChildComponent5.forwardbackwardsongstatus(this.singlesongdata)
    
  }
  
  plauseSound(data: any) {
    // debugger
    this.audio.pause()
    this.playsongbool = true;
    this.pausedcheckedbool=false;
    this.ChildComponent1.changethestatus();
this.ChildComponent2.changethestatus();
this.ChildComponent3.changethestatus();
this.ChildComponent4.changethestatus();
// this.ChildComponent6.changethestatus();
   
  }
  setthesong(item: any) {
    // debugger;
// this.setsonglog(item)
// console.log("data")
    let postData = {
      contentid: this.packid != "" ? "" : item.contentid,
      type: this.typeValue != "" ? this.typeValue : "",
      packid: this.packid = "" ? "" : this.packid
    }
    console.log(postData)
    this.ccapi.postData("/rbt/setrbt", postData).subscribe((response: any) => {

// console.log(response,"response")
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response != null) {
        if (response.status == "0") {
          this.ccapi.openDialog("success", response.message);
          this.closethedata();

        }
        else {
          this.ccapi.openDialog("warning", response.message);
          this.closethedata();
          // this.ccapi.openSnackBar("No Records found");
        }
      }
    }, (err => {
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));
  };
  forwardSong(data: any) {
      this.pausedcheckedbool=true;
    for (let i = 0; i <= this.multisongdata.length; i++) {

     
      if (data?.title == this.multisongdata[i]?.title) {
        this.audio.pause()
        this.multisongdata[i+1].trandingTitle = "freesongdata";
       
        this.singlesongdata = this.multisongdata[i + 1]
        this.playinvidualsongs(this.singlesongdata)
      
        
      }

    }

  }
  newforwardSong(data: any) {
    
  

  for (let i = 0; i <= this.multisongdata.length; i++) {

   
    if (data?.title == this.multisongdata[i]?.title) {
      this.audio.pause()
      this.multisongdata[i+1].trandingTitle = "freesongdata";
     
      this.singlesongdata = this.multisongdata[i + 1]
      this.playinvidualsongs(this.singlesongdata)
      
      
    }

  }

}
  backwardSong(data: any) {
    this.pausedcheckedbool=true;
    //  debugger;
    // this.multisongdata.forEach((obj:any)=>{
    //   if(data.title==obj.title){
    //     this.ChildComponent3
    //   }
    // })
    for (let i = 0; i < this.multisongdata.length; i++) {
      if (data.title == this.multisongdata[i].title) {
        if (i > 0) {
          this.audio.pause()
          this.multisongdata[i-1].trandingTitle = "freesongdata";
          this.singlesongdata = this.multisongdata[i - 1]
          this.playinvidualsongs(  this.singlesongdata)
          this.ChildComponent1.forwardbackwardsongstatus(this.singlesongdata)
        
        }

      }
    }

  }
  backwardSongtop(data: any) {
    this.pausedcheckedbool=true;
    //  debugger;
    // this.multisongdata.forEach((obj:any)=>{
    //   if(data.title==obj.title){
    //     this.ChildComponent3
    //   }
    // })
    for (let i = 0; i < this.toptrandingmultisongdata.length; i++) {
      if (data.title == this.toptrandingmultisongdata[i].title) {
        if (i > 0) {
          this.audio.pause()
          this.toptrandingmultisongdata[i-1].trandingTitle = "trandingdata";
          this.singlesongdata = this.toptrandingmultisongdata[i - 1]
          this.playinvidualsongs(  this.singlesongdata)
          this.ChildComponent1.forwardbackwardsongstatus(this.singlesongdata)
        
        }

      }
    }

  }
  forwardSongtop(data: any) {

    this.pausedcheckedbool=true;
    // this.multisongdata.forEach((obj:any)=>{
    //   if(data.title==obj.title){
    //     this.ChildComponent3
    //   }
    // })
    for (let i = 0; i <= this.toptrandingmultisongdata.length; i++) {

      // if(i==this.multisongdata.length){
      //   debugger;
      // this.forwardbool=true;
      // }
      if (data.title == this.toptrandingmultisongdata[i].title) {
        this.audio.pause()
        this.toptrandingmultisongdata[i+1].trandingTitle = "trandingdata";
        this.singlesongdata = this.toptrandingmultisongdata[i + 1]
        this.playinvidualsongs(this.singlesongdata)
        this.ChildComponent1.forwardbackwardsongstatus(this.singlesongdata)
       
      }

    }

  }
  backwardSonglang(data: any) {
    this.pausedcheckedbool=true;
    //  debugger;
    // this.multisongdata.forEach((obj:any)=>{
    //   if(data.title==obj.title){
    //     this.ChildComponent3
    //   }
    // })
    for (let i = 0; i < this.langwisesongsdata.length; i++) {
      if (data.title == this.langwisesongsdata[i].title) {
        if (i > 0) {
          this.audio.pause()
          this.langwisesongsdata[i-1].trandingTitle = "langwiselist";
          this.singlesongdata = this.langwisesongsdata[i - 1]
          this.playinvidualsongs(  this.singlesongdata)
          this.ChildComponent2.forwardbackwardsongstatus(this.singlesongdata)
          
        }

      }
    }

  }
  forwardSonglang(data: any) {
    this.pausedcheckedbool=true;
    //  debugger;
    // this.multisongdata.forEach((obj:any)=>{
    //   if(data.title==obj.title){
    //     this.ChildComponent3
    //   }
    // })
    for (let i = 0; i <= this.langwisesongsdata.length; i++) {

      // if(i==this.multisongdata.length){
      //   debugger;
      // this.forwardbool=true;
      // }
      if (data.title == this.langwisesongsdata[i].title) {
        this.audio.pause()
        this.langwisesongsdata[i+1].trandingTitle = "langwiselist";
        this.singlesongdata = this.langwisesongsdata[i + 1]
        this.playinvidualsongs(  this.singlesongdata)
        this.ChildComponent2.forwardbackwardsongstatus(this.singlesongdata)
       
      }

    }

  }
  backwardSongevercls(data: any) {
    this.pausedcheckedbool=true;
    //  debugger;
    // this.multisongdata.forEach((obj:any)=>{
    //   if(data.title==obj.title){
    //     this.ChildComponent3
    //   }
    // })
    for (let i = 0; i < this.evergreensongsdata.length; i++) {
      if (data.title == this.evergreensongsdata[i].title) {
        if (i > 0) {
          this.audio.pause()
          this.evergreensongsdata[i-1].trandingTitle = "classicdata";
          this.singlesongdata = this.evergreensongsdata[i - 1]
          this.playinvidualsongs(  this.singlesongdata)
          this.ChildComponent4.forwardbackwardsongstatus(this.singlesongdata)
         
        }

      }
    }

  }
  forwardSongevercls(data: any) {
    this.pausedcheckedbool=true;
    //  debugger;
    // this.multisongdata.forEach((obj:any)=>{
    //   if(data.title==obj.title){
    //     this.ChildComponent3
    //   }
    // })
    for (let i = 0; i <= this.evergreensongsdata.length; i++) {

      // if(i==this.multisongdata.length){
      //   debugger;
      // this.forwardbool=true;
      // }
      if (data.title == this.evergreensongsdata[i].title) {
        this.audio.pause()
        this.evergreensongsdata[i+1].trandingTitle = "classicdata";
        this.singlesongdata = this.evergreensongsdata[i + 1]
        this.playinvidualsongs( this.singlesongdata)
        this.ChildComponent4.forwardbackwardsongstatus(this.singlesongdata)
       
      }

    }

  }
  backwardSongpunjabi(data: any) {
    this.pausedcheckedbool=true;
    
    for (let i = 0; i < this.punjabitrandingsongsdata.length; i++) {
      if (data.title == this.punjabitrandingsongsdata[i].title) {
        if (i > 0) {
          this.audio.pause()
          this.punjabitrandingsongsdata[i-1].trandingTitle = "punjabidata";
          this.singlesongdata = this.punjabitrandingsongsdata[i - 1]
          this.playinvidualsongs(  this.singlesongdata)
          this.ChildComponent3.forwardbackwardsongstatus(this.singlesongdata)
          
        }

      }
    }

  }
  forwardSongpunjabi(data: any) {
    this.pausedcheckedbool=true;
    //  debugger;
    // this.multisongdata.forEach((obj:any)=>{
    //   if(data.title==obj.title){
    //     this.ChildComponent3
    //   }
    // })
    for (let i = 0; i <= this.punjabitrandingsongsdata.length; i++) {

      // if(i==this.multisongdata.length){
      //   debugger;
      // this.forwardbool=true;
      // }
      if (data.title == this.punjabitrandingsongsdata[i].title) {
        this.audio.pause()
        this.punjabitrandingsongsdata[i+1].trandingTitle = "punjabidata";
        this.singlesongdata = this.punjabitrandingsongsdata[i + 1]
        this.playinvidualsongs(  this.singlesongdata)
        this.ChildComponent3.forwardbackwardsongstatus(this.singlesongdata)
        
      }

    }

  }
  backwardSongfunny(data: any) {
    this.pausedcheckedbool=true;
    
    for (let i = 0; i < this.funnysongsdata.length; i++) {
      if (data.title == this.funnysongsdata[i].title) {
        if (i > 0) {
          this.audio.pause()
          this.funnysongsdata[i-1].trandingTitle = "funnysongdata";
          this.singlesongdata = this.funnysongsdata[i - 1]
          this.playinvidualsongs(  this.singlesongdata)
          this.ChildComponent5.forwardbackwardsongstatus(this.singlesongdata)
          
        }

      }
    }

  }
  forwardSongfunny(data: any) {
    this.pausedcheckedbool=true;
    
    for (let i = 0; i <= this.funnysongsdata.length; i++) {

     
      if (data.title == this.funnysongsdata[i].title) {
        this.audio.pause()
        this.funnysongsdata[i+1].trandingTitle = "funnysongdata";
        this.singlesongdata = this.funnysongsdata[i + 1]
        this.playinvidualsongs(  this.singlesongdata)
        this.ChildComponent5.forwardbackwardsongstatus(this.singlesongdata)
        
      }

    }

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
  


}
