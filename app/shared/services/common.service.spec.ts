 

import { CommonService } from './common.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import {
  MatTableDataSource, MatTableModule, MatDialog,
  MatDialogModule, MatSnackBar, MatSnackBarModule, MatBadgeModule, MatPaginatorModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { SelectModule } from 'ng2-select';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CommonService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [        MatTableModule,               
      NgxPaginationModule,    
      MatBadgeModule,
      CommonModule,
      FormsModule,
      RouterModule,
      BrowserModule,
      ReactiveFormsModule,
      // SelectModule,
      HttpClientModule,
      MatDialogModule,
      MatSnackBarModule,
      BrowserAnimationsModule ,
      RouterModule.forRoot([])
    ]
  }));

  it('should be created', () => {
    const service: CommonService = TestBed.get(CommonService);
    expect(service).toBeTruthy();
  });
});
