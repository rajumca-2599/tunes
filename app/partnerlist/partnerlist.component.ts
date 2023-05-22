import { Component, OnInit } from '@angular/core';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { TranslateService } from '@ngx-translate/core';
import { EnvService } from 'src/app/shared/env.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { CtaModalComponent } from 'src/app/shared/cta-modal/cta-modal.component';
import { Router } from '@angular/router';
import { ApidataService } from 'src/app/shared/apidata.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-partnerlist',
  templateUrl: './partnerlist.component.html',
  styleUrls: ['./partnerlist.component.css']
})
export class PartnerlistComponent implements OnInit {

  ispostpaid: boolean = false;
  selectedlanguage = 'ID';
  partnerListData:any=[];
  partnerid:any;
  userid:any;
  helpurl = '';
  dataListValue:boolean=false;
  newdataList:boolean=true;
  successMsg:any;
  failureMsg:any;
  successMsgbool:boolean=false;
  failureMsgbool:boolean=false;
  

  modalRef: BsModalRef;
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private modalService: BsModalService,
    private router: Router,private apidata:ApidataService,
    private datePipe: DatePipe

  ) {}

  ngOnInit(): void {

    this.successMsg = this.imiapi.getSession('success');
    if(this.successMsg=="true"){
      this.successMsgbool=true
    }
    if(this.failureMsg=="false"){
      this.failureMsgbool=true;
    }

    this.failureMsg = this.imiapi.getSession('failure');
    console.log(this.successMsg,typeof(this.successMsg), this.failureMsg,typeof(this.failureMsg))
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
   this.userlistStatus();
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
  goback() {
    this.router.navigate(['/more']);
  }

  userlistStatus() {
    this.spinner.show();
    this.imiapi.postData('v1/partner/list', {}).subscribe(
      (response: any) => {
        if ((response.status = '0' && response.data != null)) {
          this.partnerListData = response.data;
          this.userid=response.data.userid;
          this.partnerid=response.data.partnerid;
          console.log(this.partnerListData.connected_since)
          if(this.partnerListData.length>0){
            this.dataListValue=true;
            
          }
          else{
            this.dataListValue=false;
            this.newdataList=false;
          }
          setTimeout(() => {
            this.successMsgbool=false;
            this.failureMsgbool=false;
           }, 5000);
           this.imiapi.removeSession('success');
           this.imiapi.removeSession('failure');  
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  switchLang(id: string) {
    if (navigator.onLine) {
      this.selectedlanguage = id;
      this.imiapi.setSessionValue('lang', id);
      this.translate.use(id);
      window.location.reload();
    }
  }
  navigateToHistory(row:any){
   
    this.imiapi.setSession('partnerobj', row);
   
    this.router.navigate(['/partnerdetails']);
  }
  transformDate(newdate:any) {
    return this.datePipe.transform(newdate, 'dd-mm-yyyy'); //whatever format you need. 
  }
}