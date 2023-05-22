import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from '../../../../../shared/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-packagedef',
  templateUrl: './add-packagedef.component.html',
  styleUrls: ['./add-packagedef.component.css']
})
export class AddPackagedefComponent implements OnInit {
  public title: string = "ADD COMMERCIAL PACKAGE DEFINITION";
  public packagedefobj: any;
  public subcribertypes: any[] = [];
  mode: string = "insert";
  unregFlag = false;
  buyExtraFlag = false;
  constructor(private comm: CommonService, private dialogRef: MatDialogRef<AddPackagedefComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.packagedefobj = {
      pvrCode: "",
      unregKeyword: "",
      unregShortcode: "",
      unregFlag: 'N',
      buyExtraFlag: 'N',
      mode: "insert"
    };
    if (data.mode == "update") {
      this.mode = "update";
      this.title = "EDIT COMMERCIAL PACKAGE DEFINITION"
      this.packagedefobj.pvrCode = data.pvrCode;
      this.packagedefobj.unregShortcode = data.unregShortcode;
      this.packagedefobj.unregKeyword = data.unregKeyword;
      this.packagedefobj.unregFlag = data.unregFlag;
      if (this.packagedefobj.unregFlag == 'Y')
        this.unregFlag = true;
      this.packagedefobj.buyExtraFlag = data.buyExtraFlag;
      if (this.packagedefobj.buyExtraFlag == 'Y')
        this.buyExtraFlag = true;
      this.packagedefobj.mode = "update";
    }
  }

  ngOnInit() {

  }
  close() {
    this.dialogRef.close();
  }
  submitPackageDef() {
    if (this.unregFlag)
      this.packagedefobj.unregFlag = 'Y';
    else
      this.packagedefobj.unregFlag = 'N';
    if (this.buyExtraFlag)
      this.packagedefobj.buyExtraFlag = 'Y';
    else
      this.packagedefobj.buyExtraFlag = 'N';
    let req = {
      "pvrCode": this.packagedefobj.pvrCode,
      "unregKeyword": this.packagedefobj.unregKeyword,
      "unregShortcode": this.packagedefobj.unregShortcode,
      "unregFlag": this.packagedefobj.unregFlag,
      "buyExtraFlag": this.packagedefobj.buyExtraFlag,
      "createdBy": this.comm.getUserId(),
      "modifiedBy": this.comm.getUserId()
    };
    let url = "catalog/createpackdefinition";
    if (this.packagedefobj.mode == "update")
      url = "catalog/updatepackdefinition";

    this.comm.postData(url, req).subscribe((resp: any) => {
      if (resp.code == 200)
        this.comm.openDialog('success', resp.message);
      else
        this.comm.openDialog('error', resp.message);

      this.dialogRef.close();
    }, (err => {
      console.log(err);
    }));
  }

}
