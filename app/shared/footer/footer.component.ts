import { Component, OnInit, Input } from '@angular/core';
import { EnvService } from '../env.service';
import { IMIapiService } from '../imiapi.service';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { CtaModalComponent } from '../../shared/cta-modal/cta-modal.component';
import { ApidataService } from '../apidata.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  @Input() public stateName: string;
  appRedircttxt: string = 'Go to Play store';
  selectedlanguage = 'ID';
  modalRef: BsModalRef;
  @Input() public footerstateName: string;

  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private router: Router,
    private translate: TranslateService,
    private modalService: BsModalService,
    private apidata: ApidataService
  ) {
    this.apidata.footerstateName.subscribe((msg) => {
      this.footerstateName = msg.toString();
      console.log(this.footerstateName);
    });
  }

  ngOnInit(): void {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);

    if (
      !(
        this.imiapi.getStorage('footerstateName') == '' ||
        this.imiapi.getStorage('footerstateName') == 'undefined' ||
        this.imiapi.getStorage('footerstateName') == 'NA'
      )
    )
      this.stateName = this.imiapi.getStorage('page');
    this.footerstateName = this.imiapi.getStorage('footerstateName');
    // if (this.footerstateName.includes('package')) {
    //   this.footerstateName = 'package';
    // }
  }

  TabClick(tabName: string) {
    //this.imiapi.removeSession("displaywelcomemodal");
    this.imiapi.setStorageValue('page', tabName);
    this.imiapi.setStorageValue('footerstateName', tabName);
    this.footerstateName = tabName;
    this.stateName = tabName;
    this.router.navigate(['/' + tabName]);
  }

  openCTAModal() {
    this.modalRef = this.modalService.show(CtaModalComponent, {
      class: 'modal-dialog-centered',
    });
  }
}
