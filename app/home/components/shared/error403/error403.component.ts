import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../shared/services/common.service';
@Component({
  selector: 'app-error403',
  templateUrl: './error403.component.html',
  styleUrls: ['./error403.component.css']
})
export class Error403Component implements OnInit {

 
  constructor(private ccapi: CommonService) { }

  ngOnInit() {
    this.ccapi.hidehttpspinner();
  }

}
