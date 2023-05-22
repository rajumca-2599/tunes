import { MapsAPILoader } from '@agm/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { CtaModalComponent } from 'src/app/shared/cta-modal/cta-modal.component';
// import { NgxXml2jsonService } from 'ngx-xml2json';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SharedService } from 'src/app/shared/SharedService';
@Component({
  selector: 'app-store-locators',
  templateUrl: './store-locators.component.html',
  styleUrls: ['./store-locators.component.css'],
})
export class StoreLocatorsComponent implements OnInit,OnDestroy {
  helpurl = '';
  showenablelocation: boolean = false;
  storeLocatorLst: any = '';
  webBookUrl: any = '';
  distance: string;
  zoom;
  lat;
  lng;
  getAddress;
  longitude;
  latitude;
  currentLocation: string;
  txtsearch = '';
  data: any = '';
  bookinfoId: any = '';
  showlist: boolean = true;
  description = '';
  googleMapUrl = '';
  bookInfoXml: any = '';
  modalRef: BsModalRef;
  constructor(
    private router: Router,
    public env: EnvService,
    private spinner: NgxSpinnerService,
    private imiapi: IMIapiService,
    private apiloader: MapsAPILoader,
    private sharedService: SharedService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.helpurl = this.imiapi.getglobalsettings();
    let locatordata = this.sharedService.getvoucherInfo('locatordata');
    if (
      locatordata != undefined &&
      locatordata != '' &&
      locatordata != undefined
    )
      this.showLocatorAddress(locatordata);
    else this.getUserCurrentLocation();
  }
  goback() {
    this.router.navigate(['/more']);
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  navigateToDetails() {
    this.router.navigate(['/locator_details']);
  }

  getStoreLocatorList(latitude: any, longitude: any) {
    let locator_list = this.imiapi.getSession('locator_list');
    if (
      locator_list != undefined &&
      locator_list != 'NA' &&
      locator_list != ''
    ) {
      let tempdata: any;
      tempdata = JSON.parse(locator_list);
      this.storeLocatorLst = tempdata.storelist;
      this.webBookUrl = tempdata.webbooking_url;
      this.storeLocatorLst.forEach((element) => {
        element.dist = this.getDistanceFromLatLonInKm(
          latitude,
          longitude,
          element.lattitude,
          element.longitude
        );
      });
      this.storeLocatorLst.sort(function (a, b) {
        return a.dist - b.dist;
      });
    } else {
      this.spinner.show();
      this.imiapi.postData('v1/callcenter/getlist', {}).subscribe(
        (response: any) => {
          this.spinner.hide();
          if ((response.status = '0' && response.data != null)) {
            try {
              this.imiapi.setSession('locator_list', response.data);
            } catch (e) {}
            this.storeLocatorLst = response.data.storelist;
            this.webBookUrl = response.data.webbooking_url;
            this.storeLocatorLst.forEach((element) => {
              element.dist = this.getDistanceFromLatLonInKm(
                latitude,
                longitude,
                element.lattitude,
                element.longitude
              );
            });
            this.storeLocatorLst.sort(function (a, b) {
              return a.dist - b.dist;
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
    console.log('lat1:' + lat1);
    console.log('lon1:' + lon1);
    console.log('lat2:' + lat2);
    console.log('lon2:' + lon2);
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
    let d = R * c; // Distance in km
    let distance = Math.round(d / 10) * 10;
    return distance;
  }
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  showLocatorAddress(item: any) {
    this.data = item;
    this.showlist = false;
    this.StringToXML(this.data.store_desc);
    this.description = item.city;
    this.description += '\n';
    this.description += '\n' + item.address;
    // this.googleMapUrl =
    //   'https://www.google.com/maps/place/' +
    //   item.lattitude +
    //   ',' +
    //   item.longitude +
    //   ',7z';
    this.googleMapUrl =
      'https://www.google.com/maps/search/?api=1&query=' +
      item.lattitude +
      ',' +
      item.longitude;   
    this.loadDefaultLocation(item.lattitude, item.longitude);
  }
  navigateToGoogleMap() {
    let url =
      'https://www.google.com/maps/search/?api=1&query=' +
      this.lat +
      ',' +
      this.lng;
    window.open(url);
  }
  naviagteToList() {
    this.showlist = true;
    this.getUserCurrentLocation();
  }
  openWebUrl() {
    window.open(this.webBookUrl);
  }
  getUserCurrentLocation() {
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

          this.getAddress = (this.lat, this.lng);
          console.log(position);
          console.log('latitude:' + this.lat);
          console.log('longitude:' + this.lng);
          this.apiloader.load().then(() => {
            let geocoder = new google.maps.Geocoder();
            // let latlng = { lat: this.lat, lng: this.lng };
            var selfRef = this;
            this.getStoreLocatorList(this.lat, this.lng);
            geocoder.geocode(
              { location: { lat: this.lat, lng: this.lng } },
              (results, status) => {
                if (status === 'OK') {
                  if (results[0]) {
                    this.zoom = 12;
                    this.currentLocation = results[0].formatted_address;
                    this.imiapi.setSession(
                      'coverage_location',
                      this.currentLocation
                    );
                    console.log(this.currentLocation);
                  } else {
                    console.log('No results found');
                  }
                } else {
                  console.log('Geocoder failed due to: ' + status);
                }
              }
            );

            var map = new google.maps.Map(document.getElementById('map'), {
              center: {
                lat: this.lat,
                lng: this.lng,
              },
              zoom: 13,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              gestureHandling: 'greedy',
            });
            new google.maps.Marker({
              position: { lat: this.lat, lng: this.lng },
              map,
              title: '4g Coverage',
              draggable: false,
              animation: google.maps.Animation.DROP,
            });
            setTimeout(function () {
              map.setCenter(new google.maps.LatLng(selfRef.lat, selfRef.lng));
            }, 1000);
          });
        } else {
          this.loadDefaultLocation('', '');
        }
      });
    } else {
      this.showenablelocation = true;
    }
  }
  loadDefaultLocation(lat: any, lng: any) {
    this.txtsearch = '';
    this.currentLocation = '';
    if (lat == '' || lat == undefined) {
      this.lat = '-6.1801116';
    } else {
      this.lat = Number(lat);
    }
    if (lng == '' || lng == undefined) {
      this.lng = '106.8218165';
    } else {
      this.lng = Number(lng);
    }
    let geocoder = new google.maps.Geocoder();
    let latlng = { lat: this.lat, lng: this.lng };
    var isDraggable = true;
    geocoder.geocode({ location: latlng }, function (results) {
      if (results[0]) {
        this.currentLocation = results[0].formatted_address;
        console.log(this.assgin);
      } else {
        console.log('Not found');
      }
    });
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: this.lat,
        lng: this.lng,
      },
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP],
      },
      mapTypeControl: false,
      scaleControl: true,
      gestureHandling: 'greedy',
      draggable: isDraggable,
      scrollwheel: false,
    });
    new google.maps.Marker({
      position: { lat: this.lat, lng: this.lng },
      map,
      title: '4g Coverage',
    });
  }
  StringToXML(oString) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(oString, 'text/xml');
    this.bookInfoXml = this.ngxXml2jsonService.xmlToJson(xml);
    if (this.bookInfoXml.ops_hour != undefined) {
      if (this.imiapi.getSelectedLanguage() == 'EN') {
        this.bookinfoId = this.bookInfoXml.ops_hour.data[1].table.tr;
        console.log(this.bookinfoId);
      } else this.bookinfoId = this.bookInfoXml.ops_hour.data[0].table.tr;
    }
  }
  openCTAModal() {
    this.modalRef = this.modalService.show(CtaModalComponent, {
      class: 'modal-dialog-centered',
    });
  }
  ngOnDestroy()
  {
    this.sharedService.setOption("locatordata","");
  }
}
