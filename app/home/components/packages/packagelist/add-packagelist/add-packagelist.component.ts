import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from '../../../../../shared/services/common.service';
import { catobj } from '../../../masters/categories/add-categories/add-categories.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-packagelist',
  templateUrl: './add-packagelist.component.html',
  styleUrls: ['./add-packagelist.component.css']
})
export class AddPackagelistComponent implements OnInit {

  public title: string = "Commercial Category";
  public catobjIn: catobj = { mainCategory: "", category: "", lang: "id", channelName: "", startPrice: 0, catSubtitle: "", catBannerImage: "", catFooterDesc: "", catRibbon: "", catFooterImage: "", catFeaterImage: "", catListImages: "", sequence: 0, attributeIds: [] };
  public catobjEn: catobj = { mainCategory: "", category: "", lang: "en", channelName: "", startPrice: 0, catSubtitle: "", catBannerImage: "", catFooterDesc: "", catRibbon: "", catFooterImage: "", catFeaterImage: "", catListImages: "", sequence: 0, attributeIds: [] };
  catlist: Array<catobj> = [this.catobjIn, this.catobjEn];
  public mode: string = 'insert';
  public subcribertypes: any[] = [];
  constructor(private comm: CommonService, private router: Router ) {
    
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
  
  submitCategory() {
    let url = "catalog/createcategory";

    this.comm.postData(url, this.catlist).subscribe((resp: any) => {
      if (resp.code == 200)
        this.comm.openDialog('success', resp.message);
      else
        this.comm.openDialog('error', resp.message);
    }, (err => {
      console.log(err);
    }));
  }
  copyPackage() {
    for (let key in this.catobjIn) {
      if (this.catobjIn.hasOwnProperty(key) && key !='lang') {
        this.catobjEn[key] = this.catobjIn[key];
      }
    }
  }
  navigateToPackage() {
    this.router.navigate(['home/packages']);
  }
}
