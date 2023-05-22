import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';

import { FormsModule } from '@angular/forms';

import {ForgetpasswordComponent} from '../auth/components/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';



@NgModule({
  declarations: [AuthComponent,ForgetpasswordComponent, ResetpasswordComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    
    
    
  ]
})
export class AuthModule { }
