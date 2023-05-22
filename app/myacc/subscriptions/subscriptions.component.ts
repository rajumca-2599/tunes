import { Component, OnInit } from '@angular/core';
import { IMIapiService } from '../../shared/imiapi.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { TranslateService } from '@ngx-translate/core';

import { EnvService } from '../../shared/env.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { PayModalComponent } from '../../shared/pay-modal/pay-modal.component';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css'],
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: any = [];
  public hasContent: number = 0;
  placeholders: any[] = [];
  index = 0;
  selectedlanguage = 'ID';
  config: SwiperConfigInterface = {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };
  modalRef: BsModalRef;
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private translate: TranslateService,
    private modalService: BsModalService
  ) {
    this.subscriptions = [];
    this.hasContent = 0;
    this.placeholders = ['0'];
  }

  ngOnInit(): void {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.getsubscriptions();
  }
  getsubscriptions(): void {
    this.imiapi.postData('v1/packages/getvaslist', {}).subscribe(
      (response: any) => {
        if (
          response.status != null &&
          response.status == '0' &&
          response.data != undefined
        ) {
          this.subscriptions = response.data.packageslist;
          if (this.subscriptions.length > 0) this.hasContent = 1;
          else this.hasContent = 2;
        } else {
          this.hasContent = 2;
        }
      },
      (error) => {
        console.log(error);
        this.hasContent = 2;
      }
    );
  }
 

  openPayModal(item: any) {
    //ModalOptions
    //this.modalRef = this.modalService.show(PayModalComponent, { class: 'modal-dialog-centered' });
    item.isSubscription = true;
    this.modalRef = this.modalService.show(PayModalComponent, {
      initialState: { item },
      class: 'modal-dialog-centered',
    });
  }
}
