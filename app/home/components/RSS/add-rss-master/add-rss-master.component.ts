import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CommonService } from "../../../../../app/shared/services/common.service";

@Component({
  selector: "app-add-rss-master",
  templateUrl: "./add-rss-master.component.html",
  styleUrls: ["./add-rss-master.component.css"],
})
export class AddRssMasterComponent implements OnInit {
  public title: string = "ADD NATIVE CONTENT";
  public rssObj: any;
  mode: string = "insert";
  public categorylist: any[] = [
    { id: "news", name: "News" },
    { id: "videos", name: "Videos" },
    { id: "music", name: "Music" },
    { id: "games", name: "Games" },
    { id: "ecommerce", name: "Ecommerce" },
  ];
  constructor(
    private comm: CommonService,
    private dialogRef: MatDialogRef<AddRssMasterComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.rssObj = {
      status: 1,
      mode: "insert",
      category:"news"
    };
    this.rssObj.id = data.id;
    if (data.mode == "update") {
      this.mode = "update";
      this.rssObj.mode = "update";
      this.title = "EDIT NATIVE CONTENT";
      this.rssObj.id = data.id;
      this.rssObj.name = data.name;
      this.rssObj.status = data.status;
      this.rssObj.desc = data.desc;
      this.rssObj.url = data.url;
      this.rssObj.frequency = data.frequency;
      this.rssObj.category = data.category;
      this.rssObj.partnername = data.partnername;
      this.rssObj.icon = data.icon;
      this.rssObj.promoimage = data.promoimage;
      this.rssObj.topimage = data.topimage;
    }
  }

  ngOnInit() {}
  close() {
    this.dialogRef.close();
  }
  addRSS() {
    if (this.validateRSSMaster()) {
      let req = {
        feed_name: this.rssObj.name,
        feed_id: this.rssObj.id,
        status: this.rssObj.status,
        feed_description: this.rssObj.desc,
        partner_name: this.rssObj.partnername,
        feed_url: this.rssObj.url,
        icon: this.rssObj.icon,
        category: this.rssObj.category,
        frequency: this.rssObj.frequency,
        top_banner: this.rssObj.topimage,
        promo_banner: this.rssObj.promoimage,
      };
      let url = "rss/create";
      if (this.rssObj.mode == "update") url = "rss/update";
      this.comm.postData(url, req).subscribe(
        (resp: any) => {
          if (resp.code == "200" && resp.status == "success") {
            this.comm.openDialog("success", resp.message);
            this.dialogRef.close(resp);
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
  validateRSSMaster() {
    if (!this.comm.isvalidtext(this.rssObj.name, "Enter Feed Name"))
      return false;
    if (!this.comm.isvalidtext(this.rssObj.name, "Enter Feed URL"))
      return false;
    if (!this.comm.isvalidtext(this.rssObj.frequency, "Enter Frequency"))
      return false;
    if (!this.comm.isvalidtext(this.rssObj.category, "Enter Category"))
      return false;
    if (!this.comm.isvalidtext(this.rssObj.partnername, "Enter Partner Name"))
      return false;
      if (!this.comm.isvalidtext(this.rssObj.url, "Enter Feed Url"))
      return false;
      if (
        this.rssObj.url.indexOf("http://") != 0 &&
        this.rssObj.url.indexOf("https://") != 0
      ) {
        this.comm.openDialog(
          "warning",
          "Feed Url"+ "  value should start with http"
        );
        return false;;
      }
      if (!this.comm.isvalidtext(this.rssObj.icon, "Enter Feed Icon"))
      return false;
      if (
        this.rssObj.icon.indexOf("http://") != 0 &&
        this.rssObj.icon.indexOf("https://") != 0
      ) {
        this.comm.openDialog(
          "warning",
          "Feed Icon"+ " should start with http"
        );
        return false;;
      }
      if(this.rssObj.category=="ecommerce"){
      if (!this.comm.isvalidtext(this.rssObj.promoimage, "Enter Promo Banner Image"))
      return false;
      if (
        this.rssObj.promoimage.indexOf("http://") != 0 &&
        this.rssObj.promoimage.indexOf("https://") != 0
      ) {
        this.comm.openDialog(
          "warning",
          "Promo Banner Image"+ " should start with http"
        );
        return false;;
      }
      if (!this.comm.isvalidtext(this.rssObj.topimage, "Enter Top Banner Image"))
      return false;
      if (
        this.rssObj.topimage.indexOf("http://") != 0 &&
        this.rssObj.topimage.indexOf("https://") != 0
      ) {
        this.comm.openDialog(
          "warning",
          "Top Banner Image"+ " should start with http"
        );
        return false;;
      }
    }

    return true;
  }
}
