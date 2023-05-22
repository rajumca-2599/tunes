import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { SwiperOptions } from 'swiper';
// declare function sha512(data:any):any
import '../../../assets/js/vendors/custom'
declare var jsInterface: any;
import { ModalDirective } from 'ngx-bootstrap/modal';
 import * as sha512 from "js-sha512";
declare var jsInterface: any;
@Component({
  selector: 'app-favouritealbum',
  templateUrl: './favouritealbum.component.html',
  styleUrls: ['./favouritealbum.component.css']
})
export class FavouritealbumComponent implements OnInit {
  config: SwiperOptions = {
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    spaceBetween: 10,
    slidesPerView: 1.5
  };
  @ViewChild('childModal', { static: false }) childModal?: ModalDirective;
  deviceOS: string = '';
  @Input() data: any = [];
  favouritealbumList: any = [];
  multialbumlist: any = [];
  paymentData: any = [];
  groupId: any;
  price: any;
  keyword:any;
  hashkey:any;
  newMsisdn: any;
  newtokenid:any;
  pricebannerdata:any;
  dtkey:any;
 tokenid = '';
  constructor(private ccapi: CommonService) {
    // this.multialbumlist= [


    //   {
    //     language: "en",
    //     bannerid: 9,
    //     title: "Recharge",
    //     description: "",
    //     url: "recharge",
    //     external: false,
    //     src: "assets/images/rbt_stvs_banner.png",
    //     webview: {
    //       title: "",
    //       description: "",
    //       color: "#0000000",
    //       bgcolor: "#0000000"
    //     }
    //   },
    //   {
    //     language: "en",
    //     bannerid: 9,
    //     title: "Recharge",
    //     description: "",
    //     url: "recharge",
    //     external: false,
    //     src: "assets/images/rbt_stvs_banner.png",
    //     webview: {
    //       title: "",
    //       description: "",
    //       color: "#0000000",
    //       bgcolor: "#0000000"
    //     }
    //   },
    //   {
    //     language: "en",
    //     bannerid: 9,
    //     title: "Recharge",
    //     description: "",
    //     url: "recharge",
    //     external: false,
    //     src: "assets/images/rbt_stvs_banner.png",
    //     webview: {
    //       title: "",
    //       description: "",
    //       color: "#0000000",
    //       bgcolor: "#0000000"
    //     }
    //   },
    //   {
    //     language: "en",
    //     bannerid: 11,
    //     title: "Pay Bill",
    //     description: "",
    //     url: "paybill",
    //     external: false,
    //     src: "assets/images/rbt_stvs_banner.png",
    //     webview: {
    //       title: "",
    //       description: "",
    //       color: "#0000000",
    //       bgcolor: "#0000000"
    //     }
    //   }
    // ]
  }

