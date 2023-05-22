import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../shared/services/common.service';
@Component({
  selector: 'app-error405',
  templateUrl: './error405.component.html',
  styleUrls: ['./error405.component.css']
})
export class Error405Component implements OnInit {

  
  constructor(private ccapi: CommonService) { }

  ngOnInit() {
    this.ccapi.hidehttpspinner();
  }

}
