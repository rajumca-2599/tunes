import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ValidateOtpComponent } from './validate-otp/validate-otp.component';


const routes: Routes = [
  {path:"", component:AuthComponent},
  {path:"validateotp",component:ValidateOtpComponent}
  ];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AuthRoutingModule { }
