import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MsgdialogueboxComponent } from './shared/msgdialoguebox/msgdialoguebox.component'
import {NgxSpinnerModule} from 'ngx-spinner';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { CommonService } from './shared/services/common.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { alarm, alarmFill, alignBottom } from 'ngx-bootstrap-icons';

import { CommonModule } from '@angular/common';
import { allIcons } from 'ngx-bootstrap-icons';
import { LoginComponent } from './components/login/login.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { RBTportaldashboardComponent } from './components/rbtportaldashboard/rbtportaldashboard.component';
import { ToptandingComponent } from './components/toptanding/toptanding.component';
import { PersonalizenametuneComponent } from './components/personalizenametune/personalizenametune.component';
import { LanguagewiselistComponent } from './components/languagewiselist/languagewiselist.component';
import { EvergreenclassicsComponent } from './components/evergreenclassics/evergreenclassics.component';
import { FreesongpackComponent } from './components/freesongpack/freesongpack.component';
import { FavouritealbumComponent } from './components/favouritealbum/favouritealbum.component';
import { FunnytunesComponent } from './components/funnytunes/funnytunes.component';
// import * as $ from 'jquery';
import { NametunespopupComponent } from './components/nametunespopup/nametunespopup.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import {  AngMusicPlayerModule } from 'ang-music-player';
import { NgOtpInputModule } from  'ng-otp-input';
import { SearchsongsComponent } from './components/searchsongs/searchsongs.component';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { PunjabitrandingComponent } from './components/punjabitranding/punjabitranding.component';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { NgxPullToRefreshModule } from 'ngx-pull-to-refresh';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotpasswordComponent,
    RBTportaldashboardComponent,
    ToptandingComponent,
    PersonalizenametuneComponent,
    LanguagewiselistComponent,
    EvergreenclassicsComponent,
    FreesongpackComponent,
    FavouritealbumComponent,
    FunnytunesComponent,
    NametunespopupComponent,
    SearchsongsComponent,
    MsgdialogueboxComponent,
    PunjabitrandingComponent,
    
   
    // AlertDialogComponent
    // NumbersOnlyDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,NgxSpinnerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxBootstrapIconsModule.pick(allIcons),
    FormsModule,
    NgxAudioPlayerModule,
    NgxUsefulSwiperModule,
   ModalModule.forRoot(),
    // SelectModule,
   AngMusicPlayerModule,
   NgOtpInputModule,    
   CommonModule,
   NgxPullToRefreshModule,
 
  ],
  providers: [
    CommonService
  ],
  bootstrap: [AppComponent],
  entryComponents:[ ]
})
export class AppModule { }
