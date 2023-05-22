import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CommonService } from "../../../shared/services/common.service";

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.css"],
})
export class FileUploadComponent implements OnInit {
  public uploadgtrid: any = "";
  public uploadtype = "";
  public afuConfigId = {};
  public packagetype = "packageattributes";
  public packagetypelist = [
    { id: "packageattributes", name: "PackageAttributes" },
    { id: "packagemapping", name: "PackageMapping" },
    { id: "packagemaster", name: "Package Master" },
  ];
  constructor(
    private ccapi: CommonService,
    private dialogRef: MatDialogRef<FileUploadComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.uploadtype = data;
    this.afuConfigId = {
      formatsAllowed: ".csv",
      maxSize: "12",
      theme: "dragNDrop",
      uploadAPI: {
        url: this.ccapi.getUrl("files/uploadFile"),
        headers: {
          "Access-Control-Allow-Origin": "*",
          accesskey: this.ccapi.getAccessKey(),
          "x-imi-uploadtype":
            this.uploadtype == "Packages" ? this.packagetype : this.uploadtype,
        },
      },
    };
  }

  ngOnInit() {}
  toggleCancel() {
    this.dialogRef.close();
  }
  DocUpload(e) {
    let res = e.response;
    let result = JSON.parse(res);
    if (result != null && result.code == "200") {
      this.uploadgtrid = result.gtrId;
    } else {
      if (result != null && result.message != null)
        this.ccapi.openDialog("warning", result.message);
      else {
        this.ccapi.openDialog("warning", "Unable to upload file.");
      }
    }
  }
  toggleAdd() {
    this.afuConfigId = {
      formatsAllowed: ".csv",
      maxSize: "12",
      theme: "dragNDrop",
      uploadAPI: {
        url: this.ccapi.getUrl("files/uploadFile"),
        headers: {
          "Access-Control-Allow-Origin": "*",
          accesskey: this.ccapi.getAccessKey(),
          "x-imi-uploadtype":
            this.uploadtype == "Packages" ? this.packagetype : this.uploadtype,
        },
      },
    };
  }
  assignuploadtype() {
    this.afuConfigId = {
      formatsAllowed: ".csv",
      maxSize: "12",
      theme: "dragNDrop",
      uploadAPI: {
        url: this.ccapi.getUrl("files/uploadFile"),
        headers: {
          "Access-Control-Allow-Origin": "*",
          accesskey: this.ccapi.getAccessKey(),
          "x-imi-uploadtype":
            this.uploadtype == "Packages" ? this.packagetype : this.uploadtype,
        },
      },
    };
  }
}
