import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IMIapiService } from 'src/app/shared/imiapi.service';

@Component({
  selector: 'app-partnertermsandcondition',
  templateUrl: './partnertermsandcondition.component.html',
  styleUrls: ['./partnertermsandcondition.component.css']
})
export class PartnertermsandconditionComponent implements OnInit {

  selectedlanguage = 'ID';

  constructor( private imiapi: IMIapiService, public translate: TranslateService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
  switchLang(id: string) {
    if (navigator.onLine) {
      this.selectedlanguage = id;
      this.imiapi.setSessionValue('lang', id);
      this.translate.use(id);
      window.location.reload();
    }
  }


}
