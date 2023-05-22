import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { stringify } from "querystring";
import { CommonService } from "../../../../../shared/services/common.service";
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from "@angular/material";
import { PageObject } from "../../../../../shared/models/paging";
import { OrderByObject } from "../../../../../shared/models/paging";

@Component({
  selector: "app-add-voce-options",
  templateUrl: "./add-voce-options.component.html",
  styleUrls: ["./add-voce-options.component.css"],
})
export class AddVoceOptionsComponent implements OnInit {
  userpermissions: any = { view: 0, add: 0, edit: 0, delete: 0, export: 0 };
  optid: number;
  freetext: boolean = false;
  showfreetextno: boolean = false;
  freetextLst = [];
  type = "";
  public title: string = "ADD OPTION";
  public mode: string = "insert";
  status: any = 1;
  voceQuestionsLst = [];
  engtitle1 = "Very Unsatisfied";
  engtitle2 = "Unsatisfied";
  engtitle3 = "Neutral";
  engtitle4 = "Satisfied";
  engtitle5 = "Very Satisfied";
  bahtitle1 = "Sangat tidak puas";
  bahtitle2 = "Tidak puas";
  bahtitle3 = "Netral";
  bahtitle4 = "Puas";
  bahtitle5 = "Sangat Puas";
  engbuttontext = "SUBMIT";
  bahbuttontext = "KIRIM";
  drpdownengtitle = "";
  drpdownbahtitle = "";
  drpdownengbuttontext = "";
  drpdownbhabuttontext = "";
  drpdownengpredefined = "";
  drpdownbhapredefined = "";
  showgrid: boolean = false;
  optionslist = [];
  btnText = "Add";
  modifiedOptionId = 0;
  maxemojiOptions: number = 5;
  trigger1 :number=0;
  trigger2 : number =0;
  trigger3 : number =0;
  trigger4 : number =0;
  trigger5 : number =0;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public isview: number = 0;
  NgxSpinnerService: any;
  dataSource: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();
  public questionObj: any;
  questionid="";
  voceid="";
  displayedColumns: string[] = ["title", "buttontext", "predefined", "actions"];
  constructor(
    private comm: CommonService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private ccapi: CommonService
  ) {
    this.initalizeObject();
  }
  ngOnInit() {
    this.questionid= this.activeRoute.snapshot.params["qid"];
    this.voceid = this.activeRoute.snapshot.params["voceid"];
    this.type = this.activeRoute.snapshot.params["type"];
    this.optid = this.activeRoute.snapshot.params["optid"];
    if (this.optid != null && this.optid != undefined && this.optid != 0) {
      this.mode = "update";
      this.maxemojiOptions = 1;
      this.title="EDIT OPTIONS"
      //this.loadvoceOptions();
    }
    this.getvoceQuestionsList();
  }
  close() {
    this.router.navigate(["home/voceoptions/"+this.questionid +"/"+ this.voceid+"/"+this.type]);
  }

