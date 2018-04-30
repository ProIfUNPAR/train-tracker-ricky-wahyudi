import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';

declare var google: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  resp: any;
  map: GoogleMap;
  gmLocation: { lat: number, lng: number } = { lat: -6.917464, lng: 107.619123 };
  @ViewChild('map') mapRef: ElementRef;
  markers: any = [];
  train: { lat: number, lng: number } = { lat: -6.9126, lng: 107.6023 };
  distance: any = "Pilih Argo dan Statiun";
  time: any = "Pilih Argo dan Statiun";
  kecepatan: any = "Pilih Argo dan Statiun";
  kereta = [];
  statiun = [];
  tujuan = 0;
  stasiunTujuan: any = "Pilih Argo dan Statiun";
  cimage:any;


  constructor(public navCtrl: NavController, public navParams: NavParams, private geoloc: Geolocation, public http: Http) {
    this.loadJson();
  }

  ionViewDidLoad() {
    this.onLocateUser();
    //this.DisplayMap();
    this.calculateAndDisplayRoute();
    this.kereta;
    this.statiun;
    this.distance;
    this.time;
    this.kecepatan;
    this.stasiunTujuan;
  }

  onLocateUser() {
    this.geoloc.watchPosition().subscribe((resp) => {
      console.log('position gotten: long:', resp.coords.longitude, ' lat:', resp.coords.latitude);
      this.resp = location;
      this.gmLocation.lat = resp.coords.latitude;
      this.gmLocation.lng = resp.coords.longitude;
      //const options = { center: this.gmLocation, zoom: 12, streetViewControl: false};
	  let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.gmLocation.lat,
          lng: this.gmLocation.lng
        },
        zoom: 18,
        tilt: 30
      }
     };
      this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);
	  //this.map = GoogleMaps.create('mymap',mapOptions);
	 //this.map.one(GoogleMapsEvent.MAP_READY)
      //.then(() => {
       // console.log('Map is ready!');
		//this.map.setMyLocationEnabled(true);
          

      //});
      const loc = new google.maps.LatLng(this.gmLocation.lat, this.gmLocation.lng);


      if (this.distance <= 0.5) {
		
	  }else if(this.distance <= 0.1){
		  this.tujuan++;
		  
      } else {
        //this.distance = this.getDistanceFromLatLonInKm(this.gmLocation.lat, this.gmLocation.lng, //this.statiun[this.tujuan].Lat, this.statiun[this.tujuan].Long);
        
      }
    }
    );


  }

  addMarker(position) { // To Add Marker
	
	this.map.addMarker({
      animation: 'DROP',
      position: position
    });
  }
  
  pindahMarker(position){
	  this.map.clear();
	  this.addPolyLine()
	  this.map.addMarker({
      animation: 'DROP',
      position: position
    });
  }
  

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }


  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }
  calculateAndDisplayRoute() {
    return this.time;
  }

  loadJson() {
    this.http.get('./assets/data/kereta_api.json').map(res => res.json()).subscribe(data => {
      this.kereta = data.kereta;
    });
  }

  onChange(selectedValue) {
	 this.map.clear();
    this.dariStation(selectedValue);
	this.addPolyLine();
  }

  dariStation(value) {
    for (var i = 0; i < this.kereta.length; i++) {
      if (value == this.kereta[i].nama) {
        this.statiun = this.kereta[i].stasiun;
      }
    }
  }

  mulaiDariStatiun(statiun) {

    for (var i = 0; i < this.statiun.length; i++) {
      if (statiun == this.statiun[i].nama) {
        this.tujuan = i;
        console.log(this.tujuan);
      }
    }
    if (this.tujuan < this.statiun.length) {
      this.tujuan++;
      this.distance = this.getDistanceFromLatLonInKm(this.gmLocation.lat, this.gmLocation.lng, this.statiun[this.tujuan].Lat, this.statiun[this.tujuan].Long);
      this.stasiunTujuan = this.statiun[this.tujuan].nama;
    } else {
      this.stasiunTujuan = "Anda telah di statiun tujuan terakhir"
      this.distance = "0km";
    }
    const stat = new google.maps.LatLng(this.statiun[this.tujuan].Lat, this.statiun[this.tujuan].Long);
    this.addMarker(stat);

  }
  
  addPolyLine(){
    var poly = new Array();
    for (var j=0; j<this.statiun.length;j++){
    var pos={lat: this.statiun[j].Lat,lng: this.statiun[j].Long};
    poly.push(pos);
	}
	this.map.addPolyline({
			points: poly,
            'color' : '#AA00FF',
            'width': 5,
            'geodesic': true
      });

     }
  
}
