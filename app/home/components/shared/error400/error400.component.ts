import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../shared/services/common.service';

@Component({
  selector: 'app-error400',
  templateUrl: './error400.component.html',
  styleUrls: ['./error400.component.css']
})
export class Error400Component implements OnInit {

  constructor(private ccapi: CommonService) { }

  ngOnInit() {
    this.ccapi.hidehttpspinner();
  }

}
