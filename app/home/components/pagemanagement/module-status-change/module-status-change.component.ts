import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
import { CommonService } from '../../../../shared/services/common.service';
@Component({
  selector: 'app-module-status-change',
  templateUrl: './module-status-change.component.html',
  styleUrls: ['./module-status-change.component.css']
})
export class ModuleStatusChangeComponent implements OnInit {
 public statusobj: any;
  constructor(private comm: CommonService, private dialogRef: MatDialogRef<ModuleStatusChangeComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.statusobj = {
      pageid: data.pageid,
      moduleid: data.moduleid,
      status: data.status,
      modulename: data.modulename.toUpperCase(),
      createdBy: this.comm.getUserId(),
      modifiedBy: this.comm.getUserId()
    };
  }

  ngOnInit() {
  }
  close() {
    this.dialogRef.close();
  }
  saveModuleStatus() {
    console.log(this.statusobj);
    //let url = "channels/createchannel";
    //this.comm.postData(url, this.statusobj).subscribe((resp: any) => {
    //  if (resp.code == 200)
    //    this.comm.openDialog('success', resp.message);
    //  else
    //    this.comm.openDialog('error', resp.message);
    //  this.dialogRef.close();
    //}, (err => {
    //  console.log(err);
    //}));
  }
}

