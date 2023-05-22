
import { MatTableDataSource, MatPaginator,MatBadgeModule  } from '@angular/material';
import { HomeComponent } from './home.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
// import { SelectModule } from 'ng2-select';
import { RouterModule } from '@angular/router';
 
import { Component, OnInit, NgModule } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpEvent } from '@angular/common/http';

import { HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from '../shared/services/common.service';
import { MatDialog, MatDialogModule ,MatSnackBar, MatSnackBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ HomeComponent ],
      imports:[
        MatBadgeModule,
        CommonModule,
        FormsModule,
        RouterModule ,
        ReactiveFormsModule,
        // SelectModule,
        HttpClientModule,
        MatDialogModule,
        MatSnackBarModule,
        RouterModule.forRoot([])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
