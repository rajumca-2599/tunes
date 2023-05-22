
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from '../../../shared/services/common.service';
import { FormsModule } from '@angular/forms';
import { EnvService } from '../../../shared/services/env.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})


export class ForgetpasswordComponent implements OnInit {

  userdetails: any;
  constructor(private router: Router , private ccapi: CommonService,public env:EnvService) {
    this.userdetails = {
      username : ""
    };
  }

  forgetpassword() {
    if(!this.userdetails.username){
      this.ccapi.openDialog("warning", 'Enter the login ID to submit');
      return;
    }
    this.ccapi.postData('values/forgotpassword', { loginId: this.userdetails.username }).subscribe((response: any) => {
        if (response.code == "500" || response.status == "error") {
            this.ccapi.openDialog("warning", response.message);
            return;
        }
        else if (response.code == "200" || response.status == "success" || response.status == "Success") {
            this.ccapi.openDialog("success", response.message);
            this.router.navigate(["/"]);
        }
      //var policy = response.data.data;
    });
  }

  ngOnInit() {
   
  }

}
