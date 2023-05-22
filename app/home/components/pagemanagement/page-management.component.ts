import {
  Component,
  OnInit,
  NgZone,
  QueryList,
  ViewChildren,
  OnDestroy,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  MatDialog,
  MatSpinner,
  MatDialogRef,
  fadeInContent,
  MatTableDataSource,
  ThemePalette,
} from "@angular/material";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { CommonService } from "../../../shared/services/common.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ShowImageComponent } from "../shared/show-image/show-image.component";
import {
  MatCarouselSlideComponent,
  Orientation,
} from "@ngmodule/material-carousel";
import { ModuleConfigurationComponent } from "../pagemanagement/module-configuration/module-configuration.component";
import { ConfirmDialogComponent } from "../../../shared/confirm-dialog/confirm-dialog.component";

import { PageObject, OrderByObject } from "../../../shared/models/paging";
import { Subscription } from "rxjs";
import { EnvService } from "../../../shared/services/env.service";
//import { concat } from 'rxjs';

@Component({
  selector: "app-page-management",
  templateUrl: "./page-management.component.html",
  animations: [
    trigger("openClose", [
      state(
        "open",
        style({
          display: "block",
          opacity: 1,
        })
      ),
      state(
        "closed",
        style({
          display: "none",
          opacity: 0,
        })
      ),
      transition("open => closed", [animate("0.4s")]),
      transition("closed => open", [animate("0.3s")]),
    ]),
  ],
  styleUrls: ["./page-management.component.css"],
})
export class PageManagementComponent implements OnInit, OnDestroy {
  newmoduleobj: any = {};
  modulemetadata: any[] = [];
  selectedmodule: any = "";
  userpermissions: any = this.ccapi.getpermissions("");
  showeditsegment: boolean = true;
  public isOpen: any = true;
  public isOpenModule: any = true;
  public pageObj: any;
  public moduleObj: any = {};
  public moduleObjview: any = {};
  public searchString: any = "";
  public pagesList: any;
  public modulemasterlist: any[] = [];
  public modulesList: any[] = [];
  newmetadata:any
  public modulePostions: any = [];
  public pagename: any = "";
  public preview: any = false;
  displayedColumns: string[] = ["key", "en", "ba"];
  dataSource: any = new MatTableDataSource();
  dataSourceview: any = new MatTableDataSource();
  pageObject: PageObject = new PageObject();
  orderByObject: OrderByObject = new OrderByObject();

  public bannerGroupsList: any = [];
  public showBanners: boolean = false;
  public BannersList: any = [];
  public showSubmitBtn: boolean = false;
  filtertype: string = "1";
  /* carousel settings start here */
  public timings = "250ms ease-in";
  public autoplay = true;
  public interval = 5000;
  public loop = true;
  public hideArrows = false;
  public hideIndicators = true;
  public color: ThemePalette = "accent";
  public maxWidth = "auto";
  public proportion = 40;
  public proportion1 = 40;
  public proportion2 = 40;
  public slidesList = [];
  public slides: number = 0;
  languageList:any;

  public slidesListedit = [];
  public slidesedit: number = 0;

  public slidesListadd = [];
  public slidesadd: number = 0;

  public overlayColor = "";
  public hideOverlay = false;
  public useKeyboard = true;
  public useMouseWheel = false;
  public orientation: Orientation = "ltr";
  /* carousel settings end here */

  showSnapshot: Boolean = false;
  /* carousel settings start here */
  public timingsimg = "250ms ease-in";
  public autoplayimg = true;
  public intervalimg = 5000;
  public loopimg = true;
  public hideArrowsimg = true;
  public hideIndicatorsimg = true;
  public colorimg: ThemePalette = "accent";
  public maxWidthimg = "auto";
  public proportionimg = 40;
  public proportion1img = 40;
  public proportion2img = 40;
  public slidesListimg = [];
  public slidesimg: number = 0;

  public slidesListeditimg = [];
  public slideseditimg: number = 0;

  public slidesListaddimg = [];
  public slidesaddimg: number = 0;

  public overlayColorimg = "";
  public hideOverlayimg = false;
  public useKeyboardimg = true;
  public useMouseWheelimg = false;
  public orientationimg: Orientation = "ltr";
  /* carousel settings end here */

  public statusText: string = "";