  ngOnInit() {

    // for(let i=0;i<this.data.length;i++){
    if (this.data.moduleid == 4) {
      this.favouritealbumList = this.data
      this.getbyid();
      //  }

    }
    this.deviceOS = this.ccapi.RC4EncryptDecrypt('os');
    this.newMsisdn = sessionStorage.getItem("jwt_date")
    this.newtokenid=sessionStorage.getItem("token_id")
    this.dtkey =sessionStorage.getItem("jwt_date")
    this.tokenid = this.ccapi.Decrypt(this.getQuerystringValueByName('tid'));
  }
  getQuerystringValueByName(name:any) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
  getbyid() {
    let reqbody = {
      sourceid: this.favouritealbumList.sourceid
    }
    this.ccapi.postData(this.favouritealbumList.method, reqbody).subscribe((response: any) => {

      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response.data != null) {
        if (response.status == "0") {
          this.groupId = response.data[0].groupid
          let resp = response.data[0].banner_info;
          resp.forEach((obj: any) => {
            this.multialbumlist.push(obj);
          })
          //  console.log(this.multialbumlist,"albumlist")

        }
        else {
          this.ccapi.openDialog("warning", response.message);
          //  this.ccapi.openSnackBar("No Records found");
        }
      }
    }, (err => {
      console.log(err);
      this.ccapi.HandleHTTPError(err);
    }));
  };
  openNewtab(url: any) {
  this.pricebannerdata=url
    this.playsonglog(url)
    this.redirectedurl(url)

    // if (url.url.indexOf('http') == 0 || url.url.indexOf('https') == 0) {
    //   window.open(url);

    // } else {
    //   let urlBasedDeeplink="https://stg-mybsnl.bsnl.co.in/api/v2/deeplink?action=page&pagename="+url;
    //   if (window.navigator.userAgent.toLowerCase().indexOf('android') > 0) {
    //     window.open(urlBasedDeeplink);
    //   }
    //   else if (window.navigator.userAgent.toLowerCase().indexOf("ios") > 0 || window.navigator.userAgent.toLowerCase().indexOf("iphone") > 0) {
    //     window.open(urlBasedDeeplink);
    //   }

    // }
  }
  playsonglog(value: any) {
    // let postData = {
    //   contentid: value.contentid,
    //   packid:"",
    //   type: "RBT"
    // }
    let postData = {
      event_attributes: {
        page: "RBTPORTAL",
        screenName: value.contentid,
        mobileNumber: " "
      },
      "event_name": "NAMETUNECLICK"
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
          // // this.ccapi.openDialog("success", response.message);

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
  redirectedurl(value: any) {
 
    this.keyword = value.url.split("##");
    this.price = this.keyword[this.keyword.length - 1].substr(this.keyword[this.keyword.length - 1].length - 3)
    let postData = {
      bannerid: value.bannerid,
      keyword: this.keyword[this.keyword.length - 1],
      groupid: this.groupId
    }


    this.ccapi.postData("/banners/getredirecturl", postData).subscribe((response: any) => {
 
      
      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response != null) {
        if (response.status == "0") {
          // console.log(response.data.redirecturl, "rsp")

          if (value.url.startsWith("PREVIEW")) {
            this.navigateTopayment();
           
          }
          else {
            window.open(response.data.redirecturl)

          }

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
  paymentBanner() {
    let postData = {
      price: this.price,
      msisdn: this.ccapi.RC4EncryptDecryptph(this.newMsisdn)

    }
    this.ccapi.postData("/packages/eligibilitypromo", postData).subscribe((response: any) => {


      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response != null) {
        if (response.status == "0") {
          this.paymentData = response.data.packages
        
          // this.showChildModal();
          // console.log(this.paymentData)
          // console.log(this.paymentData[0].data)

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
  showChildModal(): void {
    this.childModal?.show();
  }
  hideChildModal(): void {
    this.childModal?.hide();
  }
  computeHash(data:any,tokenid:any){
    // debugger;
  // this.inapppaymenttime();
  
  // alert("dtkey- " + this.dtkey)
  //  alert("tokenid- "+tokenid)
    var bodystr = data+"&SALT="+this.dtkey+tokenid;
    // alert("salt -" + bodystr);
    //  let newhash= sha512(bodystr)
    //  let simple=sha51
    let newhash=sha512.sha512(bodystr)
    
     return newhash
     
    
    
  }
  navigateTopayment() {
    
//     var today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
// var yyyy = today.getFullYear();
// var timeh = today.getHours()
// var timem=today.getMinutes()
// var times=today.getSeconds()

// this.dtkey = mm + '/' + dd + '/' + yyyy +" "+timeh+':'+timem+':'+times;

    // console.log(this.pricebannerdata,this,this.newtokenid,"1234565432",typeof(this.pricebannerdata))
    this.hashkey = this.computeHash(JSON.stringify(this.pricebannerdata),this.newtokenid);
    // alert('{"hashed_data": "' + this.hashkey + '","data":'+JSON.stringify(this.pricebannerdata)+'}')
    // alert(this.hashkey)
    // console.log('{"hashed_data": "' + this.hashkey + '","data":'+JSON.stringify(this.pricebannerdata)+'}')
    if (window.navigator.userAgent.toLowerCase().indexOf('android') > 0) {
      // alert("called wheeldesign : android");
      //   jsInterface.exec("mybsnl", "deeplink", '{"hashed_data": "' + hashkey + '","data": BANNER OBJECT }');
      // jsInterface.exec("mybsnl", "wheeldesign", '{"hashed_data": "' + hashkey + '","data": {"success":"RenderWheel"}}');
      jsInterface.exec("mybsnl","deeplink",'{"hashed_data":"'+this.hashkey+'","data":'+JSON.stringify(this.pricebannerdata)+'}');
    }
    else if (window.navigator.userAgent.toLowerCase().indexOf("ios") > 0 || window.navigator.userAgent.toLowerCase().indexOf("iphone") > 0) {
      let _webkit = (window as any).webkit;
      // alert("called wheeldesign : IOS");
      // let DummyJson = JSON.stringify({'{"hashed_data": "' + this.hashkey + '","data":'+JSON.stringify(this.pricebannerdata)+'}' })
      _webkit.messageHandlers.deeplink.postMessage(JSON.stringify('{"hashed_data":"'+this.hashkey+'","data":'+JSON.stringify(this.pricebannerdata)+'}'));
    }
    // let postData={
    //   price:this.price,
    //   msisdn:this.ccapi.RC4EncryptDecryptph(this.newMsisdn)

    // }
//     let postData = { transtype: "reload", 
//     operationtype: "recharge",
//      paymentchannel: "CARD", 
//      offerid: this.keyword[this.keyword.length - 1],
//       transid: "",
//       tomsisdn: this.ccapi.RC4EncryptDecryptph(this.newMsisdn), 
//       walletmsisdn: "", amount: this.price, 
//       promocode: "" }
//     this.ccapi.postData("/payment/payment/v2", postData).subscribe((response: any) => {
// // debugger;

//       if (response.code == "500") {
//         this.ccapi.openDialog("warning", response.message);
//         return;
//       }
//       else if (response != null) {
//         if (response.status == "0") {
          
//           console.log(response)
         
//         }
//         else {
//           this.ccapi.openDialog("warning", response.message);
//           // this.ccapi.openSnackBar("No Records found");
//         }
//       }
//     }, (err => {
//       console.log(err);
//       this.ccapi.HandleHTTPError(err);
//     }));

  }
  inapppaymenttime() {
   
    
    this.ccapi.postData("/notifications/inapp/v2", {}).subscribe((response: any) => {
      // debugger;

      if (response.code == "500") {
        this.ccapi.openDialog("warning", response.message);
        return;
      }
      else if (response != null) {
        if (response.status == "0") {
          // this.paymentData = response.data.packages
        
          // this.showChildModal();
          // console.log(this.paymentData)
          // console.log(this.paymentData[0].data)

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
