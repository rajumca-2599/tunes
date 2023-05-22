import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { TranslateService } from '@ngx-translate/core';
import { EnvService } from 'src/app/shared/env.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { CtaModalComponent } from 'src/app/shared/cta-modal/cta-modal.component';

import { ApidataService } from 'src/app/shared/apidata.service';

@Component({
  selector: 'app-partnerdetails',
  templateUrl: './partnerdetails.component.html',
  styleUrls: ['./partnerdetails.component.css']
})
export class PartnerdetailsComponent implements OnInit {
partnerid:any;
userid:any;
partnerTotalData:any=[];
selectedlanguage = 'ID';
helpurl = '';
  constructor(private route:ActivatedRoute,private spinner:NgxSpinnerService,
    private imiapi: IMIapiService,private router: Router,private translate: TranslateService, public env: EnvService,) { }

  ngOnInit(): void {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    let localObj = this.imiapi.getSession('partnerobj');
    this.partnerTotalData = JSON.parse(localObj);
    // console.log(this.partnerTotalData,typeof(this.partnerTotalData));
    // console.log(this.partnerTotalData.userid,"userid","partnerid",this.partnerTotalData.partnerid)
    this.partnerid = this.partnerTotalData.partnerid;
    this.userid = this.partnerTotalData.userid;
  }
  Removepartner(){
 
    this.spinner.show();
    this.imiapi.postData('v1/partner/revoke', {partnerid:this.partnerid,userid:this.userid}).subscribe(
      (response: any) => {
        if ((response.status = '0' )) {
          this.imiapi.setSession('success',true );
          this.router.navigate(['partnerlist']);
          this.spinner.hide();
        }
        else{
          this.imiapi.setSession('failure',false );
          this.router.navigate(['partnerlist']);
        }
        this.spinner.hide();
       
      },
      (error) => {
        
        this.spinner.hide();
      }
    );
  }
  goback() {
    this.router.navigate(['/partnerlist']);
  }
  openNewtab() {
    if (
      this.helpurl == 'undefined' ||
      this.helpurl == 'NA' ||
      this.helpurl == ''
    )
      this.helpurl = this.imiapi.getglobalsettings();
    window.open(this.helpurl);
  }

}