  addVoceOptions() {
    var obj = [];
    if (this.type == "0") {
      if (this.validateEmojiOptions()) {
        for (var i = 1; i <= 5; i++) {
          this.initalizeObject();
          if (i == 1) {
            this.questionObj.options[0].title = this.engtitle1;
            this.questionObj.options[1].title = this.bahtitle1;
            this.questionObj.options[0].actionlink = this.trigger1;
            this.questionObj.options[1].actionlink = this.trigger1;
          } else if (i == 2) {
            this.questionObj.options[0].title = this.engtitle2;
            this.questionObj.options[1].title = this.bahtitle2;
            this.questionObj.options[0].actionlink = this.trigger2;
            this.questionObj.options[1].actionlink = this.trigger2;
          } else if (i == 3) {
            this.questionObj.options[0].title = this.engtitle3;
            this.questionObj.options[1].title = this.bahtitle3;
            this.questionObj.options[0].actionlink = this.trigger3;
            this.questionObj.options[1].actionlink = this.trigger3;
          } else if (i == 4) {
            this.questionObj.options[0].title = this.engtitle4;
            this.questionObj.options[1].title = this.bahtitle4;
            this.questionObj.options[0].actionlink = this.trigger4;
            this.questionObj.options[1].actionlink = this.trigger4;
          } else if (i == 5) {
            this.questionObj.options[0].title = this.engtitle5;
            this.questionObj.options[1].title = this.bahtitle5;
            this.questionObj.options[0].actionlink = this.trigger5;
            this.questionObj.options[1].actionlink = this.trigger5;
          }
          this.questionObj.options[0].buttontext = this.engbuttontext;
          this.questionObj.options[1].buttontext = this.bahbuttontext;
          this.questionObj.options[0].freetext = "0";
          this.questionObj.options[1].freetext = "0";
          this.questionObj.options[0].predefined = "NA";
          this.questionObj.options[1].predefined = "NA";

          this.questionObj.options[0].language = "en";
          this.questionObj.options[1].language = "id";
          this.questionObj.voceid=this.voceid;
          this.questionObj.qid=this.questionid;
         
          obj.push(this.questionObj);
        }
      }
    } else {
      for (var i = 0; i < this.optionslist.length; i++) {
        this.questionObj.options[0].title = this.optionslist[i].title_eng;
        this.questionObj.options[0].buttontext = this.optionslist[
          i
        ].buttontext_eng;
        this.questionObj.options[0].freetext = "1";
        this.questionObj.options[0].predefined =this.comm.trimtext( this.optionslist[
          i
        ].predefined_eng);
        this.questionObj.options[0].language = "en";
        this.questionObj.options[0].actionlink = "";

        this.questionObj.options[1].title = this.optionslist[i].title_bah;
        this.questionObj.options[1].buttontext = this.optionslist[
          i
        ].buttontext_bah;
        this.questionObj.options[1].freetext = "1";
        this.questionObj.options[1].predefined = this.comm.trimtext(this.optionslist[
          i
        ].predefined_bah);
        this.questionObj.options[1].language = "id";
        this.questionObj.options[1].actionlink = "";
        obj.push(this.questionObj);
      }
    }

    let url = "voce/addvoceoptions";
    this.comm.postData(url, obj).subscribe(
      (resp: any) => {
        if (resp.code == "200" && resp.status == "success") {
          this.comm.openDialog("success", resp.message);
          this.router.navigate([
            "home/voceoptions/" +
              this.questionObj.qid +
              "/" +
              this.questionObj.voceid +
              "/" +
              this.type,
          ]);
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
  getvoceQuestionsList() {
    let requesrParams = {
      status: this.status,
      start: "1",
      length: "20",
      roleid: this.ccapi.getRole(),
      userId: this.ccapi.getUserId(),
      id: this.voceid,
    };
    this.spinner.show();
    this.ccapi.postData("voce/getquestions", requesrParams).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (
          response.code == "200" &&
          response.status.toLowerCase() == "success"
        ) {
          if (
            response &&
            response.voceQuestions != null &&
            response.voceQuestions.length > 0
          ) {
            let data = response.voceQuestions;
            data.forEach((element) => {
              if (element.type == 1) {
                var obj = { title: "", qid: "" };
                obj.title = element.values[1].title;
                obj.qid = element.qid;
                this.voceQuestionsLst.push(obj);
              }
            });
          }
          if (this.optid != null && this.optid != undefined && this.optid != 0) {
            this.loadvoceOptions();
          }
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  addoptions() {
    if (this.validateDropDownOptions()) {
      if (this.btnText == "Update") {
        this.optionslist.forEach((element) => {
          if (element.id == this.modifiedOptionId) {
            element.title_eng = this.drpdownengtitle;
            element.buttontext_eng = this.drpdownengbuttontext;
            element.predefined_eng = this.drpdownengpredefined;
            element.title_bah = this.drpdownbahtitle;
            element.buttontext_bah = this.drpdownbhabuttontext;
            element.predefined_bah = this.drpdownbhapredefined;
            this.btnText = "Add";
            this.emptyObject();
          }
        });
      } else {
        var obj = {
          title_eng: "",
          predefined_eng: "",
          buttontext_eng: "",
          language: "",
          id: 0,
          title_bah: "",
          predefined_bah: "",
          buttontext_bah: "",
        };
        obj.title_eng = this.drpdownengtitle;
        obj.buttontext_eng = this.drpdownengbuttontext;
        obj.predefined_eng = this.drpdownengpredefined;
        obj.language = "en";
        obj.id = this.optionslist.length + 1;
        obj.title_bah = this.drpdownbahtitle;
        obj.buttontext_bah = this.drpdownbhabuttontext;
        obj.predefined_bah = this.drpdownbhapredefined;
        obj.language = "id";
        this.optionslist.push(obj);
        this.showgrid = true;
        console.log(this.optionslist);
        this.dataSource = new MatTableDataSource(this.optionslist);
        this.dataSource.sort = this.sort;
        this.btnText = "Add";
        this.emptyObject();
      }
    }
  }
  deletevoiceOptions(row) {
    let removeIndex = this.optionslist.findIndex((d) => d.id === row.id);
    if (removeIndex > -1) {
      this.optionslist.splice(removeIndex, 1);
    }
    this.dataSource = new MatTableDataSource(this.optionslist);
    this.dataSource.sort = this.sort;
  }
  editvoiceOptions(row) {
    this.drpdownengbuttontext = row.buttontext_eng;
    this.drpdownengtitle = row.title_eng;
    this.drpdownengpredefined = row.predefined_eng;
    this.drpdownbahtitle = row.title_bah;
    this.drpdownbhabuttontext = row.buttontext_bah;
    this.drpdownbhapredefined = row.predefined_bah;
    this.btnText = "Update";
    this.modifiedOptionId = row.id;
  }
  emptyObject() {
    this.drpdownbahtitle = "";
    this.drpdownbhabuttontext = "";
    this.drpdownbhapredefined = "";
    this.drpdownengtitle = "";
    this.drpdownengbuttontext = "";
    this.drpdownengpredefined = "";
  }
  validateDropDownOptions() {
    if (this.istextValid(this.drpdownengtitle)) {
      this.comm.openDialog("warning", "Enter English Title.");
      return false;
    }
    if (this.drpdownengtitle.trim().length < 4) {
      this.comm.openDialog(
        "warning",
        "English Title should be minumum 4 characters"
      );
      return false;
    }
    if (this.istextValid(this.drpdownbahtitle)) {
      this.comm.openDialog("warning", "Enter Bahasa Title.");
      return false;
    }
    if (this.drpdownbahtitle.trim().length < 4) {
      this.comm.openDialog(
        "warning",
        "Bahasa Title should be minumum 4 characters"
      );
      return false;
    }
    if (this.istextValid(this.drpdownengbuttontext)) {
      this.comm.openDialog("warning", "Enter English Button Text.");
      return false;
    }
    if (this.istextValid(this.drpdownbhabuttontext)) {
      this.comm.openDialog("warning", "Enter Bahasa Button Text.");
      return false;
    }
    if (this.istextValid(this.drpdownengpredefined)) {
      this.comm.openDialog("warning", "Enter English Predefined Text.");
      return false;
    }
    if (this.istextValid(this.drpdownbhapredefined)) {
      this.comm.openDialog("warning", "Enter Bhasa Predefined Text.");
      return false;
    }
    return true;
  }
  validateEmojiOptions() {
    if (this.istextValid(this.engtitle1)) {
      this.comm.openDialog("warning", "Enter English Title.");
      return false;
    }
    if (this.engtitle1.trim().length < 4) {
      this.comm.openDialog(
        "warning",
        "English Title should be minumum 4 characters"
      );
      return false;
    }
    if (this.istextValid(this.bahtitle1)) {
      this.comm.openDialog("warning", "Enter Bahasa Title.");
      return false;
    }
    if (this.bahtitle1.trim().length < 4) {
      this.comm.openDialog(
        "warning",
        "Bahasa Title should be minumum 4 characters"
      );
      return false;
    }
    if (this.istextValid(this.engbuttontext)) {
      this.comm.openDialog("warning", "Enter English Button Text.");
      return false;
    }
    if (this.istextValid(this.bahbuttontext)) {
      this.comm.openDialog("warning", "Enter Bahasa Button Text.");
      return false;
    }
    return true;
  }
  istextValid(txt) {
    try {
      if (txt == null || txt == undefined || txt == "" || txt.trim() == "")
        return true;
    } catch (e) {}
    return false;
  }
  loadvoceOptions() {
    let obj;
    if (this.type != "0") {
      obj = {
        start: 0,
        length: 10,
        optid: this.optid,
        roleid: this.comm.getRole(),
        userId: this.comm.getUserId(),
        qid: this.questionObj.qid,
      };
    } else {
      obj = {
        start: 0,
        length: 10,
        roleid: this.comm.getRole(),
        userId: this.comm.getUserId(),
        id: this.questionid,
      };
    }
    this.comm.postData("voce/getoptions", obj).subscribe((resp: any) => {
      this.comm.hidehttpspinner;
      if (
        resp.code == "200" &&
        resp.status == "success" &&
        resp.voceOptions != null &&
        resp.voceOptions.length > 0
      ) {
        if (this.type == "1") {
          this.questionObj = resp.voceOptions[0];
          let data = resp.voceOptions[0].options;
          this.showgrid = true;
          var obj = {
            title_eng: "",
            predefined_eng: "",
            buttontext_eng: "",
            language: "",
            id: 0,
            title_bah: "",
            predefined_bah: "",
            buttontext_bah: "",
          };
          obj.title_eng = data[0].title;
          obj.buttontext_eng = data[0].buttontext;
          obj.predefined_eng = data[0].predefined;
          obj.title_bah = data[1].title;
          obj.buttontext_bah = data[1].buttontext;
          obj.predefined_bah = data[1].predefined;
          this.optionslist.push(obj);
          this.dataSource = new MatTableDataSource(this.optionslist);
          this.dataSource.sort = this.sort;
          this.btnText = "Add";
        } else {
          let data = resp.voceOptions;
          data.forEach((element, index) => {
            if (index == 0) {
              this.engtitle1 = element.options[0].title;
              this.engbuttontext = element.options[0].buttontext;
              this.bahbuttontext = element.options[1].buttontext;
              this.bahtitle1 = element.options[1].title;
              this.trigger1=Number(element.options[0].actionlink);
            } else if (index == 1) {
              this.engtitle2 = element.options[0].title;
              this.bahtitle2 = element.options[1].title;
              this.trigger2=Number(element.options[0].actionlink);
            } else if (index == 2) {
              this.engtitle3 = element.options[0].title;
              this.bahtitle3 = element.options[1].title;
              this.trigger3=Number(element.options[0].actionlink);
            } else if (index == 3) {
              this.engtitle4 = element.options[0].title;
              this.bahtitle4 = element.options[1].title;
              this.trigger4=Number(element.options[0].actionlink);
            } else if (index == 4) {
              this.engtitle5 = element.options[0].title;
              this.bahtitle5 = element.options[1].title;
              this.trigger5=Number(element.options[0].actionlink);
            }
          });
        }
      }
    });
  }
  initalizeObject() {
    this.questionObj = {
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
  }
}
