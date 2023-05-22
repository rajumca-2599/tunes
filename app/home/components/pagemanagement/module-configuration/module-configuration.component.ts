import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, MatDialog} from "@angular/material";
import { EnvService } from '../../../../shared/services/env.service';
import { CommonService } from '../../../../shared/services/common.service';
import { ShowImageComponent } from '../../shared/show-image/show-image.component';

@Component({
  selector: 'app-module-configuration',
  templateUrl: './module-configuration.component.html',
  styleUrls: ['./module-configuration.component.css']
})
export class ModuleConfigurationComponent implements OnInit {
  displayedColumns: string[] = ["name", "image", "order"];
  dataSource: any = new MatTableDataSource();
  public editobj: any;
  public bannerGroupsList: any = [];
  public bannertypes: any = [];
  public showBanners: boolean = false;
  public BannersList: any = [];
  public mode :any="";
  constructor(private comm: CommonService, private dialogRef: MatDialogRef<ModuleConfigurationComponent>
    , @Inject(MAT_DIALOG_DATA) data, private dialog: MatDialog,public env:EnvService) {
    this.showBanners = false;
    console.log(data);
    this.editobj = {
      pageid: data.pageid,
      pagename: data.pagename.toUpperCase(),
      moduleid: data.moduleid,
      modulename: data.modulename.toUpperCase(),
      moduletype: data.moduletype,
      bannergroup: data.bannergroup,
      createdBy: this.comm.getUserId(),
      modifiedBy: this.comm.getUserId(),

      actionTypeEn: "0",
      intrnlRouteEn: "0",
      internalValueEn: "",
      externUrlEn: "",
      extTypeEn: 0,
      webViewTitleEn: "",
      backColourEn: "",
      foreColourEn: "",
      titleEn: "",
      descEn: "",
      moreTextEn: "",
      moreURLEn: "",

      actionType: "0",
      intrnlRoute: "0",
      internalValue: "",
      externUrl: "",
      extType: 0,
      webViewTitle: "",
      backColour: "",
      foreColour: "",
      title: "",
      desc: "",
      moreText: "",
      moreURL:""
    };
  }

  ngOnInit() {
    if (this.editobj.moduletype == "B") {
      this.bannerGroupsList = [{ id: '1', name: 'banner group 1', desc: 'banner group 1', status: '1' },
      { id: '2', name: 'banner group 2', desc: 'banner group 2', status: '1' }];
    }
  }
  close() {
    this.dialogRef.close();
  }
  saveModuleConfig() {
    console.log(this.editobj);

    let req1 = {
      "pageid": this.editobj.pageid,
      "moduleid": this.editobj.moduleid,
      "moduleconfiglist": [
        {
          "language": "en",
          "title": this.editobj.titleEn,
          "desc": this.editobj.descEn,
          "moretext": this.editobj.moreTextEn,
          "moreurl": this.editobj.moreURLEn,
          "actiontype": this.editobj.actionTypeEn,
          "redirectpage": this.editobj.intrnlRouteEn,
          "redirectvalue": this.editobj.internalValueEn,
          "externalurl": this.editobj.externUrlEn,
          "externaltype": this.editobj.extTypeEn,
          "webviewtitle": this.editobj.webViewTitleEn,
          "backcolor": this.editobj.backColourEn,
          "forecolor": this.editobj.foreColourEn
        },
        {
          "language": "bah",
          "title": this.editobj.title,
          "desc": this.editobj.desc,
          "moretext": this.editobj.moreText,
          "moreurl": this.editobj.moreURL,
          "actiontype": this.editobj.actionType,
          "redirectpage": this.editobj.intrnlRoute,
          "redirectvalue": this.editobj.internalValue,
          "externalurl": this.editobj.externUrl,
          "externaltype": this.editobj.extType,
          "webviewtitle": this.editobj.webViewTitle,
          "backcolor": this.editobj.backColour,
          "forecolor": this.editobj.foreColour
        }
      ]
    };

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
  onchangeBannerGroup() {
    this.BannersList = [];
    this.showBanners = true;
    this.BannersList.push({ id: "", text: "banner1", order: "0", image: this.env.loginimage, status: "1" });
    this.dataSource = new MatTableDataSource(this.BannersList);
  }
  //onchangeBannerType() {
  //  this.bannerGroupsList = [{ id: '1', name: 'banner group 1', desc: 'banner group 1', status: '1' },
  //    { id: '2', name: 'banner group 2', desc: 'banner group 2', status: '1' }];
  //  this.BannersList = [];
  //}
  showBannerImage(obj) {
    const dialogRef = this.dialog.open(ShowImageComponent, {
      width: '850px',
      data: obj.image,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
