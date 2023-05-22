import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CommonService } from "../../../../../shared/services/common.service";

@Component({
  selector: "app-event-mapping",
  templateUrl: "./event-mapping.component.html",
  styleUrls: ["./event-mapping.component.css"],
})
export class EventMappingComponent implements OnInit {
  public title: string = "MAP EVENTS";
  public obj: any;
  mode: string = "insert";
  eventLst= [];
  constructor(
    private comm: CommonService,
    private dialogRef: MatDialogRef<EventMappingComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private ccapi: CommonService
  ) {
   
    this.obj = {
      id: "",
      name: "",
      desc: "",
      status: 1,
      voceid:"",
      mode: "insert",
    };
    this.obj.id = data.id;
    if (data.mode == "update") {
      this.mode = "update";
      this.obj.mode = "update";
      this.title = "MAP EVENTS";
      this.obj.name = data.name;
      this.obj.desc = data.desc;
      this.obj.voceid=data.voiceid;
      this.obj.id=data.id
    }
  }

  ngOnInit() {
    this.getvoceeventsList();
  }
  close() {
    this.dialogRef.close();
  }
  mapEvents() {
    if (!this.comm.isvalidtext(this.obj.voceid, "Select Voce ID")) return false;
    let req = {
      voceid: this.obj.voceid,
      status: this.obj.status,
      event_id:this.obj.id,
      name: this.comm.trimtext(this.obj.name),
      createdBy: this.comm.getUserId(),
      modifiedBy: this.comm.getUserId(),
    };
    let url = "addeventsmap";
    
    this.comm
      .postData(url, req)
      .toPromise()
      .then((resp: any) => {
        if (resp.code == 200) this.comm.openDialog("success", resp.message);
        else this.comm.openDialog("error", resp.message);
        this.dialogRef.close(resp);
      })
      .catch((error: HttpErrorResponse) => {
        this.comm.HandleHTTPError(error);
      });
  }
  getvoceeventsList() {
    let start = 1;
    let requesrParams = {
      status: 1,
      start: start,
      length: 20,
      roleid: this.ccapi.getRole(),
      userId: this.ccapi.getUserId(),
      rangefrom:"",
      rangeto: "",
    };
    this.ccapi.postData("voce/getmaster", requesrParams).subscribe(
      (response: any) => {
        if (
          response.code == "200" &&
          response.status.toLowerCase() == "success"
        ) {
          if (
            response &&
            response.addVoceMasters != null &&
            response.addVoceMasters.length > 0
          ) {
            let data = response.addVoceMasters;
            data.forEach(element => {
              var obj = { id: "", title: "" };
              obj.id = element.voceid;
              obj.title = element.name;
              this.eventLst.push(obj);
            });
          }
        }
      },
      (error) => {
        this.ccapi.HandleHTTPError(error);
      }
    );
  }
}