  private _dialog1: Subscription;
  private _dialog2: Subscription;
  private _httpobj1: Subscription;
  private _httpobj2: Subscription;
  private _httpobj3: Subscription;
  private _httpobj4: Subscription;
  private _httpobj5: Subscription;
  private _httpobj6: Subscription;
  showaddsegment: boolean = false;
  filtetypestatus: any[] = [
    { id: "-1", name: "All" },
    { id: "1", name: "Active" },
    { id: "0", name: "Inactive" },
    { id: "2", name: "Pending" },
  ];
  showVideos = false;
  showEcommerce = false;
  lagnuagevalue:any;
  videosList = [];
  eCommerceList = [];
  showvideoorecommerce: boolean = false;
  public Objview: any = {};
  showaddvideos = false;
  showaddecommerce = false;
  constructor(
    private ccapi: CommonService,
    private router: Router,
    private dialog: MatDialog,
    public env: EnvService
  ) {
    this.showBanners = false;
    this.showSubmitBtn = false;
    this.pageObj = {
      pageid: "",
      pagename: "",
      moduleid: "",
      modulename: "",
    };
    this.getlanguages();
    //this.slidesList = [{ id: 1, img: "assets/images/img/slider1.jpg" }, { id: 2, img: "assets/images/img/slider2.jpg" },
    //  { id: 3, img: "assets/images/img/slider3.jpg" }, { id: 3, img: "assets/images/img/slider4.jpg" }];
    //this.slides = this.slidesList.length;
    window.sessionStorage.removeItem("rssmaster");
  }
  @ViewChildren(MatCarouselSlideComponent)
  public carouselSlides: QueryList<MatCarouselSlideComponent>;
  ngOnInit() {
    this.getpages();
    this.getmodulemasters();
    if (this.env.isrssenable) this.getRssList();
    try {
      for (let i = 0; i < window.sessionStorage.length; i++) {
        let _key = window.sessionStorage.key(i);
        if (_key.indexOf("getbannergroups") == 0) {
          window.sessionStorage.removeItem(_key);
          i--;
        }
      }
    } catch (e) {}
  }
  drop(event: CdkDragDrop<string[]>): boolean {
    console.log(event);
    let isAllowed = true;
    for (let i = 0; i < this.modulesList.length; i++) {
      if (this.modulesList[i].ispositionedit == false) {
        //issue in drag drop ispostionedit
        // if (
        //   event.previousIndex >= this.modulesList[i].position &&
        //   this.modulesList[i].position <= event.currentIndex
        // ) {
        //   isAllowed = false;
        // }
        let _curpos = this.modulesList[i].position;
        if (event.previousIndex > event.currentIndex) {
          if (event.currentIndex <= _curpos && event.previousIndex >= _curpos) {
            isAllowed = false;
          }
        } else if (event.previousIndex < event.currentIndex) {
          //6 11
          if (event.currentIndex >= _curpos && event.previousIndex <= _curpos) {
            isAllowed = false;
          }
        }
      }
    }
    if (isAllowed) {
      moveItemInArray(
        this.modulesList,
        event.previousIndex,
        event.currentIndex
      );
      this.setModulePosition();
    }
    return true;
  }
  getpages() {
    let reqObj = { search: "" };
    let _tmodules = this.ccapi.getSession("pagesmasterslist");
    if (_tmodules != null && _tmodules != undefined && _tmodules.length > 10) {
      this.pagesList = JSON.parse(_tmodules);
      if (this.pagesList.length > 0) {
        this.pageSelected(this.pagesList[0]);
      }
      return;
    }

    this._httpobj1 = this.ccapi
      .postData("pages/getpageslist", reqObj)
      .subscribe((response: any) => {
        if (response.code == "500") {
          this.ccapi.openDialog("warning", response.message);
          return;
        } else if (response.code == "200") {
          if (response && response.data != null && response.data.length > 0) {
            this.pagesList = response.data;
            if (this.pagesList.length > 0) {
              this.pageSelected(this.pagesList[0]);
              this.ccapi.setSession(
                "pagesmasterslist",
                JSON.stringify(this.pagesList)
              );
            }
          } else {
            this.ccapi.openDialog("warning", response.message);
          }
        }
      });
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  togglemodule() {
    this.isOpenModule = !this.isOpenModule;
  }
  togglepreview() {
    this.preview = !this.preview;
  }
  getmodules(_pagename) {
    if (_pagename == null || _pagename == undefined || _pagename == "") {
      this.ccapi.openDialog("warning", "Select Page");
      return;
    }
    let _req = {
      name: _pagename,
    };
    this.showaddsegment = false;

    this._httpobj2 = this.ccapi
      .postData("pages/getall", _req)
      .subscribe((response: any) => {
        if (response.code == "500") {
          this.ccapi.openDialog("warning", response.message);
          return;
        } else if (response.code == "200") {
          if (response && response.data && response.data) {
            this.modulesList = response.data;
            if (this.modulesList.length > 0) {
              try {
                for (let _i = 0; _i < this.modulesList.length; _i++) {
                  this.modulesList[_i].currentstatus =
                    this.modulesList[_i].status + "";
                  this.modulesList[_i].class = "module_active";
                  if (this.modulesList[_i].category == "2") {
                    this.modulesList[_i].class = "module_noedit";
                    if (this.modulesList[_i].issourceedit) {
                      this.modulesList[_i].class = "module_cat2_edit";
                    }
                  } else if (this.modulesList[_i].ispositionedit == false) {
                    this.modulesList[_i].class = "module_noposistionchange";
                  }
                  if (this.modulesList[_i].status == "2")
                    this.modulesList[_i].status = "0";
                }
              } catch (e) {}
              this.moduleSelected(this.modulesList[0]);
              this.setModulePosition();
            }
          } 
        } 
      });
  }
  pageSelected(p) {
    this.filtertype = "1";
    this.modulesList = [];
    this.pageObj = {};
    this.pageObj.pageid = p.id;
    this.pageObj.pagename = p.name;
    this.showSubmitBtn = false;
    this.pagename = p.description;
    this.getmodules(p.name);
    this.showaddsegment = false;
  }
  moduleSelected(m) {
    console.log(m)
    this.getlanguages();
    // if (m.category != "1") {
    //   this.showeditsegment = false;
    //   this.modulemetadata = [];
    //   this.ccapi.hidehttpspinner();
    //   // this.ccapi.openDialog("warning", "Edit Not Allowed");
    //   return true;
    // }
    console.log(m);
    this.showBanners = true;
    this.showSubmitBtn = true;
    let pagename = this.pageObj.pagename;
    this.moduleObj = m;
    this.showeditsegment = true;
    this.showaddsegment = false;
    this.showvideoorecommerce = false;
    this.showEcommerce = false;
    this.showVideos = false;
    this.moduleObjview = JSON.parse(JSON.stringify(m));
    this.Objview = JSON.parse(JSON.stringify(m));
    if (m.status == 1) {
      this.statusText = "Active";
    } else {
      this.statusText = "Inactive";
    }
    if (!m.ispositionedit && !m.issourceedit && !m.isstatusedit) {
      this.showBanners = false;
      let slideobj = { img: m.screenshot, id: 1 };
      this.slidesListimg = [];
      this.slidesListimg.push(slideobj);
      this.slidesimg = 1;
      this.showSnapshot = true;
    } else {
      this.showSnapshot = false;
      this.showBanners = false;
    }
    if (m.module_type == "12" && m.category == "3") {
      this.showVideos = true;
      this.showvideoorecommerce = true;
      this.showeditsegment = false;
      this.videosList = this.getRssList(m.module_type);
      return;
    }
    if (m.module_type == "13" && m.category == "3") {
      this.showEcommerce = true;
      this.showvideoorecommerce = true;
      this.showeditsegment = false;
      this.eCommerceList = this.getRssList(m.module_type);
      return;
    }
    if (m.category != "1" && m.category != "3") {
      this.showBanners = false;
      this.showSnapshot = true;
      if (m.screenshot != null && m.screenshot != "NA") {
        let slideobj = { img: m.screenshot, id: 1 };
        this.slidesListimg = [];
        this.slidesListimg.push(slideobj);
        this.slidesimg = 1;
        this.showSnapshot = true;
      }
    } else {
      this.getBannerGroups(this.moduleObj.module_type);
      this.getbannerlist(this.moduleObj.sourceid, "1");
      if (this.moduleObj.sourceid != undefined) {
        this.showBanners = true;
        setTimeout(() => {
          this.onchangeBannerGroup();
        }, 2000);
      }
    }
    this.modulemetadata = this.formatmetadata(1, m.metadata);
    this.dataSource = new MatTableDataSource(this.modulemetadata);
    console.log(this.dataSource,"123")
    this.dataSourceview = new MatTableDataSource(
      this.formatmetadata(1, this.moduleObjview.metadata)
    );
  }
  formatmetadata(type, metadata) {
    this.newmetadata=metadata
    try {
      if (type == "1") {
        let _keys = [];
        for (let a = 0; a < metadata.length; a++) {
          if (_keys.indexOf(metadata[a].key) == -1) {
            _keys.push(metadata[a].key);
          }
        }
        if (_keys.length > 0) {
          let _out = [];
          let _itm = {
            key: "",
            en: "",
            ba: "",
            keyid: "",
            envalueid: "0",
            bavalueid: "0",
          };
          for (let a = 0; a < _keys.length; a++) {
            _itm = {
              key: "",
              en: "",
              ba: "",
              keyid: "",
              envalueid: "0",
              bavalueid: "0",
            };
            _itm.key = _keys[a];

            let _t1 = metadata.filter(function (ele, idx) {
              return ele.key == _keys[a] && ele.language == "en";
            });
            if (_t1 != null && _t1.length > 0) {
              _itm.en = _t1[0].value;
              _itm.keyid = _t1[0].keyid;
              _itm.envalueid = _t1[0].valueid;
            }

            _t1 = metadata.filter(function (ele, idx) {
              return ele.key == _keys[a] && ele.language == "id";
            });
            if (_t1 != null && _t1.length > 0) {
              _itm.ba = _t1[0].value;
              _itm.keyid = _t1[0].keyid;
              _itm.bavalueid = _t1[0].valueid;
            }
            if (_itm.ba == "") {
              _itm.ba = _itm.en;
            }
            _out.push(_itm);
          }
          return _out;
        }
      } else if (type == "2") {
        let _out = [];
        for (let a = 0; a < this.moduleObj.metadata.length; a++) {
          let _key = this.moduleObj.metadata[a].key;
          let _id = this.moduleObj.metadata[a].valueid;
          let _txt = this.modulemetadata.filter(function (ele, idx) {
            return ele.key == _key;
          });
          let index = _out.filter(function (ele) {
            return ele.valueid == _txt[0].envalueid;
          });
          //Changes for JIRA ID: DIGITAL-4647 on 07-09-2020
          if (index.length == 0) {
            let _itm = {
              key: this.moduleObj.metadata[a].key,
              keyid: this.moduleObj.metadata[a].keyid,
              language: "en",
              value: _txt[0].en,
              valueid: _txt[0].envalueid,
            };
            _out.push(_itm);

            let _itm1 = {
              key: this.moduleObj.metadata[a].key,
              keyid: this.moduleObj.metadata[a].keyid,
              language: this.lagnuagevalue,
              value: _txt[0].ba,
              valueid: _txt[0].bavalueid,
            };
            _out.push(_itm1);
          }
        }
        return _out;
      }
    } catch (e) {}
    return [];
  }

  getBannerGroups(_type) {
    let reqObj = {
      bannerType: _type,
      length: 100,
      orderDir: "desc",
      search: "",
      start: 1,
      status: 1,
    };
    let _bgrp = this.ccapi.getSession("getbannergroups_" + _type);
    if (_bgrp != null && _bgrp != undefined && _bgrp != "") {
      let _tmplst = JSON.parse(_bgrp);
      if (_tmplst != null && _tmplst.length > 0) {
        this.bannerGroupsList = _tmplst;
        setTimeout(() => {
          if (
            this.moduleObj.sourceid != null &&
            this.moduleObj.sourceid != undefined
          ) {
            this.moduleObj.sourceid = this.moduleObj.sourceid + "";
          }
          if (
            this.moduleObjview.sourceid != null &&
            this.moduleObjview.sourceid != undefined
          ) {
            this.moduleObjview.sourceid = this.moduleObjview.sourceid + "";
          }
        }, 100);
        return;
      }
    }
    this._httpobj3 = this.ccapi
      .postData("banners/getbannergroups", reqObj)
      .subscribe((response: any) => {
        if (response.code == "500") {
          this.ccapi.openDialog("warning", response.message);
          return;
        } else if (response.code == "200") {
          if (response && response.data && response.data) {
            for (var i = 0; i < response.data.length; i++) {
              response.data[i].bannergroupid =
                response.data[i].bannergroupid + "";
            }
            this.bannerGroupsList = response.data;
            this.ccapi.setSession(
              "getbannergroups_" + _type,
              JSON.stringify(response.data)
            );
            setTimeout(() => {
              if (
                this.moduleObj.sourceid != null &&
                this.moduleObj.sourceid != undefined
              ) {
                this.moduleObj.sourceid = this.moduleObj.sourceid + "";
              }
              if (
                this.moduleObjview.sourceid != null &&
                this.moduleObjview.sourceid != undefined
              ) {
                this.moduleObjview.sourceid = this.moduleObjview.sourceid + "";
              }
            }, 100);
          }
          //  else {
          //   this.ccapi.openDialog("warning", "No Group Available");
          // }
        }
      });
  }
  setModulePosition() {
    // set module postions
    for (var i = 0; i < this.modulesList.length; i++) {
      let pageid = this.modulesList[i].pageid;
      let moduleid = this.modulesList[i].moduleid;
      //Changes for JIRA ID: DIGITAL-4647 on 07-09-2020
      let sourceid = this.modulesList[i].sourceid;
      var chkpositions = this.modulePostions.filter(function (element, index) {
        return (
          element.pageid == pageid &&
          element.moduleid == moduleid &&
          element.sourceid == sourceid
        );
      });
      if (this.modulesList[i].ispositionedit == false) {
        if (chkpositions.length == 0) {
          this.modulePostions.push({
            pageid: pageid,
            moduleid: moduleid,
            mname: this.modulesList[i].modulename,
            position: this.modulesList[i].position,
            pagemoduleid: this.modulesList[i].pagemoduleid,
            sourceid: this.modulesList[i].sourceid,
          });
        }
      } else {
        if (chkpositions.length == 0)
          this.modulePostions.push({
            pageid: pageid,
            moduleid: moduleid,
            mname: this.modulesList[i].modulename,
            position: i,
            pagemoduleid: this.modulesList[i].pagemoduleid,
            sourceid: this.modulesList[i].sourceid,
          });
        else chkpositions[0].position = i;
      }
    }
  }
  onchangeBannerGroup() {
    this.getbannerlist(this.moduleObj.sourceid, "2");
  }
  showBannerImage(obj) {
    const dialogRef = this.dialog.open(ShowImageComponent, {
      width: "850px",
      data: obj.image,
    });
    this._dialog1 = dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  // editContent() {
  //   console.log(this.pageObj);
  //   let editObj = {
  //     pageid: this.pageObj.pageid,
  //     moduleid: this.pageObj.moduleid,
  //     modulename: this.pageObj.modulename,
  //     moduletype: this.pageObj.module_type,
  //     bannergroup: this.pageObj.bannergroup,
  //     pagename: this.pageObj.pagename,
  //   }
  //   console.log(editObj);
  //   const dialogRef = this.dialog.open(ModuleConfigurationComponent, {
  //     width: '1050px',
  //     data: editObj,
  //     disableClose: true
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     // this.getmodules();
  //   });
  // }
  onChange(p) {}
  toggleStatus(evnt) {
    console.log(evnt);
    if (evnt.checked) {
      this.statusText = "Active";
      this.moduleObj.status = true;
      this.moduleObjview.status = true;
    } else {
      this.statusText = "Inactive";
      this.moduleObj.status = false;
      this.moduleObjview.status = false;
    }
  }

  getbannerlist(id, type) {
    this.BannersList = [];
    let reqObj = { bannergroupid: id };
    if (type == "1") {
      this.slidesList = [];
      this.slides = 0;
    } else if (type == "2") {
      this.slidesListedit = [];
      this.slidesedit = 0;
    } else {
      this.slidesListadd = [];
      this.slidesadd = 0;
    }
    if (id == 0) return;
    let _grpidlst = this.ccapi.getSession("getbannergroupById_" + id);
    if (_grpidlst != null && _grpidlst != undefined && _grpidlst.length > 0) {
      this.ccapi.showhttpspinner();
      setTimeout(() => {
        this.ccapi.hidehttpspinner();
      }, 2000);
      let _list = JSON.parse(_grpidlst);
      if (type == "1") {
        this.slidesList = _list;
        this.slides = this.slidesList.length;
      } else if (type == "2") {
        this.slidesListedit = _list;
        this.slidesedit = this.slidesListedit.length;
      } else if (type == "3") {
        this.slidesListadd = _list;
        this.slidesadd = this.slidesListedit.length;
      }

      return;
    }
    this._httpobj4 = this.ccapi
      .postData("banners/getbannergroupById", reqObj)
      .subscribe(
        (response: any) => {
          if (response != null && response.code == "500") {
            this.ccapi.openSnackBar(
              "Details not available for selected banner group"
            );
            return;
          } else if (response != null && response.code == "200") {
            if (
              response.bannergroups != null &&
              response.bannergroups.length > 0
            ) {
              this.ccapi.showhttpspinner();
              setTimeout(() => {
                this.ccapi.hidehttpspinner();
              }, 2000);
              this.showBanners = true;
              var _list: any[] = [];
              for (
                var i = 0;
                i < response.bannergroups[0].banners.length;
                i++
              ) {
                if (response.bannergroups[0].banners[i].status != "1") continue;
                let _b = {
                  id: response.bannergroups[0].banners[i].bannerid,
                  img: this.ccapi.getBannerUrl(
                    response.bannergroups[0].banners[i].bannerid
                  ),
                };
                _list.push(_b);
              }
              try {
                _list.sort((a, b) => a.order.localeCompare(b.order));
              } catch (e) {}

              if (_list.length == 0) {
                this.ccapi.openDialog("warning", "Banner Group is Inactive");
              } else {
                this.ccapi.setSession(
                  "getbannergroupById_" + id,
                  JSON.stringify(_list)
                );
                if (type == "1") {
                  this.slidesList = _list;
                  this.slides = this.slidesList.length;
                } else if (type == "2") {
                  this.slidesListedit = _list;
                  this.slidesedit = this.slidesListedit.length;
                } else if (type == "3") {
                  this.slidesListadd = _list;
                  this.slidesadd = this.slidesListedit.length;
                }
              }
            } else {
              this.ccapi.openDialog(
                "warning",
                "No Banners Active in this Group"
              );
            }
          }
        },
        (err) => {
          this.ccapi.HandleHTTPError(err);
        }
      );
  }
  updatedetails() {
    let url = "pages/addworkflow";
    var _tmp;
    let req;
    if (
      (this.moduleObj.module_type == "12" && this.moduleObj.category == "3") ||
      (this.moduleObj.module_type == "13" && this.moduleObj.category == "3")
    ) {
      _tmp = JSON.parse(JSON.stringify(this.moduleObjview));
      _tmp.metadata = this.formatmetadata(2, this.moduleObjview.metadata);
      req = {
        json: _tmp,
        createdby: 1,
        moduleid: this.moduleObjview.moduleid,
        pageid: this.moduleObjview.pageid,
        pagemoduleid: this.moduleObjview.pagemoduleid,
      };
    } else {
      _tmp = JSON.parse(JSON.stringify(this.moduleObj));
      _tmp.metadata = this.formatmetadata(2, this.moduleObj.metadata);
      req = {
        json: _tmp,
        createdby: 1,
        moduleid: this.moduleObj.moduleid,
        pageid: this.moduleObj.pageid,
        pagemoduleid: this.moduleObj.pagemoduleid,
      };
    }
    try {
      if (req.json.status == false) req.json.status = "0";
      else req.json.status = "1";
    } catch (e) {}
    try {
      let _isvalid = true;
      if (_tmp.metadata != null && _tmp.metadata.length > 0) {
        for (let i = 0; i < _tmp.metadata.length; i++) {
          var _val = _tmp.metadata[i].value;
          if (_val == null || _val == undefined || _val == "") {
            _isvalid = false;
            this.ccapi.openDialog(
              "warning",
              _tmp.metadata[i].key.toUpperCase() + "  value should not be empty"
            );
            break;
          }
          // if (_tmp.metadata[i].key.toLowerCase().indexOf("url") >= 0) {
          //   if (_val.indexOf("http://") != 0 && _val.indexOf("https://") != 0) {
          //     _isvalid = false;
          //     this.ccapi.openDialog("warning", _tmp.metadata[i].key.toUpperCase() + "  value should start with http"); break;
          //   }
          // }
        }
      }
      if (!_isvalid) {
        return;
      }
    } catch (e) {}
    console.log(req);
    this._httpobj5 = this.ccapi.postData(url, req).subscribe(
      (resp: any) => {
        if (resp.code == "200") this.ccapi.openDialog("success", resp.message);
        else this.ccapi.openDialog("error", resp.message);
      },
      (err) => {
        console.log(err);
        this.ccapi.HandleHTTPError(err);
      }
    );
  }
  getstatustext(id) {
    if (id == null || id == undefined || id == "") return "Active";
    if (id == "1") return "Active";
    else if (id == "0") return "In Active";
  }
  getwfstatus(id) {
    if (id == null || id == undefined || id == "") return "Live";
    if (id == "0") return "Live";
    else return "Pending";
  }
  getwfstatusbadge(id) {
    if (id == null || id == undefined || id == "") return "L";
    if (id == "0") return "L";
    else return "P";
  }
  getlangtext(id) {
    if (id == "en") return "English";
    else return "Bahasa";
  }

  updateorder() {
    let url = "pages/editorder";

    console.log(this.modulePostions);
    var req = this.modulePostions;
    console.log(req);
    this._httpobj6 = this.ccapi.postData(url, req).subscribe(
      (resp: any) => {
        if (resp.code == "200") this.ccapi.openDialog("success", resp.message);
        else this.ccapi.openDialog("error", resp.message);
      },
      (err) => {
        console.log(err);
        this.ccapi.HandleHTTPError(err);
      }
    );
  }

  showconfirm(reqtype) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      width: "400px",
      data: {
        message: 'Please click "YES" to process this request.',
        confirmText: "Yes",
        cancelText: "No",
      },
    });
    this._dialog2 = dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        if (reqtype == "order") {
          this.updateorder();
        } else if (reqtype == "page") {
          this.updatedetails();
        }
      }
    });
  }

  ngOnDestroy() {
    console.log("destroypostdata");
    if (this._httpobj1 != null && this._httpobj1 != undefined)
      this._httpobj1.unsubscribe();

    if (this._httpobj2 != null && this._httpobj2 != undefined)
      this._httpobj2.unsubscribe();

    if (this._dialog1 != null && this._dialog1 != undefined)
      this._dialog1.unsubscribe();

    if (this._dialog2 != null && this._dialog2 != undefined)
      this._dialog2.unsubscribe();

    if (this._httpobj3 != null && this._httpobj3 != undefined)
      this._httpobj3.unsubscribe();

    if (this._httpobj4 != null && this._httpobj4 != undefined)
      this._httpobj4.unsubscribe();

    if (this._httpobj5 != null && this._httpobj5 != undefined)
      this._httpobj5.unsubscribe();

    if (this._httpobj6 != null && this._httpobj6 != undefined)
      this._httpobj6.unsubscribe();
  }
  /* Module management*/
  getmodulemasters() {
    let reqObj = {};
    let _tmodules = this.ccapi.getSession("modulemasterslist");
    if (_tmodules != null && _tmodules != undefined && _tmodules.length > 1) {
      this.modulemasterlist = JSON.parse(_tmodules);
      return;
    }
    this._httpobj1 = this.ccapi
      .postData("pages/modules", reqObj)
      .subscribe((response: any) => {
        if (response.code == "500") {
          this.ccapi.openDialog("warning", response.message);
          return;
        } else if (response.code == "200") {
          if (response && response.data && response.data) {
            this.modulemasterlist = response.data;
            if (
              this.modulemasterlist != null &&
              this.modulemasterlist != undefined &&
              this.modulemasterlist.length > 0
            )
              this.ccapi.setSession(
                "modulemasterslist",
                JSON.stringify(this.modulemasterlist)
              );
          } else {
            this.ccapi.openDialog("warning", response.message);
          }
        }
      });
  }
  addmodule() {
    this.showeditsegment = false;
    this.showaddsegment = true;
    this.selectedmodule = "";
    this.newmoduleobj = {};
    this.slidesListadd = [];
    this.slidesadd = 0;
    this.preview = false;
    this.showEcommerce = false;
    this.showVideos = false;
    this.showvideoorecommerce = false;
  }
  onchangeaddmodule() {
    this.showaddecommerce = false;
    this.showaddvideos = false;
    this.newmoduleobj = {};
    let _modselected = this.selectedmodule;
    let _newlist = (this.newmoduleobj = this.modulemasterlist.filter(function (
      ele,
      id
    ) {
      return ele.id == _modselected;
    }));
    if (_newlist != null && _newlist.length > 0) {
      this.newmoduleobj.id = _newlist[0].id;
      this.newmoduleobj.name = _newlist[0].name;
      this.newmoduleobj.isstatusedit = true;
      this.newmoduleobj.ispositionedit = true;
      this.newmoduleobj.issourceedit = true;
      this.newmoduleobj.soruce = 0;
      if (_newlist[0].module_type == "13") {
        this.showaddecommerce = true;
        this.eCommerceList = this.getRssList(_newlist[0].module_type);
      } else if (_newlist[0].module_type == "12") {
        this.showaddvideos = true;
        this.videosList = this.getRssList(_newlist[0].module_type);
      } else this.getBannerGroups(_newlist[0].module_type);
    }
  }

  addnewmodule() {
    if (
      !this.ccapi.isvalidtext(this.selectedmodule, "Please Select Module") ||
      this.selectedmodule == "0"
    )
      return;
    if (
      this.newmoduleobj.sourceid == null ||
      this.newmoduleobj.sourceid == undefined ||
      this.newmoduleobj.sourceid == "0"
    ) {
      this.ccapi.openDialog("warning", "Select Banner Group");
      return;
    }

    let reqObj = {
      pageid: this.pageObj.pageid,
      moduleid: this.selectedmodule,
      status: 2,
      isstatusedit: true,
      ispositionedit: true,
      issourceedit: true,
      sourceid: this.newmoduleobj.sourceid,
    };
    this._httpobj1 = this.ccapi
      .postData("pages/addpagemodule", reqObj)
      .subscribe((response: any) => {
        if (response.code == "500") {
          this.ccapi.openDialog("warning", response.message);
          return;
        } else if (response.code == "200") {
          this.getmodules(this.pageObj.pagename);
          this.ccapi.openDialog("success", "Module Successfully Added");
          this.newmoduleobj = {};
          this.showaddsegment = false;
        }
      });
  }

  showaddconfirm() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      width: "400px",
      data: {
        message: 'Please click "YES" to add this module.',
        confirmText: "Yes",
        cancelText: "No",
      },
    });
    this._dialog2 = dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.addnewmodule();
      }
    });
  }

  onchangeBannerGroupAdd() {
    this.getbannerlist(this.newmoduleobj.sourceid, "3");
  }
  filtermodules(type) {
    this.filtertype = type;
  }
  getRssList(categoryType: any = null) {
    var lst = [];
    var catgDesc = "";
    if (categoryType == "12") catgDesc = "videos";
    else catgDesc = "ecommerce";
    var rssList = this.ccapi.getSession("rssmaster");
    if (rssList != undefined && rssList != null && rssList != "") {
      lst = JSON.parse(rssList);
      if (categoryType != null) lst = lst.filter((x) => x.category == catgDesc);
      console.log(lst);
    } else {
      let requesrParams = {
        start: 1,
        length: 100,
        roleid: this.ccapi.getRole(),
        userId: this.ccapi.getUserId(),
      };
      this._httpobj1 = this.ccapi
        .postData("rss/list", requesrParams)
        .subscribe((response: any) => {
          if (response.code == "500") {
            this.ccapi.openDialog("warning", response.message);
            return;
          } else if (response.code == "200") {
            var activelist = response.rssmasters.filter((x) => x.status == 1);
            this.ccapi.setSession("rssmaster", JSON.stringify(activelist));
            if (categoryType != null) {
              var rssList = this.ccapi.getSession("rssmaster");
              if (rssList != undefined && rssList != null && rssList != "") {
                lst = JSON.parse(rssList);
                if (categoryType != null)
                  lst = lst.filter((x) => x.category == catgDesc);
              }
              return lst;
            }
          }
        });
    }
    return lst;
  }
  someMethod(value:any){
  
    var filter_array = this.newmetadata.filter(x => x.language == value);
   if(filter_array.length>0){
    this.modulemetadata[0].ba=filter_array[0].value;
    
   }
   else{
    this.modulemetadata[0].ba="";
   }
      
    }
    public ifColorDark(color: string): boolean {
      return color.indexOf('English' || 'english') !== -1;
    }
    getlanguages() {
      this.dataSource = new MatTableDataSource([]);
      this._httpobj1 = this.ccapi.postData('template/json ',{"type": "Circles"}).subscribe((response: any) => {
        if (response.code == "500") {
          this.ccapi.openDialog("warning", response.message);
          return;
        }
        else if (response.code == "200") {
          if (response.data != null && response.status == "success") {
          
            let newlist=JSON.parse(response.data)
            this.languageList=newlist.data.languages;
            var filter_array = this.languageList.filter(x => x.id =="hi");
            this.lagnuagevalue=filter_array[0].id
          }
          else {
            this.dataSource = new MatTableDataSource([]);
           
            this.ccapi.openSnackBar("No Records Found");
          }
        }
      }, error => {
        this.ccapi.HandleHTTPError(error);
      });
    };
}
