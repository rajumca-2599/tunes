import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';

import { FormsModule } from '@angular/forms';
import { ValidateOtpComponent } from './validate-otp/validate-otp.component';
import { HeComponent } from './he/he.component';
import { OcwloginComponent } from './ocwlogin/ocwlogin.component';


@NgModule({
  declarations: [
    AuthComponent,
    ValidateOtpComponent,
    HeComponent,
    OcwloginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule
  ]
})
export class AuthModule { }
