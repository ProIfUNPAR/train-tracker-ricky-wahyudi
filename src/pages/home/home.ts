import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Geolocation } from '@ionic-native/geolocation';

declare var google: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  resp: any;
  map: any;
  gmLocation: { lat: number, lng: number } = { lat: -6.917464, lng: 107.619123 };
  @ViewChild('map') mapRef: ElementRef;


  constructor(public navCtrl: NavController, public navParams: NavParams, private geoloc: Geolocation) {

  }

  ionViewDidLoad() {
    this.onLocateUser();
    //this.DisplayMap();


  }

  onLocateUser() {
    this.geoloc.getCurrentPosition()
      .then(
      (resp) => {
        console.log('position gotten: long:', resp.coords.longitude, ' lat:', resp.coords.latitude);
        this.resp = location;
        this.gmLocation.lat = resp.coords.latitude;
        this.gmLocation.lng = resp.coords.longitude;
        const options = { center: this.gmLocation, zoom: 15, streetViewControl: false };
        this.map = new google.maps.Map(this.mapRef.nativeElement, options);
        const loc = new google.maps.LatLng(this.gmLocation.lat, this.gmLocation.lng);
        this.addMarker(loc, this.map);
      }
      )
      .catch(
      (error) => {
        console.log('Error getting location', error);
      }
      )

  }


  addMarker(position, map) {
    return new google.maps.Marker({
      position,
      map
    });
  }
}
