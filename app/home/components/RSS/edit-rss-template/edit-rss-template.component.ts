import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CommonService } from "../../../../../../src/app/shared/services/common.service";

@Component({
  selector: "app-edit-rss-template",
  templateUrl: "./edit-rss-template.component.html",
  styleUrls: ["./edit-rss-template.component.css"],
})
export class EditRssTemplateComponent implements OnInit {
  public titleheading: string = "ADD TEMPLATE";
  public rssObj: any;
  mode: string = "insert";
  category = "";
  constructor(
    private comm: CommonService,
    private dialogRef: MatDialogRef<EditRssTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.rssObj = {
      status: 1,
      mode: "insert",
      feed_id: "",
      data: "",
    };
    if (data.mode == "update") {
      // this.mode = "update";
      // this.rssObj.mode = "update";
      // this.titleheading = "EDIT TEMPLATE";
      this.rssObj.feed_id = data.id;
      this.category = data.category;
    }
  }

  ngOnInit() {
    this.getTemplate();
  }
  close() {
    this.dialogRef.close();
  }
  getTemplate() {
    let obj = {
      feedid: this.rssObj.feed_id,
    };
    let url = "rsstemplate/get";
    this.comm.postData(url, obj).subscribe(
      (resp: any) => {
        if (resp.code == "200" && resp.status == "success") {
          if (resp.templates.length > 0) {
            this.mode = "update";
            this.rssObj.mode = "update";
            this.titleheading = "EDIT TEMPLATE";
            let data = resp.templates[0].data.split(",");
            if (this.category != "ecommerce") {
              data.forEach((element, index) => {
                if (element.includes("image"))
                  this.rssObj.image = element.split("$")[1];
                if (element.includes("partner"))
                  this.rssObj.partner = element.split("$")[1];
                if (element.includes("title"))
                  this.rssObj.title = element.split("$")[1];
                if (element.includes("desc"))
                  this.rssObj.desc = element.split("$")[1];
                if (element.includes("pubdate"))
                  this.rssObj.pubdate = element.split("$")[1];
                if (element.includes("url"))
                  this.rssObj.url = element.split("$")[1];
                  if (element.includes("duration"))
                  this.rssObj.duration = element.split("$")[1];
                  if (element.includes("creator"))
                  this.rssObj.creator = element.split("$")[1];
              });
            } else {
              data.forEach((element, index) => {
                if (element.includes("image"))
                  this.rssObj.image = element.split("$")[1];
                if (element.includes("partner"))
                  this.rssObj.partner = element.split("$")[1];
                if (element.includes("title"))
                  this.rssObj.title = element.split("$")[1];
                if (element.includes("price"))
                  this.rssObj.price = element.split("$")[1];
                if (element.includes("originalprice"))
                  this.rssObj.originalprice = element.split("$")[1];
                if (element.includes("brand"))
                  this.rssObj.brand = element.split("$")[1];
                if (element.includes("url"))
                  this.rssObj.url = element.split("$")[1];
                  if (element.includes("duration"))
                  this.rssObj.duration = element.split("$")[1];
                  if (element.includes("creator"))
                  this.rssObj.creator = element.split("$")[1];
              });
            }
          }
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
  addrsstemplate() {
    if (this.validateTemplate()) {
      let obj;
      if (this.category != "ecommerce") {
        obj = {
          feedid: this.rssObj.feed_id,
          data:
            "image$" +
            this.rssObj.image +
            "," +
            "partner$" +
            this.rssObj.partner +
            "," +
            "title$" +
            this.rssObj.title +
            "," +
            "desc$" +
            this.rssObj.desc +
            "," +
            "pubdate$" +
            this.rssObj.pubdate +
            "," +
            "url$" +
            this.rssObj.url+
            "," +
            "duration$"+
            this.rssObj.duration+
            "," +
            "creator$"+
            this.rssObj.creator
        };
      } else {
        obj = {
          feedid: this.rssObj.feed_id,
          data:
            "image$" +
            this.rssObj.image +
            "," +
            "partner$" +
            this.rssObj.partner +
            "," +
            "title$" +
            this.rssObj.title +
            "," +
            "price$" +
            this.rssObj.price +
            "," +
            "originalprice$" +
            this.rssObj.originalprice +
            "," +
            "brand$" +
            this.rssObj.brand +
            "," +
            "url$" +
            this.rssObj.url+
            "," +
            "duration$"+
            this.rssObj.duration+
            "," +
            "creator$"+
            this.rssObj.creator
        };
      }
      let url = "rsstemplate/insert";
      this.rssObj.mode ="update" ;url="rsstemplate/update";
      this.comm.postData(url, obj).subscribe(
        (resp: any) => {
          if (resp.code == "200" && resp.status == "success") {
            this.comm.openDialog("success", resp.message);
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
  }
  validateTemplate() {
    if (!this.comm.isvalidtext(this.rssObj.image, "Enter Image")) return false;
    if (!this.comm.isvalidtext(this.rssObj.partner, "Enter Partner"))
      return false;
    if (!this.comm.isvalidtext(this.rssObj.title, "Enter Title")) return false;
    if (!this.comm.isvalidtext(this.rssObj.url, "Enter URL")) return false;
    if (this.category != "ecommerce") {
      if (!this.comm.isvalidtext(this.rssObj.desc, "Enter Description"))
        return false;
      if (!this.comm.isvalidtext(this.rssObj.pubdate, "Enter PubDate"))
        return false;
    } else if (this.category == "ecommerce") {
      if (!this.comm.isvalidtext(this.rssObj.price, "Enter Price"))
        return false;
      if (
        !this.comm.isvalidtext(
          this.rssObj.originalprice,
          "Enter Original Price"
        )
      )
        return false;
      if (!this.comm.isvalidtext(this.rssObj.brand, "Enter Brand"))
        return false;
    }
    return true;
  }
}
