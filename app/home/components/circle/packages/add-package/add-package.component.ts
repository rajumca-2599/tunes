import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CommonService } from "../../../../../shared/services/common.service";

@Component({
  selector: "app-add-package",
  templateUrl: "./add-package.component.html",
  styleUrls: ["./add-package.component.css"],
})
export class AddPackageComponent implements OnInit {
  public pckObj = {
    code: "",
    name: "",
    benfits: "",
    data: "",
    sms: "",
    voice: "",
    validity: "",
    info: "",
    description: "",
    keyword: "",
    icon: "",
    categoryid: "0",
  };
  constructor(
    private comm: CommonService,
    private dialogRef: MatDialogRef<AddPackageComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {}

  ngOnInit() {}
  close() {
    this.dialogRef.close();
  }
  addPackage() {
    if (this.validate()) {
      this.comm.showhttpspinner();
      this.comm.postData("packages/createpack", this.pckObj).subscribe(
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
  validate() {
    if (
      this.pckObj.code == "" ||
      this.pckObj.code == undefined ||
      this.pckObj.code == null
    ) {
      this.comm.openDialog("error", "Code is required.");
      return false;
    }
    if (
      this.pckObj.name == "" ||
      this.pckObj.name == undefined ||
      this.pckObj.name == null
    ) {
      this.comm.openDialog("error", "Name is required.");
      return false;
    }
    if (
      this.pckObj.benfits == "" ||
      this.pckObj.benfits == undefined ||
      this.pckObj.benfits == null
    ) {
      this.comm.openDialog("error", "Benefits is required.");
      return false;
    }
    if (
      this.pckObj.data == "" ||
      this.pckObj.data == undefined ||
      this.pckObj.data == null
    ) {
      this.comm.openDialog("error", "Data is required.");
      return false;
    }
    if (
      this.pckObj.sms == "" ||
      this.pckObj.sms == undefined ||
      this.pckObj.sms == null
    ) {
      this.comm.openDialog("error", "SMS is required");
      return false;
    }
    if (
      this.pckObj.voice == "" ||
      this.pckObj.voice == undefined ||
      this.pckObj.voice == null
    ) {
      this.comm.openDialog("error", "Voice is required.");
      return false;
    }
    if (
      this.pckObj.validity == "" ||
      this.pckObj.validity == undefined ||
      this.pckObj.validity == null
    ) {
      this.comm.openDialog("error", "Validity is required.");
      return false;
    }
    return true;
  }
}
