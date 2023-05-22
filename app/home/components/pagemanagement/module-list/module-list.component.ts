import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatSpinner, } from '@angular/material';
import { MatDialogRef, } from '@angular/material';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonService } from '../../../../shared/services/common.service';
import { PageObject, OrderByObject } from '../../../../shared/models/paging';
import { ModuleStatusChangeComponent } from './../module-status-change/module-status-change.component';
import { ModuleConfigurationComponent } from './../module-configuration/module-configuration.component';
@Component({
  selector: 'app-module-list',
  templateUrl: './module-list.component.html',
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
  styleUrls: ['./module-list.component.css']
})
export class ModuleListComponent implements OnInit {
  displayedColumns: string[] = ["modulename", "moduletype", "IsPositionChange", "createdBy", "createdAt", "modifiedBy", "modifiedAt", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public pageObj: any;
  public searchString: any = "";
  public listData: any;
  public pageid: string;
  public statusObj: any;
  public editObj: any;
  public pagename: string = "";
  public showModulePositionSaveBtn = false;
  constructor(private _service: CommonService, private _route: ActivatedRoute, private dialog: MatDialog) {
    if (this._route.snapshot.params['id']) {
      this.pageid = this._route.snapshot.paramMap.get('id');
      this.pagename = this._route.snapshot.paramMap.get('name');//.toUpperCase();
      console.log(this._route.snapshot.paramMap);
    }
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
    this.getmodules();
  }
  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getmodules();
  }
  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getmodules();
  }
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  ngOnInit() {
    this.showModulePositionSaveBtn = false;
    this.pageObject.pageNo = 1;
    this.getmodules();
  }
  getmodules() {
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      orderDir: "desc",
      search: this.searchString,
      start: start,
      length: this.pageObject.pageSize
    }
    //modulename, desc, IsEditContent, IsStatusChange, IsPositionChange, moduletype
    this.listData = [
      {
      pageid: '1', moduleid: "1", modulename: 'Top Bar', desc: "For Home Page", status: '1', moduletype:"W",
      IsEditEnabled:"0", IsStatusChange:"0", IsPositionChange:"1",
      createdBy: "venkat_ccare26", createdAt: "2019-07-03 10:24:11",
      modifiedBy: "venkat_ccare26", modifiedAt: "2019-07-03 11:24:11"
    },
      {
        pageid: '1', moduleid: "2", modulename: 'Search Bar', desc: "Shown on home page and buy package page only",
        status: '0', moduletype: "W",IsEditEnabled: "0", IsStatusChange: "1", IsPositionChange: "1",position:"0",
        createdBy: "venkat_ccare26", createdAt: "2019-07-03 10:24:11",
        modifiedBy: "venkat_ccare26", modifiedAt: "2019-07-03 11:24:11"
      },
    {
      pageid: '1', moduleid: "3", modulename: 'Home Page Banner', desc: "A Type of module to display banners on top of the page",
      status: '1', moduletype: "B", IsEditEnabled: "1", IsStatusChange: "1", IsPositionChange: "1", position: "0",
      createdBy: "venkat_ccare26", createdAt: "2019-07-03 10:24:11",
      modifiedBy: "venkat_ccare26", modifiedAt: "2019-07-03 11:24:11"
      },
      {
        pageid: '1', moduleid: "4", modulename: 'Package details', desc: "shown basis the active packages and split in Data, Voice SMS Roaming and Content",
        status: '1', moduletype: "P", IsEditEnabled: "1", IsStatusChange: "1", IsPositionChange: "0", position: "0",
        createdBy: "venkat_ccare26", createdAt: "2019-07-03 10:24:11",
        modifiedBy: "venkat_ccare26", modifiedAt: "2019-07-03 11:24:11"
      }];
    // show/hide Module Position Save Button
    var chkpositions = this.listData.filter(function (element, index) {
      return (element.IsPositionChange === "1");
    });
    if (chkpositions.length > 0) {
      this.showModulePositionSaveBtn = true;
    }

    this.dataSource = new MatTableDataSource(this.listData);
    this.pageObject.totalRecords = 2;
    this.pageObject.totalPages = 2;
    //this._service.postData('pages/getpage', requesrParams).subscribe((response: any) => {
    //  if (response.code == "500" && response.status == "error") {
    //    this._service.openDialog("warning", response.message);
    //    return;
    //  }
    //  else if (response.code == "200" && response.status.toLowerCase() == "success") {
    //    if (response && response.data && response.data) {
    //      this.dataSource = new MatTableDataSource(response.data);
    //      this.pageObject.totalRecords = response.recordsTotal;
    //      this.pageObject.totalPages = response.recordsFiltered;
    //    }
    //    else {
    //      this.dataSource = new MatTableDataSource([]);
    //      this.pageObject.totalRecords = 0;
    //      this.pageObject.totalPages = 0;
    //    }
    //  }
    //});
  };
  getModuleType(mt: any): string {
    if (mt == "B") return "Banner";
    else if (mt == "W") return "Web view";
    else return "";
  };
  toggle() {
    this.isOpen = !this.isOpen;
  }
  setchangeStatus(obj) {
    if (obj != undefined) {
      this.statusObj = {
        pageid: obj.pageid,
        moduleid: obj.moduleid,
        modulename: obj.modulename,
        status:obj.status
      }
      const dialogRef = this.dialog.open(ModuleStatusChangeComponent, {
        width: '850px',
        data: this.statusObj,
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.getmodules();
      });
    }
    else {
      this._service.openDialog("warning", "Invalid data");
    }
  }
  editContent(obj) {
    if (obj != undefined) {
      this.editObj = {
        pageid: obj.pageid,
        moduleid: obj.moduleid,
        modulename: obj.modulename,
        moduletype:obj.moduletype
      }
      const dialogRef = this.dialog.open(ModuleConfigurationComponent, {
        width: '850px',
        data: this.editObj,
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.getmodules();
      });
    }
    else {
      this._service.openDialog("warning", "Invalid data");
    }
  }
  saveModulePosition() {
    if (this.listData.length > 0) {
      var chkpositions = this.listData.filter(function (element, index) {
        return (element.IsPositionChange === "1");
      });
      if (chkpositions.length > 0) {
        var reqObj = [];
        for (var i = 0; i < chkpositions.length; i++) {
          var item = { pageid: chkpositions[i].pageid, moduleid: chkpositions[i].moduleid, position: chkpositions[i].position };
          //reqObj.push(item);
        }
        //reqObj.position = true;
        console.log(reqObj);
      }
      else {
        this._service.openDialog("warning", "Atleast one module position need to change.");
      }
    }
  }
 
}
