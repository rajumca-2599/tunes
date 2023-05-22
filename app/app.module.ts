import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MsgdialogueboxComponent } from './shared/msgdialoguebox/msgdialoguebox.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { CommonService } from './shared/services/common.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule , MatButtonModule} from '@angular/material';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { MaterialModule } from './shared/modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor/';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
//import { NumbersOnlyDirective } from './shared/directives/numbersonly';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { EnvServiceProvider } from '../../src/app/shared/services/env.service.provider';
import { AlertDialogComponent } from './home/components/reports/reports-list/reports-list.component';


// import { TitlespecialDirective } from './shared/directives/titlespecial.directive';



@NgModule({
  declarations: [
    AppComponent,
    MsgdialogueboxComponent,
    ConfirmDialogComponent,
    AlertDialogComponent
    // NumbersOnlyDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,NgxSpinnerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MaterialModule,
    FormsModule,
    AngularEditorModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    // SelectModule,
    CommonModule,
    ColorPickerModule,
    AngularFileUploaderModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxJsonViewerModule 
  ],
  providers: [
    CommonService,EnvServiceProvider
  ],
  bootstrap: [AppComponent],
  entryComponents:[ MsgdialogueboxComponent,ConfirmDialogComponent, AlertDialogComponent]
})
export class AppModule { }
