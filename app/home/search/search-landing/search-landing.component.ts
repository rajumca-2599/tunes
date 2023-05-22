import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import {  SwiperComponent,
  SwiperDirective,
  SwiperConfigInterface,
  SwiperScrollbarInterface,
  SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { ApidataService } from 'src/app/shared/apidata.service';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
declare var $: any;
@Component({
  selector: 'app-search-landing',
  templateUrl: './search-landing.component.html',
  styleUrls: ['./search-landing.component.css'],
})
export class SearchLandingComponent implements OnInit {
  txtsearch: string = '';
  @ViewChild(SwiperComponent) swiperView: QueryList<SwiperComponent>;
  @ViewChild(SwiperDirective) directiveRef?: SwiperDirective;
  constructor(
    public env: EnvService,
    private imiapi: IMIapiService,
    private translate: TranslateService,
    private apidata: ApidataService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService
  ) {}
  sourceScreen = '';
  selectedlanguage = 'ID';
  popularSearchList: any[] = [];
  searchResult: any[] = [];
  index = 0;
  show: boolean = false;
  searchterm=''
  showemptydiv=false;
  swiperid=7

  public arrconfig = [];
  
 
  config: SwiperConfigInterface[] = [{
    slidesPerView: 1.25,
    
    spaceBetween: 0,
    breakpoints: {
      991.98: {
        slidesPerView: 2.25,
        spaceBetween: 0,
      },
      767.98: {
        slidesPerView: 1.25,
        spaceBetween: 0,
      },
      575.98: {
        slidesPerView: 1.25,
        spaceBetween: 0,
      },
    },
  },
  {
    slidesPerView: 1.25,
    
    spaceBetween: 0,
    breakpoints: {
      991.98: {
        slidesPerView: 2.25,
        spaceBetween: 0,
      },
      767.98: {
        slidesPerView: 1.25,
        spaceBetween: 0,
      },
      575.98: {
        slidesPerView: 1.25,
        spaceBetween: 0,
      },
    },
  }];



  scrollbar: SwiperScrollbarInterface = {
    el: '.swiper-scrollbar',
    hide: false,
    draggable: true
  };
  helpurl="";
  ngOnInit(): void {
    this.selectedlanguage = this.imiapi.getSelectedLanguage();
    this.translate.use(this.selectedlanguage);
    this.sourceScreen = this.route.snapshot.params.sourcescreen;
    this.helpurl = this.imiapi.getglobalsettings();
    this.getpopularsearchList();
  }

  search(data: any) {
    this.searchResult = [];
    this.show = true;
    var obj = { SEARCH_TERM: data, servicename: 'GET PACKAGE' };
    this.spinner.show();
    this.imiapi.postData('v1/packages/search', obj).subscribe(
      (response: any) => {
        this.spinner.hide();
        if(response.data!=null&& response.data.commercial_package_category.length>0){
        this.searchResult = response.data.commercial_package_category;
        this.searchResult.forEach(element => {
          element.commercial_package.forEach(childelement => {
            childelement.traiffdisplay=childelement.tariff_display.replace('Rp', '');
          });
        });
        }
        else
        this.showemptydiv=true;
      },
      (error) => {
       // console.log(error);
      }
    );
  }

  // onIndexTopChange(index: number) {
  //   this.swiperView['_results'][1].setIndex(index);
  // }

  gotoback() {
    this.apidata.footerstateName.next(this.sourceScreen);
    this.imiapi.setStorageValue('footerstateName', this.sourceScreen);
    this.router.navigate(['/' + this.sourceScreen]);
  }

  assignData(data: any) {
    this.showemptydiv=false
    this.txtsearch = data;
    this.searchterm=data;
    this.search(data);
  }
  isSelected(event: any) {
    this.showemptydiv=false
    this.searchterm=event.target.value;
    this.search(event.target.value);  
    document.getElementById("txtpackagesearch").blur();
  }
  getpopularsearchList() {
    this.spinner.show();
    this.imiapi
      .postData('v1/settings/getvalue', { module: 'MOBAPP_SETTINGS' })
      .subscribe((response: any) => {
        this.spinner.hide();
        if (response.status != null && response.data != undefined) {
          if (response.status == '0') {
            let result = response.data.POPULAR_SEARCH_KEYWORDS;
            if (result.length > 0) {
              this.popularSearchList = result.split(',');
            }
          }
        }
      });
  }
  navigatetopackageList(catgId: any) {
    this.imiapi.setSession('catgId', catgId);
    this.router.navigate(['/viewpackagelist']);
  }
  navigatetoPackage(item: any) {
    // this.imiapi.setSession('selectedpackage',item);
    this.imiapi.setSession('pvrcode', item.pvr_code);
    this.imiapi.setSession('navigationfrom', 'package');
    this.router.navigate(['/viewpackage']);
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  enablefavourite(item: any) {
    if (!item.isfavourite) var url = 'v1/favourites/add';
    else url = 'v1/favourites/delete';
    var obj = { packageid: item.pvr_code };
    this.spinner.show();
    this.imiapi.postData(url, obj).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.status == 0) {
          if (!item.isfavourite) {
            this.searchResult[0].commercial_package.forEach((element, index) => {
              if (element.pvr_code == item.pvr_code) {
                element.isfavourite=true
              }
            });
            $('#viewpackagesucess').modal('show');
            return;
          } else {
            this.searchResult[0].commercial_package.forEach((element, index) => {
              if (element.pvr_code == item.pvr_code) {
                element.isfavourite=false
              }
            });
            $('#viewpackageremove').modal('show');
            return;
          }
        }
      },
      (error) => {
        //console.log(error);
      }
    );
  }
  reloadpackage(model: any) {
    $('#' + model).modal('hide');
    //this.getPakageList();
  }
  getpackage(item: any) {
    this.imiapi.setSession('pvrcode', item.pvr_code);
    this.imiapi.setSession('navigationfrom', 'packagesearch/'+ this.sourceScreen);
    this.apidata.footerstateName.next('package');
    this.imiapi.setStorageValue('footerstateName', 'package');
    this.router.navigate(['/viewpackage']);
  }
}
