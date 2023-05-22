import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SharedService } from 'src/app/shared/SharedService';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.component.html',
  styleUrls: ['./view-message.component.css']
})
export class ViewMessageComponent implements OnInit {

  constructor(private router:Router,private spinner:NgxSpinnerService,private imiapi:IMIapiService,
    private apiData:ApidataService,private route:ActivatedRoute,public env:EnvService,private shareddata:SharedService) { }
sourceScreen:string="";
singlemessage:any;
  ngOnInit(): void {
    console.log("In Message Source Screen is:"+this.route.snapshot.params.sourcescreen);
    this.sourceScreen = this.route.snapshot.params.sourcescreen;
    this.singlemessage=this.shareddata.getvoucherInfo('inboxmessage');
    this.route.paramMap.subscribe((params : ParamMap)=> {  
      this.sourceScreen = params["params"].sourcescreen;
      console.log("In Message route.paramMa Source Screen is:"+this.sourceScreen);            
      }); 
    this.updateStatus(this.singlemessage.transactionid);
   
  }
  navigatetoinbox() {
    this.router.navigate(['/inbox/'+this.sourceScreen]);
  }
  deleteMessage(transactionId: any) {
    this.spinner.show();
    var obj = { id: transactionId, action: 'update', status: 'D' };
    this.imiapi.postData('v1/notifications/delete', obj).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.status != null && response.status == '0') {
          this.router.navigate(['/inbox/'+this.sourceScreen]);
          return;
        }
        else  if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
        }
      },
      (error) => {
       // console.log(error);
      }
    );
  }
  gotoHome() {
    console.log(this.sourceScreen);
   
    
    let stateName = this.imiapi.getStorage('footerstateName');
    if (stateName == '' || stateName == undefined) stateName = 'home';
    this.router.navigate(['/' + stateName]);
    this.imiapi.setStorageValue('footerstateName', this.sourceScreen);
    this.apiData.footerstateName.next(this.sourceScreen);
  }
  updateStatus(id: any) {
    var obj = { id: id, action: 'update', status: 'V' };
    this.imiapi.postData('v1/notifications/update', obj).subscribe(
      (response: any) => {
        if (response.code == '10002' || response.code == '11111') {
          this.imiapi.clearSession();
          // this.router.navigate(['/login']);
          // Added on 27thjune to redirect to HE 
          this.router.navigate(['/pwa']);
        }
        if (response.status != null && response.data != undefined) {
          if (response.status == '0') {
            console.log(response.status);
          }
        }
      },
      (error) => {
        //console.log(error);
      }
    );
  }

}
