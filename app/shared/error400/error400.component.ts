import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-error400',
  templateUrl: './error400.component.html',
  styleUrls: ['./error400.component.css']
})
export class Error400Component implements OnInit {

  constructor( private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.hide();
  }

}
