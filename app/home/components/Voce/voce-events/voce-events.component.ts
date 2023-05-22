import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from "@angular/material";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "../../../../shared/services/common.service";
import { PageObject, OrderByObject } from "../../../../shared/models/paging";
import { EventMappingComponent } from "./event-mapping/event-mapping.component";

@Component({
  selector: "app-voce-events",
  templateUrl: "./voce-events.component.html",
  styleUrls: ["./voce-events.component.css"],
})
export class VoceEventsComponent implements OnInit {
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  displayedColumns: string[] = ["event", "actions"];
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;

  public Obj: any;
  public searchString: any = "";
  NgxSpinnerService: any;
  status: any = 1;

  constructor(
    private ccapi: CommonService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {}

  changePage(page: number) {
    if (page) {
      this.pageObject.pageNo = page;
      this.paginator.pageIndex = page - 1;
      this.getPage({ pageIndex: this.pageObject.pageNo });
    }
  }

  changePageSize(obj) {
    this.pageObject.pageNo = 0;
    this.pageObject.pageSize = obj.pageSize;
    this.getvoceeventsList();
  }

  getPage(page: any) {
    this.pageObject.pageNo = page.pageIndex;
    this.getvoceeventsList();
  }

  customSort(column: any) {
    this.orderByObject.ordercolumn = column.active;
    this.orderByObject.direction = column.direction;
    this.getvoceeventsList();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.userpermissions = this.ccapi.getpermissions("");
    this.dataSource.sort = this.sort;

    this.pageObject.pageNo = 1;
    this.getvoceeventsList();
  }
  getvoceeventsList() {
    // voce/getevents
    let start = 1;
    if (this.pageObject.pageNo > 1)
      start = (this.pageObject.pageNo - 1) * this.pageObject.pageSize + 1;
    let requesrParams = {
      start: start,
      length: this.pageObject.pageSize,
      roleid: this.ccapi.getRole(),
      userId: this.ccapi.getUserId(),
    };
    this.spinner.show();
    this.ccapi.postData("voce/geteventsmap", requesrParams).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.code == "500") {
          this.dataSource = new MatTableDataSource([]);
          this.pageObject.totalRecords = 0;
          this.pageObject.totalPages = 0;
          this.dataSource.sort = this.sort;

          this.ccapi.openDialog("warning", response.message);
          return;
        } else if (
          response.code == "200" &&
          response.status.toLowerCase() == "success"
        ) {
          if (response && response.eventmap != null && response.eventmap.length > 0) {
            this.dataSource = new MatTableDataSource(response.eventmap);
            this.pageObject.totalRecords = response.recordsTotal;
            this.pageObject.totalPages = response.recordsFiltered;
            this.dataSource.sort = this.sort;
          } else {
            this.dataSource = new MatTableDataSource([]);
            this.pageObject.totalRecords = 0;
            this.dataSource.sort = this.sort;

            this.pageObject.totalPages = 0;
            this.ccapi.openSnackBar("No Records Found");
          }
        }
      },
      (error) => {
        this.spinner.hide();
        this.ccapi.HandleHTTPError(error);
      }
    );
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  mapEvents(obj: any): void {
    if (obj == null && obj == undefined) {
      this.Obj = {
        id: "",
        name: "",
        desc:"",
        mode: "insert",
        status: 1
      }
      const dialogRef = this.dialog.open(EventMappingComponent, {
        width: '850px',
        data: this.Obj,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result != undefined) {
          this.getvoceeventsList();
        }
      });
    }
    else {
      this.Obj = {
        mode: "update",
        id: obj.event_id,
        name: obj.event_name,
        desc:obj.description,
        voiceid:obj.voceid,
        status: obj.status
      }
      const dialogRef = this.dialog.open(EventMappingComponent, {
        width: '850px',
        data: this.Obj,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result != undefined) {
          this.getvoceeventsList();
        }
      });
    }
  }
  navigateToMaster()
  {
    this.router.navigate(["home/vocemaster"])
  }
}
