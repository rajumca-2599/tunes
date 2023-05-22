import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
import { CommonService } from '../../../../../shared/services/common.service';

@Component({
  selector: 'app-add-platformsettings',
  templateUrl: './add-platformsettings.component.html',
  styleUrls: ['./add-platformsettings.component.css']
})
export class AddPlatformsettingsComponent implements OnInit {

  public title: string = "Add Platform Settings";
  public pltfrmObj: any;
  public mode: string = 'insert';

  constructor(private comm: CommonService, private dialogRef: MatDialogRef<AddPlatformsettingsComponent>, @Inject(MAT_DIALOG_DATA) data) {

    this.pltfrmObj = {
      vcglbname: data.vcglbname,
      vcglbvalue: data.vcglbvalue,
      vcglbdesc: data.vcglbdesc,
      vcglbgroup:data.vcglbgroup,
      mode: data.mode
    }
    this.mode = data.mode;
    if (data.mode == "update") {
      this.mode = "update";
      this.title = "Edit Platform Setting";
    }
  }

  ngOnInit() {

  }
  close() {
    this.dialogRef.close();
  }
  submitMessage() {
    let req = {
      vcglbname: this.pltfrmObj.vcglbname,
      vcglbvalue: this.pltfrmObj.vcglbvalue,
      vcglbdesc: this.pltfrmObj.vcglbdesc,
      vcglbgroup:this.pltfrmObj.vcglbgroup,
      "createdBy": this.comm.getUserId(),
      "modifiedBy": this.comm.getUserId()
    };
    let url = "rules/createrule";
    if (this.pltfrmObj.mode == "update") 
      url = "rules/updaterule";

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
