import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router} from '@angular/router';
import { CommonService } from '../../../../../shared/services/common.service';



@Component({
  selector: 'app-manage-banner',
  templateUrl: './manage-banner.component.html',
  styleUrls: ['./manage-banner.component.css']
})
export class ManageBannerComponent implements OnInit {
  public bannergroupdetail: any;
  public bannersdetail: any;
  constructor(private comm: CommonService, private router: Router, private activeRoute: ActivatedRoute) {
    this.bannergroupdetail = {
      id: 0,
      name: "",
      desc: "",
      startdate: "",
      enddate: "",
      banners:[]
    }
  }

  ngOnInit() {
    const bgid = this.activeRoute.snapshot.params["bgid"];
    alert(bgid);
    // get banner group details and group banners details
    this.bannergroupdetail.id = 1;
    this.bannergroupdetail.name = "banner 1";
    this.bannergroupdetail.desc = "banner group 1";
    this.bannergroupdetail.startdate = "2019-08-30 10:24:11";
    this.bannergroupdetail.enddate = "2019-08-31 10:24:11";

    this.bannersdetail =[]
    // get all banners based on pagenation

  }

}
