import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "../../../../../shared/services/common.service";

@Component({
  selector: "app-add-voce-questions",
  templateUrl: "./add-voce-questions.component.html",
  styleUrls: ["./add-voce-questions.component.css"],
})
export class AddVoceQuestionsComponent implements OnInit {
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  id: number;
  public title: string = "ADD VOCE QUESTION";
  public mode: string = "insert";
  thumbnail: string = "";
  thumbnailInd: string = "";
  d = new Date();
  year = this.d.getFullYear();
  month = this.d.getMonth();
  day = this.d.getDate();
  locations = [{ id: "all", name: "all" }];
  catgList: any;
  voceList:any;
  voceid="";
  startdate: Date = new Date(this.year, this.month, this.day, 0, 0, 0);
  enddate: Date = new Date(this.year, this.month, this.day, 23, 59, 59);
  public questionObj: any = {
    id: "",
    voceid: "",
    qid: "",
    startdate: this.startdate,
    enddate: this.enddate,
    mode: "insert",
    category: "login",
    type: 0,
    location: "all",
    model: 1,
    maxcap: 10,
    status: 1,
    values: [
      {
        language: "en",
        name: "",
        description: "",
        title: "",
        image: "",
        status: 1,
      },
      {
        language: "id",
        name: "",
        description: "",
        title: "",
        image: "",
        status: 1,
      },
    ],
  };
  public isview: number = 0;
  afuConfig = {
    formatsAllowed: ".jpg,.png",
    maxSize: "2",
    theme: "dragNDrop",
    uploadAPI: {
      url: this.comm.getUrl("files/uploadFile"),
      headers: {
        "Access-Control-Allow-Origin": "*",
        accesskey: this.comm.getAccessKey(),
        "x-imi-uploadtype": "1",
      },
    },
  };
  afuConfigId = {
    formatsAllowed: ".jpg,.png",
    maxSize: "2",
    theme: "dragNDrop",
    uploadAPI: {
      url: this.comm.getUrl("files/uploadFile"),
      headers: {
        "Access-Control-Allow-Origin": "*",
        accesskey: this.comm.getAccessKey(),
        "x-imi-uploadtype": "1",
      },
    },
  };
  NgxSpinnerService: any;
  constructor(
    private comm: CommonService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit() {
    this.id = this.activeRoute.snapshot.params["id"];
    this.voceid=this.activeRoute.snapshot.params["voceid"];
    this.getCategory();
    this. getVoceList();
    if (this.id != null && this.id != undefined && this.id!=0) {
      this.loadvocequestiondetails();
      this.mode = "update";
      this.title="EDIT VOCE QUESTION"
    }
  }
  close() {
    this.router.navigate(["home/vocequestions/"+this.voceid]);
  }
  DocUpload(e) {
    let res = e.response;
    let result = JSON.parse(res);
    if (result != null && result.code == "200") {
      this.comm.handleHttpUploadFileError(result);
      this.thumbnail = result.gtrId;
    } else {
      if (result != null && result.message != null)
        this.comm.openDialog("warning", result.message);
      else {
        this.comm.openDialog("warning", "Unable to upload file.");
      }
      setTimeout(() => {
        this.afuConfig = {
          formatsAllowed: ".jpg,.png",
          maxSize: "1",
          theme: "dragNDrop",
          uploadAPI: {
            url: this.comm.getUrl("files/uploadFile"),
            headers: {
              "Access-Control-Allow-Origin": "*",
              accesskey: this.comm.getAccessKey(),
              "x-imi-uploadtype": "1",
            },
          },
        };
      }, 2000);
    }
  }
  DocUploadId(e) {
    let res = e.response;
    let result = JSON.parse(res);
    if (result != null && result.code == "200") {
      this.comm.handleHttpUploadFileError(result);
      this.thumbnailInd = result.gtrId;
    } else {
      if (result != null && result.message != null)
        this.comm.openDialog("warning", result.message);
      else {
        this.comm.openDialog("warning", "Unable to upload file.");
      }
      setTimeout(() => {
        this.afuConfigId = {
          formatsAllowed: ".jpg,.png",
          maxSize: "2",
          theme: "dragNDrop",
          uploadAPI: {
            url: this.comm.getUrl("files/uploadFile"),
            headers: {
              "Access-Control-Allow-Origin": "*",
              accesskey: this.comm.getAccessKey(),
              "x-imi-uploadtype": "1",
            },
          },
        };
      }, 2000);
    }
  }
  loadvocequestiondetails() {
    let obj = {
      start: 0,
      length: 10,
      qid : this.id,
      roleid: this.comm.getRole(),
      userId: this.comm.getUserId(),
    };
    this.comm.postData("voce/getquestions", obj).subscribe(
      (resp: any) => {
        this.comm.hidehttpspinner;
        if (
          resp.code == "200" &&
          resp.status == "success" &&
          resp.voceQuestions != null &&
          resp.voceQuestions.length > 0
        ) {
          this.questionObj = resp.voceQuestions[0];
          let str = this.questionObj.startdate.substring(
            0,
            this.questionObj.startdate.length - 2
          );
          let sdate: Date = new Date(str.replace("-", "/").replace("-", "/"));
          this.startdate = sdate;

          let str1 = this.questionObj.enddate.substring(
            0,
            this.questionObj.enddate.length - 2
          );
          let edate: Date = new Date(str1.replace("-", "/").replace("-", "/"));
          this.enddate = edate;
        } else {
          this.comm.openSnackBar("No Records Found");
        }
      },
      (err) => {
        this.comm.HandleHTTPError(err);
      }
    );
  }
  addVoce() {
    this.questionObj.voceid=this.voceid;
    this.questionObj.values[0].name=this.questionObj.type=="0"?"Emoji":"Dropdown";
    this.questionObj.values[1].name=this.questionObj.type=="0"?"Emoji":"Dropdown";
    this.questionObj.startdate = formatDate(
      this.startdate,
      "yyyy-MM-dd HH:mm:ss",
      "en-US",
      ""
    );
    this.questionObj.enddate = formatDate(
      this.enddate,
      "yyyy-MM-dd HH:mm:ss",
      "en-US",
      ""
    );
    if (
      this.thumbnail != null &&
      this.thumbnail != undefined &&
      this.thumbnail.length > 0
    ) {
      this.questionObj.values[0].image = this.thumbnail;
    }
    if (
      this.thumbnailInd != null &&
      this.thumbnailInd != undefined &&
      this.thumbnailInd.length > 0
    ) {
      this.questionObj.values[1].image = this.thumbnailInd;
    }
    if (this.validatevoceQuestion()) {
      let url = "voce/addvocequestions";
      this.comm.postData(url, this.questionObj).subscribe(
        (resp: any) => {
          if (resp.code == "200" && resp.status == "success") {
            this.comm.openDialog("success", resp.message);
            this.router.navigate(["home/vocequestions/"+this.voceid]);
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
  istextValid(txt) {
    try {
      if (txt == null || txt == undefined || txt == "" || txt.trim() == "")
        return true;
    } catch (e) {}
    return false;
  }
  validatevoceQuestion() {
    // if (this.istextValid(this.questionObj.voceid)) {
    //   this.comm.openDialog("warning", "Enter Voce Id.");
    //   return false;
    // }
    // if (this.istextValid(this.questionObj.qid)) {
    //   this.comm.openDialog("warning", "Enter Question Id.");
    //   return false;
    // }
    if (this.istextValid(this.questionObj.category)) {
      this.comm.openDialog("warning", "Enter Category.");
      return false;
    }
    if (this.questionObj.type == undefined || this.questionObj.type == null) {
      this.comm.openDialog("warning", "Enter Type.");
      return false;
    }
    if (this.istextValid(this.questionObj.location)) {
      this.comm.openDialog("warning", "Enter Location.");
      return false;
    }
    if (this.istextValid(this.questionObj.model)) {
      this.comm.openDialog("warning", "Enter model.");
      return false;
    }
    if (this.istextValid(this.questionObj.maxcap)) {
      this.comm.openDialog("warning", "Enter maxcap.");
      return false;
    }
    if (this.istextValid(this.questionObj.values[0].title)) {
      this.comm.openDialog("warning", "Enter English Title.");
      return false;
    }
    if (this.istextValid(this.questionObj.values[0].name)) {
      this.comm.openDialog("warning", "Enter Name.");
      return false;
    }
    if (this.istextValid(this.questionObj.values[1].title)) {
      this.comm.openDialog("warning", "Enter Bahasa Title.");
      return false;
    }
    if (this.istextValid(this.questionObj.values[1].name)) {
      this.comm.openDialog("warning", "Enter Bahasa Name.");
      return false;
    }
    return true;
  }
  getCategory() {
    let requesrParams = {
      start: 0,
      length: 10,
      roleid: this.comm.getRole(),
      userId: this.comm.getUserId(),
    };
    this.spinner.show();
    this.comm
      .postData("voce/getevents", requesrParams)
      .subscribe((response: any) => {
        this.spinner.hide();
        if (
          response.code == "200" &&
          response.status.toLowerCase() == "success"
        ) {
          if (
            response &&
            response.voceEvents != null &&
            response.voceEvents.length > 0
          ) {
            this.catgList = response.voceEvents;
          }
        }
      });
  }
  getVoceList() {
    let requesrParams = {
      start: 0,
      length: 10,
      roleid: this.comm.getRole(),
      userId: this.comm.getUserId(),
    };
    this.spinner.show();
    this.comm
      .postData("voce/getmaster", requesrParams)
      .subscribe((response: any) => {
        this.spinner.hide();
        if (
          response.code == "200" &&
          response.status.toLowerCase() == "success"
        ) {
          if (
            response &&
            response.addVoceMasters != null &&
            response.addVoceMasters.length > 0
          ) {
            this.voceList = response.addVoceMasters;
          }
        }
      });
  }
  navigatetoQuestions()
  {
    this.router.navigate(["home/vocequestions/"+this.voceid]);
  }
}
