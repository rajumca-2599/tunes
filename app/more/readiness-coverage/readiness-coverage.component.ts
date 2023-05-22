import { AgmMap, MapsAPILoader, MouseEvent } from '@agm/core';
import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvService } from 'src/app/shared/env.service';
import { IMIapiService } from 'src/app/shared/imiapi.service';
import { SharedService } from 'src/app/shared/SharedService';
//import {} from '@types/googlemaps';
//declare var google: any;
@Component({
  selector: 'app-readiness-coverage',
  templateUrl: './readiness-coverage.component.html',
  styleUrls: ['./readiness-coverage.component.css'],
})
export class ReadinessCoverageComponent implements OnInit {
  helpurl = '';
  // @ViewChild(AgmMap, { static: true }) public agmMap: AgmMap;
  zoom;
  lat;
  lng;
  getAddress;
  longitude;
  latitude;
  currentLocation: string;
  showenablelocation: boolean = false;
  txtsearch = '';
  data: any = '';
  currentDate = new Date();
  disableFeedback = false;
  constructor(
    private router: Router,
    private imiapi: IMIapiService,
    public env: EnvService,
    private apiloader: MapsAPILoader,
    private spinner: NgxSpinnerService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.txtsearch = '';
    this.helpurl = this.imiapi.getglobalsettings();
    this.zoom = 16;
    this.getDayWiseFeedBack();
    this.data = this.sharedService.getvoucherInfo('coveragedata');
    if (this.data != null && this.data != undefined) this.loadSelectedMap();
    else this.getUserCurrentLocation();
  }

  goback() {
    this.router.navigate(['/4greadiness']);
  }
  openNewtab() {
    window.open(this.helpurl);
  }
  navigatetoSearch() {
    this.router.navigate(['/coveragesearch']);
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

          this.apiloader.load().then(() => {
            let geocoder = new google.maps.Geocoder();
            // let latlng = { lat: this.lat, lng: this.lng };
            var selfRef = this;
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
          this.loadDefaultLocation();
        }
      });
    } else {
      this.showenablelocation = true;
    }
  }
  //Jakarta Location
  loadDefaultLocation() {
    this.txtsearch = '';
    this.currentLocation = '';
    this.lat = -6.1801116;
    this.lng = 106.8218165;
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
      zoom: 13,
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
  assignFeedback(data: any) {
    if (data == 'bad') {
      this.router.navigate(['/coveragebadfeedback']);
    } else {
      this.router.navigate(['/coveragefeedback']);
    }
  }
  loadSelectedMap() {
    if (this.data != undefined && this.data != '') {
      this.lat = -6.1801116;
      this.lng = 106.8218165;
      this.txtsearch = this.data.city;
      this.currentLocation = this.data.city;
      var isDraggable = true;
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP],
        },
        // disableDefaultUI: true, // a way to quickly hide all controls
        mapTypeControl: false,
        scaleControl: true,
        // zoomControl: true,
        // zoomControlOptions: {
        // style: google.maps.ZoomControlStyle.LARGE
        // },
        gestureHandling: 'greedy',
        draggable: isDraggable,
        scrollwheel: false,
      });
      var marker = new google.maps.Marker({
        position: { lat: this.lat, lng: this.lng },
        map: map,
        title: 'Network Coverage Maps',
        animation: google.maps.Animation.BOUNCE,
      });

      var kmzLayer = new google.maps.KmlLayer({
        url: this.data.coverageurl,
        map: map,
      });
      map.setZoom(15);

      setTimeout(function () {
        map.setCenter(new google.maps.LatLng(this.lat, this.lng));
      }, 1000);
    }
  }
  getDayWiseFeedBack() {
    let feedbackdate = this.imiapi.getSession('feedbackdate');
    if (
      feedbackdate != undefined &&
      feedbackdate != '' &&
      feedbackdate != 'NA'
    ) {
      feedbackdate = JSON.parse(feedbackdate);
      const cValue = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
      if (feedbackdate == cValue) {
        this.disableFeedback = true;
      }
      else{ this.disableFeedback =false;}
    }
  }
}
