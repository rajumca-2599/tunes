import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
import { CommonService } from '../../../../../shared/services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.css']
})
export class AddChannelComponent implements OnInit {
  public title: string = "ADD CHANNEL";
  public channelobj: any;
  mode: string = "insert";
  constructor(private comm: CommonService, private dialogRef: MatDialogRef<AddChannelComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.channelobj = {
      channelid: "",
      channelname: "",
      status: 1,
      mode: "insert"
    };
    this.channelobj.channelid = data.channelid;
    if (data.mode == "update") {
      this.mode = "update";
      this.channelobj.mode = "update";
      this.title = "EDIT CHANNEL";
      this.channelobj.channelid = data.channelid;
      this.channelobj.channelname = data.channelname;
      this.channelobj.status = data.status;
    }


  }

  ngOnInit() {
  }
  close() {
    this.dialogRef.close();
  }
  submitChannel() {

    if (!this.comm.isvalidtext(this.channelobj.channelid, "Enter Channel ID")) return false;

    if (!this.comm.isvalidtext(this.channelobj.channelname, "Enter Channel Name")) return false;


    let req = {
      "channelId": this.comm.trimtext(this.channelobj.channelid),
      "status": this.channelobj.status,
      "channelName": this.comm.trimtext(this.channelobj.channelname),
      "createdBy": this.comm.getUserId(),
      "modifiedBy": this.comm.getUserId()
    };
    let url = "channels/createchannel";
    if (this.channelobj.mode == "update")
      url = "channels/updatechannel";
    else {
      if (this.channelobj.status != "1") {
        this.comm.openDialog('error', "Status Should be Active"); return;
      }
    }
    if (!this.validate()) {
      return;
    }
    this.comm.postData(url, req).toPromise().then((resp: any) => {
      if (resp.code == 200)
        this.comm.openDialog('success', resp.message);
      else
        this.comm.openDialog('error', resp.message);
      this.dialogRef.close(resp);
    }).catch((error: HttpErrorResponse) => {
      this.comm.HandleHTTPError(error);
    });
  }

  validate(): Boolean {
    if (this.channelobj.channelid == undefined || this.channelobj.channelid == null || this.channelobj.channelid == '') {
      this.comm.openDialog('warning', 'Enter Channel ID');
      return false;
    }
    if(this.channelobj.channelid.trim() == ""){
      this.comm.openDialog('warning', 'Please Enter valid Channel ID');
      return false;
    }
    if (this.channelobj.channelname == undefined || this.channelobj.channelname == null || this.channelobj.channelname == '') {
      this.comm.openDialog('warning', 'Enter Channel Name');
      return false;
    }
    if(this.channelobj.channelname.trim() == ""){
      this.comm.openDialog('warning', 'Please Enter valid Channel Name');
      return false;
    }
    return true;
  }
}
