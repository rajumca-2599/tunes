import { Component, OnInit } from '@angular/core';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';

@Component({
  selector: 'app-appredirect',
  templateUrl: './appredirect.component.html',
  styleUrls: ['./appredirect.component.css']
})
export class AppredirectComponent implements OnInit {

  constructor(private env: EnvService,
    public imiapi: IMIapiService) { 

    
    }

  ngOnInit(): void {
    if (this.imiapi.getOS() == 'IOS')
      location.href =this.env.appStoreUrl;
    else
      location.href =this.env.playStoreUrl;
  }

}
