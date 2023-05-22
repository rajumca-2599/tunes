import { Component, NgZone, OnInit } from '@angular/core';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { TranslateService } from '@ngx-translate/core';
import { EnvService } from 'src/app/shared/env.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { CtaModalComponent } from '../../shared/cta-modal/cta-modal.component';
import { Router } from '@angular/router';
import { ApidataService } from 'src/app/shared/apidata.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  ispostpaid: boolean = false;
  selectedlanguage = 'ID';

  modalRef: BsModalRef;
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private translate: TranslateService,
    private modalService: BsModalService,
    private router: Router,private apidata:ApidataService

  ) {}

  ngOnInit(): void {
    this.imiapi.setStorageValue('page', 'myaccount');
    this.imiapi.setStorageValue('footerstateName', 'myaccount');
    this.apidata.footerstateName.next('myaccount');
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);

    if (this.imiapi.getSubstype() == 'POSTPAID') this.ispostpaid = true;
  }

  // openCTAModal() {
  //   this.modalRef = this.modalService.show(CtaModalComponent, {
  //     class: 'modal-dialog-centered',
  //   });
  // }
  navigateToHistory() {
   
    this.router.navigate(['/transhistory']);
}
  navigateToBillingHistory() {
    this.router.navigate(['/billinghistory']);
  }
  navigateToUsageHistory(){
    this.router.navigate(['/usagehistory']);
  }
}
