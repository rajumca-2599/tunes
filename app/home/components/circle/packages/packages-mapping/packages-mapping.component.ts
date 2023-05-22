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
import { Router } from "@angular/router";
import { NgxSpinnerComponent } from "ngx-spinner";
import { Subscription } from "rxjs";
import { ConfirmDialogComponent } from "../../../../../shared/confirm-dialog/confirm-dialog.component";
import { CommonService } from "../../../../../shared/services/common.service";

@Component({
  selector: "app-packages-mapping",
  templateUrl: "./packages-mapping.component.html",
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
  styleUrls: ["./packages-mapping.component.css"],
})
export class PackagesMappingComponent implements OnInit {
  ciclesLst: any;
  categoryLst: any;
  subcategoryLst: any;
  public isOpen: any = true;
  packagecode = "";
  dropdownSettingsCategories = {};
  dropdownSettingsCircles = {};
  selectedItemsCategories: any = [];
  selectedItemsCircles: any = [];
  public packageObj: any;
  public searchString: any = "";
  private _dialog1: Subscription;
  categoryid = "";
  title = "";
  price = "";
  info = "";
  benfits = "";
  description = "";
  status="";
  data="";
  sms="";
  validity="";
  voice="";
  searchkeywords="";
  packagetype:any;
  constructor(
    private comm: CommonService,
    private dialogRef: MatDialogRef<PackagesMappingComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private dialog: MatDialog,
    private router: Router
  ) {
    if (data != undefined && data != null) {
      this.packagecode = data;
    }
  }

