import { Component, OnInit,Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cta-modal',
  templateUrl: './cta-modal.component.html',
  styleUrls: ['./cta-modal.component.css']
})
export class CtaModalComponent implements OnInit {
  type: string;

  selectedlanguage = 'ID';
  appRedircttxt: string = "gotoplaystore";
  param = {value: 'play store'};
  constructor(public bsModalRef: BsModalRef,
      public env: EnvService,
     public imiapi: IMIapiService,
     private translate: TranslateService
    ) { }
  ngOnInit(): void {
 
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);

    if (this.imiapi.getOS() == 'IOS')
    {
        this.appRedircttxt = "gotoappstore";
        this.param.value ="app store";
    }
   
  }

}
