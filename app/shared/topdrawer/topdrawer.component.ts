import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-topdrawer',
  templateUrl: './topdrawer.component.html',
  styleUrls: ['./topdrawer.component.css']
})
export class TopdrawerComponent implements OnInit, AfterViewInit {
  isShow: boolean = true;
  selectedlanguage = 'ID';
  constructor(public env: EnvService, public imiapi: IMIapiService, private translate: TranslateService) {
    /* if (this.imiapi.getSession("lang") == "ID")
      this.selectedlanguage = "ID";
      this.translate.use(this.selectedlanguage); */
  }
  ngOnInit(): void {

    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);

    if(this.imiapi.getSession("topdrawer") == "NA")
    {
      this.isShow = true;
    }
    else
    {
      this.isShow =this.imiapi.getSession("topdrawer")==="1"
     
    }
  }
  ngAfterViewInit() {
  }
  enableToggle() {
    this.isShow = !this.isShow;
    this.imiapi.setSessionValue("topdrawer", this.isShow ? "1" : "0");
  }
}