  ngOnInit() {
    this.dropdownSettingsCategories = {
      singleSelection: false,
      idField: "catid",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 7,
      allowSearchFilter: true,
    };
    this.dropdownSettingsCircles = {
      singleSelection: false,
      idField: "circleId",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 7,
      allowSearchFilter: true,
    };
    this.getMappingList();
    this.getCategories();
    this.getCircles();
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  getMappingList() {
    let requesrParams = {
      start: 1,
      length: 100,
      orderDir: "desc",
      code: this.packagecode,
    };
    this.comm.showhttpspinner();
    this.comm
      .postData("packages/mapping", requesrParams)
      .subscribe((response: any) => {
        this.comm.hidehttpspinner();
        if (response.code == "500" && response.status == "error") {
          this.comm.openDialog("warning", response.message);
          return;
        } else if (
          response.code == "200" &&
          response.status.toLowerCase() == "success"
        ) {
          if (response && response.packagemapping && response.packagemapping) {
            this.packageObj = response.packagemapping;
            if (this.packageObj != null && this.packageObj.length > 0) {
              this.selectedItemsCategories =
                response.packagemapping[0].categories;
              this.selectedItemsCircles = response.packagemapping[0].circles;
              this.categoryid = this.selectedItemsCategories[0].parentid;
              this.title = response.packagemapping[0].title;
              this.price = response.packagemapping[0].price;
              this.info = response.packagemapping[0].info;
              this.benfits = response.packagemapping[0].benfits;
              this.description = response.packagemapping[0].description;
              this.status=response.packagemapping[0].status;
              this.sms=response.packagemapping[0].sms;
              this.validity=response.packagemapping[0].validity;
              this.voice=response.packagemapping[0].voice;
              this.sms=response.packagemapping[0].sms;
              this.data=response.packagemapping[0].data;
              this.searchkeywords=response.packagemapping[0].searchkeywords;
              this.packagetype=response.packagemapping[0].packagetype;
            }
            this.getCategories();
          }
        }
      });
  }
  close() {
    this.dialogRef.close();
  }
  getCircles() {
    let requesrParams = {
      start: 0,
      length: 30,
      orderDir: "desc",
    };
    this.comm
      .postData("packages/circle", requesrParams)
      .subscribe((response: any) => {
        if (
          response.code == "200" &&
          response.status.toLowerCase() == "success"
        ) {
          this.ciclesLst = response.circles;
        }
      });
  }
  getCategories() {
    let requesrParams = {
      start: 0,
      length: 30,
      orderDir: "desc",
    };
    this.comm
      .postData("packages/categories", requesrParams)
      .subscribe((response: any) => {
        if (
          response.code == "200" &&
          response.status.toLowerCase() == "success"
        ) {
          this.categoryLst = response.categories;
          if (this.categoryid == "" || this.categoryid == null)
            this.categoryid = this.categoryLst[0].catid;
          this.getSubCategories();
        }
      });
  }
  getSubCategories() {
    this.categoryLst.forEach((element) => {
      if (element.catid == this.categoryid) {
        this.subcategoryLst = element.subcategories;
      }
    });
  }
  public onDropDownClose(item: any) {
    console.log(item);
  }

  public onItemSelect(item: any) {
    console.log(item);
  }
  public onDeSelect(item: any) {
    console.log(item);
  }

  public onSelectAll(items: any) {
    console.log(items);
  }
  public onCircleSelectAll(items: any) {
    console.log(items);
  }
  public onDeSelectAll(items: any) {
    console.log(items);
  }
  updatemapping() {
    if (this.validate()) {
      let req = {
        title: this.title,
        price: this.price,
        packagecode: this.packagecode,
        categoryid: Array.prototype.map
          .call(this.selectedItemsCategories, function (item) {
            return item.catid;
          })
          .join(","),
        circleId: Array.prototype.map
          .call(this.selectedItemsCircles, function (item) {
            return item.circleId;
          })
          .join(","),
        info: this.info,
        benfits: this.benfits,
        description:this.description,
        status:this.status,
        data:this.data,
        sms:this.sms,
        validity:this.validity,
        voice:this.voice,
        searchkeywords:this.searchkeywords,
        packagetype:this.packagetype
      };
      this.comm.showhttpspinner();
      this.comm.postData("packages/updatemapping", req).subscribe(
        (resp: any) => {
          this.comm.hidehttpspinner();
          if (resp.code == "200" && resp.status == "success") {
            this.comm.openDialog("success", resp.message);
            this.dialogRef.close(resp);
            // this.router.navigate(["home/packagelist"]);
          } else {
            this.comm.openDialog("error", resp.message);
            // this.close();
          }
        },
        (err) => {
          this.comm.HandleHTTPError(err);
        }
      );
    }
  }
  deletemapping() {
    if (this.packageObj[0].packagecode != undefined) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        width: "400px",
        data: {
          message:
            "Are you sure want to delete Mapping (" +
            this.packageObj[0].packagecode +
            ")?",
          confirmText: "Yes",
          cancelText: "No",
        },
      });
      this._dialog1 = dialogRef.afterClosed().subscribe((result) => {
        if (!result) {
          this.comm.showhttpspinner();
          this.comm
            .postData("packages/deletemapping", {
              packagecode: this.packageObj[0].packagecode,
            })
            .subscribe(
              (resp: any) => {
                this.comm.hidehttpspinner();
                if (resp.code == "200") {
                  this.comm.openDialog(
                    "success",
                    "Mapping has been deleted successfully."
                  );
                  this.close();
                  this.router.navigate(["home/packagelist"]);
                } else {
                  this.comm.openDialog("Error", resp.message);
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
  validate() {
    if (this.title == "" || this.title == undefined || this.title == null) {
      this.comm.openDialog("error", "Package title is required.");
      return false;
    }
    if (this.price == "" || this.price == undefined || this.price == null) {
      this.comm.openDialog("error", "Price is required.");
      return false;
    }
    if (this.info == "" || this.info == undefined || this.info == null) {
      this.comm.openDialog("error", "Info is required.");
      return false;
    }
    if (this.packagetype == "" || this.packagetype == undefined || this.packagetype == null) {
      this.comm.openDialog("error", "packagetype is required.");
      return false;
    }
    if (this.searchkeywords == "" || this.searchkeywords == undefined || this.searchkeywords == null) {
      this.comm.openDialog("error", "searchkeywords is required.");
      return false;
    }
    if (
      this.benfits == "" ||
      this.benfits == undefined ||
      this.benfits == null
    ) {
      this.comm.openDialog("error", "Benefits is required.");
      return false;
    }
    if (
      this.selectedItemsCategories == "" ||
      this.selectedItemsCategories == undefined ||
      this.selectedItemsCategories == null ||
      this.selectedItemsCategories.length < 1
    ) {
      this.comm.openDialog("error", "Please select atleast one category.");
      return false;
    }
    if (
      this.selectedItemsCircles == "" ||
      this.selectedItemsCircles == undefined ||
      this.selectedItemsCircles == null ||
      this.selectedItemsCircles.length < 1
    ) {
      this.comm.openDialog("error", "Please select atleast one circle.");
      return false;
    }
    if (
      this.data == "" ||
      this.data == undefined ||
      this.data == null
    ) {
      this.comm.openDialog("error", "Data is required.");
      return false;
    }
    if (
      this.voice == "" ||
      this.voice == undefined ||
      this.voice == null
    ) {
      this.comm.openDialog("error", "Voice is required.");
      return false;
    }
    if (
      this.sms == "" ||
      this.sms == undefined ||
      this.sms == null
    ) {
      this.comm.openDialog("error", "SMS is required.");
      return false;
    }
   
    if (
      this.validity == "" ||
      this.validity == undefined ||
      this.validity == null
    ) {
      this.comm.openDialog("error", "Validity is required.");
      return false;
    }
    return true;
  }
}
