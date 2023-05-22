import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { CommonService } from '../../../../shared/services/common.service';
import { PageObject, OrderByObject } from "../../../../shared/models/paging";
import { FileUploadComponent } from '../../file-upload/file-upload.component';
import { UploadHistoryComponent } from '../../upload-history/upload-history.component';

@Component({
  selector: 'app-validation-rules-list',
  templateUrl: './validation-rules-list.component.html',
  animations: [
    trigger('openClose', [
      state('open', style({
        display: 'block',
        opacity: 1,
      })),
      state('closed', style({
        display: 'none',
        opacity: 0,
      })),
      transition('open => closed', [
        animate('0.4s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
    ]),
  ],
  styleUrls: ['./validation-rules-list.component.css']
})
export class ValidationRulesListComponent implements OnInit {

  displayedColumns: string[] = ["usercospid","userstatusid","denom","zone","circle"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;

  public packageObj: any;
  public searchString: any = "";
  lastupdatedon = "";
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  constructor(private comm: CommonService, private dialog: MatDialog) {}

  ngOnInit() {
    this.userpermissions = this.comm.getpermissions("");
    this.pageObject.pageNo = 1;
    this.getvalidationList();
  }
  changePage(page: number) {
    if (page) {
      this.pageObject.pageNo = page;
      this.paginator.pageIndex = (page - 1);
      this.getPage({ pageIndex: (this.pageObject.pageNo) });
    }
  }

  changePageSize(obj) {
    this.pageObject.pageNo = 0;
    this.pageObject.pageSize = obj.pageSize;
    this.getvalidationList();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getvalidationList();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getvalidationList();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  getvalidationList() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      search: this.searchString,
      start: start,
      length: this.pageObject.pageSize,
      ordercolumn: this.orderByObject.ordercolumn,
      orderDir: "desc"
    }
    this.comm.postData('packages/validations', requesrParams).subscribe((response: any) => {
      if (response.code == "500" && response.status == "error") {
        this.comm.openDialog("warning", response.message);
        return;
      }
      else if (response.code == "200" && response.status.toLowerCase() == "success") {
        if (response && response.prepaidValidation && response.prepaidValidation) {
          this.dataSource = new MatTableDataSource(response.prepaidValidation);
          this.pageObject.totalRecords = response.recordsTotal;
          this.pageObject.totalPages = response.recordsFiltered;
          this.lastupdatedon = response.lastupdatedon;
        }
        else {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
        }
      }
    });
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  openFileUploadDialog() { 
    const dialogRef = this.dialog.open(FileUploadComponent, {
    width: '650px',
    data: "Validations",
    disableClose: true
  });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    this.getvalidationList();
  });
    
  }
  openHistory(): void {
    const dialogRef = this.dialog.open(UploadHistoryComponent, {
      width: '850px',
      data: "Validations",
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getvalidationList();
    });
  }
}