import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/shared/SharedService';
declare var $: any;
@Component({
  selector: 'app-inbox-landing',
  templateUrl: './inbox-landing.component.html',
  styleUrls: ['./inbox-landing.component.css'],
})
export class InboxLandingComponent implements OnInit, OnDestroy {
  public messages: any;
  config: SwiperConfigInterface = {
    slidesPerView: 1,
    spaceBetween: 10,
    centeredSlides: true,
    slideToClickedSlide: true,
  };
  sourceScreen = '';
  constructor(
    public env: EnvService,
    public imiapi: IMIapiService,
    private cd: ChangeDetectorRef,
    private modalService: BsModalService,
    private translate: TranslateService,
    private router: Router,
    private apiData: ApidataService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private shareddata:SharedService
  ) {}
  selectedlanguage = 'ID';
  showfullmessage: boolean = false;
  singlemessage: any;
  ngOnInit(): void {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.sourceScreen = this.route.snapshot.params.sourcescreen;
    this.getmessages();
  }
 
  getmessages() {
    this.spinner.show();
    this.imiapi.postData('v1/notifications/list', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.status != null) {
          if (response.status == '0') {
            this.messages = response.data;
          }
          else  if (response.code == '10002' || response.code == '11111') {
            this.imiapi.clearSession();
            // this.router.navigate(['/login']);
            // Added on 27thjune to redirect to HE 
            this.router.navigate(['/pwa']);
          }
        }
      },
      (error) => {
       // console.log(error);
      }
    );
  } 
  undoDelete() {}
  deleteall() {
    this.spinner.show();
    this.imiapi.postData('v1/notifications/deleteall', {}).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.status != null && response.status == '0') {
          //  $('#delall-modal').modal('show');
          this.getmessages();
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
    this.imiapi.setStorageValue('footerstateName', this.sourceScreen);
    this.apiData.footerstateName.next(this.sourceScreen);
    this.showfullmessage = false;
    this.router.navigate(['/' + this.sourceScreen]);
  }
  deleteMessage(transactionId: any) {
    this.spinner.show();
    var obj = { id: transactionId, action: 'update', status: 'D' };
    this.imiapi.postData('v1/notifications/delete', obj).subscribe(
      (response: any) => {
        if (response.status != null && response.status == '0') {
         this.getmessages();
        }
        else
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide()
      //  console.log(error);
      }
    );
  }
 
  showMessage(item: any) {
    this.singlemessage = item;
    this.showfullmessage = true;
    this.shareddata.setOption('inboxmessage',item);
    this.router.navigate(['/viewmessage/' + this.sourceScreen]);
  }
  disablefullMessage() {
    this.showfullmessage = false;
    this.getmessages();
  }
  closeModal() {
    $('#delall-modal').modal('hide');
  }
  ngOnDestroy() {
    $('#delall-modal').modal('hide');
    $('#popup001').modal('hide');
  }
}
