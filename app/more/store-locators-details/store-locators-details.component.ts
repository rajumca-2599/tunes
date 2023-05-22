import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchPipe } from 'src/app/shared/directives/search.pipe';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SharedService } from 'src/app/shared/SharedService';

@Component({
  selector: 'app-store-locators-details',
  templateUrl: './store-locators-details.component.html',
  styleUrls: ['./store-locators-details.component.css'],
  providers: [SearchPipe],
})
export class StoreLocatorsDetailsComponent implements OnInit {
  helpurl = '';
  storeLocatorLst: any = '';
  showemptydiv: boolean = false;
  show: boolean = false;
  searchterm = '';
  txtsearch = '';
  lat: any = '';
  lng: any = '';
  showemptyDataDiv: boolean = false;
  constructor(
    private router: Router,
    public env: EnvService,
    private spinner: NgxSpinnerService,
    private imiapi: IMIapiService,
    private sharedService: SharedService,
    private search: SearchPipe
  ) {}

  ngOnInit(): void {
    this.helpurl = this.imiapi.getglobalsettings();
    this.loadCurrentLocation();
    this.getStoreLocatorList();
  }
  goback() {
    this.router.navigate(['/storelocators']);
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  loadCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          if (this.lat == '' || this.lat == undefined) {
            this.lat = '-6.1801116';
          }
          if (this.lng == '' || this.lng == undefined) {
            this.lng = '106.8218165';
          }
        }
      });
    }
  }

  getStoreLocatorList() {
    let locator_list = this.imiapi.getSession('locator_list');
    if (
      locator_list != undefined &&
      locator_list != 'NA' &&
      locator_list != ''
    ) {
      let tempdata: any;
      tempdata = JSON.parse(locator_list);
      this.storeLocatorLst = tempdata.storelist;
      this.storeLocatorLst.forEach((element) => {
        element.dist = this.getDistanceFromLatLonInKm(
          this.lat,
          this.lng,
          element.lattitude,
          element.longitude
        );
      });
    } else {
      this.spinner.show();
      this.show = true;
      this.imiapi.postData('v1/callcenter/getlist', {}).subscribe(
        (response: any) => {
          this.spinner.hide();
          if ((response.status = '0' && response.data != null)) {
            try{
            this.imiapi.setSession('locator_list', response.data);
            }
            catch(e)
            {}
            this.storeLocatorLst = response.data.storelist;
            this.storeLocatorLst.forEach((element) => {
              element.dist = this.getDistanceFromLatLonInKm(
                this.lat,
                this.lng,
                element.lattitude,
                element.longitude
              );
            });
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    let distance = Math.round(d / 10) * 10;
    return distance;
  }
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  isSelected(event: any) {
    this.showemptydiv = false;
    this.searchterm = event.target.value;
    document.getElementById('txtlocationsearch').blur();
  }
  showMap(data: any) {
    this.sharedService.setOption('locatordata', data);
    this.router.navigate(['/storelocators']);
  }
  searchLocationData(data: any) {
    let locator_list = this.imiapi.getSession('locator_list');
    if (
      locator_list != undefined &&
      locator_list != 'NA' &&
      locator_list != ''
    ) {
      let tempdata: any;
      tempdata = JSON.parse(locator_list);
      this.storeLocatorLst = tempdata.storelist;
      this.storeLocatorLst.forEach((element) => {
        element.dist = this.getDistanceFromLatLonInKm(
          this.lat,
          this.lng,
          element.lattitude,
          element.longitude
        );
      });
      this.storeLocatorLst = this.search.transform(
        this.storeLocatorLst,
        'city,address',
        data
      );
      if (this.storeLocatorLst.length <= 0) {
        this.showemptyDataDiv = true;
        this.searchterm = data;
      } else {
        this.showemptyDataDiv = false;
      }
    }
  }
}
