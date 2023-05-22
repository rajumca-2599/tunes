import { Component, OnInit } from '@angular/core';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { TranslateService } from '@ngx-translate/core';
import {ApidataService} from '../../shared/apidata.service'

@Component({
  selector: 'app-specialpackage',
  templateUrl: './specialpackage.component.html',
  styleUrls: ['./specialpackage.component.css']
})
export class SpecialpackageComponent implements OnInit {
  public specialpackages: any[] = [];

  public hasContent: number = 0;
  placeholders: any[] = [];
  index = 0;
  selectedlanguage='ID';
  config: SwiperConfigInterface = {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  };
  constructor(private imiapi: IMIapiService,private translate:TranslateService
    ,private apiData:ApidataService) {
    this.hasContent = 0;
    this.placeholders = ["0"];
  }


  ngOnInit(): void {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
      // this.packagecodes = [ "P00120|1|PV0000000009|1|PVR0000000013|1","P00120|1|PV0000000008|1|PVR0000000007|1",
    //                      "P00121|1|PV0000010003|1|PVR0000000001|1", "PV0000010003", "PV0000010004", "PV0000000010"]
    let dashboardResp = this.imiapi.getStorage("dashboard");
    if (!(dashboardResp == undefined || dashboardResp == "" || dashboardResp == "NA")) 
      {
          this.processPackages(JSON.parse(dashboardResp));
      }
      else{
        this.hasContent =2;
      }
     /*  else
      {
      this.imiapi.postData("v1/dashboard/get/v2", {}).subscribe((response: any) => {
        if (response.status != null
          && response.status == "0"
          && response.data != undefined) {
          //this.packagecodes = this.getPackageCodesFromDashboard(response.data)
          this.processPackages(response.data);
          // if (this.packagecodes.length == 0) this.hasContent = 2;
        }
        else
        {
          this.hasContent =2;
        }
      });
    } */
    
   
  }

  // Getting the Package Codes from DashBoard 
  processPackages(data): void {
    let packCodes = [];
    try {
      // if (data == undefined || data.length == 0) return packCodes;
      if (data.packdata != undefined && data.packdata.packageslist != undefined && data.packdata.packageslist.length > 0) {
        data.packdata.packageslist.forEach(function (item) {
          if (item.PackageCode != "" && item.PackageCode != undefined) {
            packCodes.push(item.PackageCode)
          }
        });
      }
    } catch (e) {
    }
    if (packCodes.length > 0) {
      this.getspecialpackages(packCodes);
    }
    else {
      this.hasContent = 2;
    }
    //return packCodes;
  }
  getspecialpackages(packagecodes) {
    //let packagecodes = this.packagecodes;
    try {
      let spackages = [];
      // Getting Special Pakages
     // this.imiapi.postData("v1/packages/getspecialpackages", {}).subscribe((response: any) => {
      this.apiData.getSpecialPackages(false).subscribe((response: any) => {
        if (response.status != null && response.status == "0" && response.data != undefined) {

                response.data.forEach(function (item) {
                  if (item.pvr_id != undefined && item.pvr_id.length > 0) {
                    for (var i = 0; i < item.pvr_id.length; i++) {
                      let haspack = packagecodes.includes(item.pvr_id[i]);
                      if (haspack && item.attributes != undefined) {
                        spackages.push({ "home_banner_url": item.attributes.home_banner_url, "home_banner": item.attributes.home_banner });
                        break;
                      }
                    }
                  }
                });

          if (spackages.length > 0) {
            this.hasContent = 1;
            this.specialpackages = spackages;
          }
          else {
            this.hasContent = 2;
          }

        }
        else {
          this.hasContent = 2;
        }
      }, (error => {
        //console.log(error);
      }));
    }
    catch (e) {
    }
  }

  openNewtab(url: any) {
    if (url !='' && url.indexOf("http") == 0 || url.indexOf("https") == 0) {
      window.open(url);
    }
    
  }
}
