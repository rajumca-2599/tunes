import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "../../../../../shared/services/common.service";

@Component({
  selector: "app-edit-options",
  templateUrl: "./edit-options.component.html",
  styleUrls: ["./edit-options.component.css"],
})
export class EditOptionsComponent implements OnInit {
  public questionObj = {
    voceid: "",
    qid: "",
    mode: "insert",
    status: 1,
    options: [
      {
        language: "en",
        title: "",
        freetext: "",
        buttontext: "",
        actionlink: "",
        predefined: "",
      },
      {
        language: "id",
        title: "",
        freetext: "",
        buttontext: "",
        actionlink: "",
        predefined: "",
      },
    ],
  };
  type = "";
  optid = "";
  drpdownengtitle = "";
  drpdownbahtitle = "";
  drpdownengbuttontext = "";
  drpdownbhabuttontext = "";
  drpdownengpredefined = "";
  drpdownbhapredefined = "";
  optionslist = [];
  mode = "insert";
  constructor(
    private comm: CommonService,
    private dialogRef: MatDialogRef<EditOptionsComponent>,
    private activeRoute: ActivatedRoute,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.mode = "update";
    this.questionObj.qid = data.qid;
    this.questionObj.voceid = data.voiceid;
    this.type = data.type;
    this.optid = data.optid;
  }

  ngOnInit() {
    this.loadvoceOptions();
  }
  close() {
    this.dialogRef.close();
  }
  addVoceOptions() {
    var obj = [];
    this.questionObj.options[0].title = this.drpdownengtitle;
    this.questionObj.options[0].buttontext = this.drpdownengbuttontext;
    this.questionObj.options[0].freetext = "1";
    this.questionObj.options[0].predefined = this.drpdownengpredefined;
    this.questionObj.options[0].language = "en";
    this.questionObj.options[0].actionlink = "";

    this.questionObj.options[1].title = this.drpdownbahtitle;
    this.questionObj.options[1].buttontext = this.drpdownbhabuttontext;
    this.questionObj.options[1].freetext = "1";
    this.questionObj.options[1].predefined = this.drpdownbhapredefined;
    this.questionObj.options[1].language = "id";
    this.questionObj.options[1].actionlink = "";
    obj.push(this.questionObj);
    let url = "voce/addvoceoptions";
    this.comm.postData(url, obj).subscribe(
      (resp: any) => {
        if (resp.code == "200" && resp.status == "success") {
          this.comm.openDialog("success", resp.message);
          // this.router.navigate([
          //   "home/voceoptions/" +
          //     this.questionObj.qid +
          //     "/" +
          //     this.questionObj.voceid +
          //     "/" +
          //     this.type,
          // ]);
          this.dialogRef.close();
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
  loadvoceOptions() {
    let obj;
    obj = {
      start: 0,
      length: 10,
      optid: this.optid,
      roleid: this.comm.getRole(),
      userId: this.comm.getUserId(),
      qid: this.questionObj.qid,
    };
    this.comm.postData("voce/getoptions", obj).subscribe((resp: any) => {
      this.comm.hidehttpspinner;
      if (
        resp.code == "200" &&
        resp.status == "success" &&
        resp.voceOptions != null &&
        resp.voceOptions.length > 0
      ) {
        this.questionObj = resp.voceOptions[0];
        let data = resp.voceOptions[0].options;
        this.drpdownengtitle = data[0].title;
        this.drpdownengbuttontext = data[0].buttontext;
        this.drpdownengpredefined = data[0].predefined;
        this.drpdownbahtitle = data[1].title;
        this.drpdownbhabuttontext = data[1].buttontext;
        this.drpdownbhapredefined = data[1].predefined;
      }
    });
  }
}
