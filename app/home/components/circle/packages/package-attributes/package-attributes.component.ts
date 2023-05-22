import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { CommonService } from "../../../../../shared/services/common.service";
import { PageObject, OrderByObject } from "../../../../../shared/models/paging";
import { ConfirmDialogComponent } from "../../../../../shared/confirm-dialog/confirm-dialog.component";
@Component({
  selector: "app-package-attributes",
  templateUrl: "./package-attributes.component.html",
  animations: [
    trigger("openClose", [
      state(
        "open",
        style({
          display: "block",
          opacity: 1,
        })
      ),
      state(
        "closed",
        style({
          display: "none",
          opacity: 0,
        })
      ),
      transition("open => closed", [animate("0.4s")]),
      transition("closed => open", [animate("0.3s")]),
    ]),
  ],
  styleUrls: ["./package-attributes.component.css"],
})
export class PackageAttributesComponent implements OnInit {
  displayedColumns: string[] = ["code", "name", "value", "actions"];
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public isOpen: any = true;
  public isAddOpen: any = false;
  public iscreate = false;
  packagecode = "";
  code = "";
  name = "";
  value = "";
  constructor(
    private comm: CommonService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PackageAttributesComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    if (data != undefined && data != null) {
      this.packagecode = data;
      this.code = data;
    }
  }

  ngOnInit() {
    this.userpermissions = this.comm.getpermissions("");
    if (
      this.packagecode != null &&
      this.packagecode != undefined &&
      this.packagecode != ""
    ) {
      this.getAttributesList();
    }
  }
  getAttributesList() {
    let requesrParams = {
      start: 1,
      length: 30,
      orderDir: "desc",
      code: this.packagecode,
    };
    this.comm
      .postData("packages/attributes", requesrParams)
      .subscribe((response: any) => {
        if (response.code == "500" && response.status == "error") {
          this.comm.openDialog("warning", response.message);
          return;
        } else if (
          response.code == "200" &&
          response.status.toLowerCase() == "success"
        ) {
          if (
            response &&
            response.packageattributes &&
            response.packageattributes
          ) {
            this.dataSource = new MatTableDataSource(
              response.packageattributes
            );
            this.pageObject.totalRecords = response.recordsTotal;
            this.pageObject.totalPages = response.recordsFiltered;
          }
        }
      });
  }

  addattributes() {
    if (
      this.code.trim() == "" ||
      this.name.trim() == "" ||
      this.value.trim() == ""
    ) {
      this.comm.openDialog("warning", "All Fields are Mandatory");
      return;
    }
    let url = "";
    if (this.iscreate) url = "packages/createattributes";
    else url = "packages/updateattributes";
    let obj: any = {
      value: this.value,
      name: this.name,
      code: this.code,
    };

    this.comm.postData(url, obj).subscribe(
      (resp: any) => {
        if (resp.code == "200") {
          this.comm.openDialog("success", resp.message);
          this.isAddOpen = false;
          this.code = "";
          this.value = "";
          this.name = "";
          this.getAttributesList();
        } else this.comm.openDialog("warning", resp.message);
      },
      (err) => {
        this.comm.HandleHTTPError(err);
      }
    );
  }
  toggle() {
    this.code = "";
    this.name = "";
    this.value = "";
    this.isOpen = !this.isOpen;
    this.isAddOpen = false;
  }
  toggleadd(obj) {
    this.isAddOpen = !this.isAddOpen;
    this.isOpen = false;
    if (obj == undefined || obj == null) {
      this.code = this.packagecode;
      this.name = "";
      this.value = "";
      this.isAddOpen = true;
      this.iscreate = true;
    } else {
      this.code = this.packagecode;
      this.name = obj.name;
      this.value = obj.value;
      this.isAddOpen = true;
      this.iscreate = false;
    }
  }
  deleteattribute(code, name: string): void {
    if (this.code != undefined) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        width: "400px",
        data: {
          message: "Are you sure want to delete attribute (" + name + ")?",
          confirmText: "Yes",
          cancelText: "No",
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (!result) {
          var obj = {
            name: name,
            code: code,
          };
          this.comm.postData("packages/deleteattributes", obj).subscribe(
            (resp: any) => {
              if (resp.code == "200") {
                this.comm.openDialog(
                  "success",
                  "Attribute has been deleted successfully."
                );
                this.getAttributesList();
              }
            },
            (err) => {
              this.comm.HandleHTTPError(err);
            }
          );
        }
      });
    }
  }
  close() {
    this.dialogRef.close();
  }
  closecreateoredit() {
    this.toggle();
  }
}
