import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from "@angular/material";
import { CommonService } from '../../../../../shared/services/common.service';

export class catobj {
  mainCategory: string;
  category: string;
  lang: string;
  channelName: string;
  startPrice: number;
  catSubtitle: string;
  catBannerImage: string;
  catFooterDesc: string;
  catRibbon: string;
  catFooterImage: string;
  catFeaterImage: string;
  catListImages: string;
  sequence: number;
  attributeIds: any;
}

@Component({
  selector: 'app-add-categories',
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.css']
})

export class AddCategoriesComponent implements OnInit {

  public title: string = "Commercial Category";
  public catobjIn: catobj = { mainCategory: "", category: "", lang: "id", channelName: "", startPrice: 0, catSubtitle: "", catBannerImage: "", catFooterDesc: "", catRibbon: "", catFooterImage: "", catFeaterImage: "", catListImages: "", sequence: 0, attributeIds: [] };
  public catobjEn: catobj = { mainCategory: "", category: "", lang: "en", channelName: "", startPrice: 0, catSubtitle: "", catBannerImage: "", catFooterDesc: "", catRibbon: "", catFooterImage: "", catFeaterImage: "", catListImages: "", sequence: 0, attributeIds: [] };
  catlist: Array<catobj> = [this.catobjIn, this.catobjEn];
  public mode: string = 'insert';
  public subcribertypes: any[] = [];
  constructor(private comm: CommonService, private dialogRef: MatDialogRef<AddCategoriesComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.mode = data.mode;
  }

  ngOnInit() {
    this.loadChannels();
  }
  loadChannels() {
    this.comm.getData("channels/getchannel").subscribe((resp: any) => {
      console.log(resp);
    }, (err => {
      console.log(err);
    }));
  }
  close() {
    this.dialogRef.close();
  }
  submitCategory() {
    let url = "catalog/createcategory";

    this.comm.postData(url, this.catlist).subscribe((resp: any) => {
      if (resp.code == 200)
        this.comm.openDialog('success', resp.message);
      else
        this.comm.openDialog('error', resp.message);
      this.dialogRef.close();
    }, (err => {
      console.log(err);
    }));
  }
  copyCategory() {

  }
}
