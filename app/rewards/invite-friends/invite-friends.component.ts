import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ShareService } from '@ngx-share/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.component.html',
  styleUrls: ['./invite-friends.component.css'],
})
export class InviteFriendsComponent implements OnInit {
  public referralCode: any = '';
  helpurl = '';
  data: any = '';
  description = '';
  fbIcon = faFacebookSquare;
  mgmurl = '';
  constructor(
    public env: EnvService,
    public imiapi: IMIapiService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private apidata: ApidataService,
    public share: ShareService,
    public sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setFooter();
    this.navigateToTop();
    let code = this.imiapi.getSession('redeem_code');
    if (code != '' && code != 'NA' && code != undefined)
      this.referralCode = JSON.parse(code);
    let data = this.imiapi.getSession('redeem_mgmdata');
    if (data != '' && data != 'NA' && data != undefined)
      this.data = JSON.parse(data);
    this.description = this.data.msg;
    this.description += '\n';
    this.description += '\n YOUR REFERRAL CODE:' + this.referralCode;
    this.description += '\n';
    this.helpurl = this.imiapi.getglobalsettings();
    if (this.imiapi.getSelectedLanguage() == 'EN') {
      let engurl = this.imiapi.getSession('mgmengurl');
      this.mgmurl = JSON.parse(engurl);
    } else {
      let idurl = this.imiapi.getSession('mgmidurl');
      this.mgmurl = JSON.parse(idurl);
    }
  }
  setFooter() {
    this.apidata.footerstateName.next('rewards');
    this.imiapi.setStorageValue('footerstateName', 'rewards');
  }
  navigateToTop() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  goback() {
    this.router.navigate(['/rewards']);
  }
  ngAfterViewInit() {
    this.ref.detach();
  }
  copyCode(inputElement) {   
    inputElement.select();  
    document.execCommand('copy');  
    inputElement.setSelectionRange(0, 0);  
  }
}
