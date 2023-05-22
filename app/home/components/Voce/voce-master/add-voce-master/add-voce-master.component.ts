import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "../../../../../shared/services/common.service";

@Component({
  selector: "app-add-voce-master",
  templateUrl: "./add-voce-master.component.html",
  styleUrls: ["./add-voce-master.component.css"],
})
export class AddVoceMasterComponent implements OnInit {
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  id: number;
  public title: string = "ADD VOCE";
  public mode: string = "insert";
  thumbnail: string = "";
  thumbnailInd: string = "";
  thanksimgEng:string="";
  thanksimgBah:string="";
  d = new Date();
  year = this.d.getFullYear();
  month = this.d.getMonth();
  day = this.d.getDate();
  startdate: Date = new Date(this.year, this.month, this.day, 0, 0, 0);
  enddate: Date = new Date(this.year, this.month, this.day, 23, 59, 59);
  public voceObj: any = {
    voceid: "",
    name: "",
    startdate: this.startdate,
    enddate: this.enddate,
    fqtimespan: "",
    mode: "insert",
    status: 1,
    values: [
      {
        language: "en",
        title: "",
        description: "",
        image: "",
        buttontext: "",
        thanksmessage: "",
        thanksimage:""
      },
      {
        language: "id",
        title: "",
        description: "",
        image: "",
        buttontext: "",
        thanksmessage: "",
        thanksimage:""
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
    if (this.id != null && this.id != undefined) {
      this.loadvocemasterdetails();
      this.mode = "update";
      this.title="EDIT VOCE"
    }
  }
  loadvocemasterdetails() {
    let obj = {
      start:0,
      length:10,
      id: this.id,
      roleid: this.comm.getRole(),
      userId: this.comm.getUserId(),
    };
    this.comm.postData("voce/getmaster", obj).subscribe(
      (resp: any) => {
        this.comm.hidehttpspinner;
        if (resp.code == "200" && resp.status == "success" && resp.addVoceMasters!=null && resp.addVoceMasters.length>0) {
          this.voceObj = resp.addVoceMasters[0];
          let str = this.voceObj.startdate.substring(0, this.voceObj.startdate.length - 2);
          let sdate: Date = new Date(str.replace("-", "/").replace("-", "/"));
          this.startdate = sdate;

          let str1 = this.voceObj.enddate.substring(0, this.voceObj.enddate.length - 2);
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
  thanksUploadeng(e) {
    let res = e.response;
    let result = JSON.parse(res);
    if (result != null && result.code == "200") {
      this.comm.handleHttpUploadFileError(result);
      this.thanksimgEng = result.gtrId;
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
  thanksUploadId(e) {
    let res = e.response;
    let result = JSON.parse(res);
    if (result != null && result.code == "200") {
      this.comm.handleHttpUploadFileError(result);
      this.thanksimgBah = result.gtrId;
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
  addVoce() {
    this.voceObj.startdate = formatDate(
      this.startdate,
      "yyyy-MM-dd HH:mm:ss",
      "en-US",
      ""
    );
    this.voceObj.enddate = formatDate(
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
      this.voceObj.values[0].image = this.thumbnail;
    }
    if (
      this.thumbnailInd != null &&
      this.thumbnailInd != undefined &&
      this.thumbnailInd.length > 0
    ) {
      this.voceObj.values[1].image = this.thumbnailInd;
    }
    if (
      this.thanksimgEng != null &&
      this.thanksimgEng != undefined &&
      this.thanksimgEng.length > 0
    ) {
      this.voceObj.values[0].thanksimage = this.thanksimgEng;
    }
    if (
      this.thanksimgBah != null &&
      this.thanksimgBah != undefined &&
      this.thanksimgBah.length > 0
    ) {
      this.voceObj.values[1].thanksimage = this.thanksimgBah;
    }
    if (this.validatevoce()) {
      let url = "voce/addvocemaster"; 
      this.comm.postData(url, this.voceObj).subscribe(
        (resp: any) => {
          if (resp.code == "200" && resp.status == "success") {
            this.comm.openDialog("success", resp.message);
            this.router.navigate(["home/vocemaster"]);
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
  close() {
    this.router.navigate(["home/vocemaster"]);
  }
  istextValid(txt) {
    try {
      if (txt == null || txt == undefined || txt == "" || txt.trim() == "")
        return true;
    } catch (e) {}
    return false;
  }
  validatevoce() {
    // if (this.istextValid(this.voceObj.voceid)) {
    //   this.comm.openDialog("warning", "Enter Voce Id.");
    //   return false;
    // }

    if (this.istextValid(this.voceObj.name)) {
      this.comm.openDialog("warning", "Enter Voce Name.");
      return false;
    }
    if (this.voceObj.name.trim().length < 4) {
      this.comm.openDialog(
        "warning",
        "Voce Name should be minumum 4 characters"
      );
      return false;
    }
    if (this.istextValid(this.voceObj.fqtimespan)) {
      this.comm.openDialog("warning", "Enter Time Span.");
      return false;
    }
    if (this.istextValid(this.voceObj.values[0].title)) {
      this.comm.openDialog("warning", "Enter English Title.");
      return false;
    }
    if (this.istextValid(this.voceObj.values[0].buttontext)) {
      this.comm.openDialog("warning", "Enter English Button Text.");
      return false;
    }
    if (this.istextValid(this.voceObj.values[0].thanksmessage)) {
      this.comm.openDialog("warning", "Enter English Thanks Message.");
      return false;
    }
    if (this.istextValid(this.voceObj.values[1].title)) {
      this.comm.openDialog("warning", "Enter Bahasa Title.");
      return false;
    }
    if (this.istextValid(this.voceObj.values[1].buttontext)) {
      this.comm.openDialog("warning", "Enter Bahasa Button Text.");
      return false;
    }
    if (this.istextValid(this.voceObj.values[1].thanksmessage)) {
      this.comm.openDialog("warning", "Enter Bahasa Thanks Message.");
      return false;
    }
    return true;
  }
}
