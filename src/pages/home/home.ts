import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

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
  markers: any = [];
  train: { lat: number, lng: number } = { lat: -6.9126, lng: 107.6023 };
  distance: any="Pilih Argo dan Statiun";
  time: any="Pilih Argo dan Statiun";
  kecepatan:any="Pilih Argo dan Statiun";
  kereta = [];
  statiun=[];
  tujuan=0;
  stasiunTujuan:any="Pilih Argo dan Statiun";
  


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
    this.geoloc.watchPosition().subscribe((resp)=>{
        console.log('position gotten: long:', resp.coords.longitude, ' lat:', resp.coords.latitude);
        this.resp = location;
        this.gmLocation.lat = resp.coords.latitude;
        this.gmLocation.lng = resp.coords.longitude;
        const options = { center: this.gmLocation, zoom: 12, streetViewControl: false };
        this.map = new google.maps.Map(this.mapRef.nativeElement, options);
        const loc = new google.maps.LatLng(this.gmLocation.lat, this.gmLocation.lng);
        this.addMarker(loc, this.map);
        
        
        if(this.tujuan==0){
		
		}else{
			this.distance=this.getDistanceFromLatLonInKm(this.gmLocation.lat,this.gmLocation.lng,this.statiun[this.tujuan].Lat,this.statiun[this.tujuan].Long);
			const stat = new google.maps.LatLng(this.statiun[this.tujuan].Lat, this.statiun[this.tujuan].Long);
			this.addMarker(stat, this.map);
		}
      }
      );
      

  }

  addMarker(position, map) { // To Add Marker
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: position
    });
    let content = "<h3>Nearest train station</h3>";
    this.addInfoWindow(marker, content);
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
  
  onChange(selectedValue){
	    this.dariStation(selectedValue);
}

 dariStation(value){
	
	for(var i=0;i<this.kereta.length;i++){
		if(value==this.kereta[i].nama){
			console.log(this.kereta[i].stasiun);
			this.statiun=this.kereta[i].stasiun;
		}
	}
	
	console.log(this.statiun);
 }
 mulaiDariStatiun(statiun){
	 
	 for(var i=0;i<this.statiun.length;i++){
		if(statiun==this.statiun[i].nama){
			this.tujuan=i;
			console.log(this.tujuan);
		}
	}
	if(this.tujuan<this.statiun.length){
		this.tujuan++;
		this.distance=this.getDistanceFromLatLonInKm(this.gmLocation.lat,this.gmLocation.lng,this.statiun[this.tujuan].Lat,this.statiun[this.tujuan].Long);
		this.stasiunTujuan=this.statiun[this.tujuan].nama;
	}else{
		this.stasiunTujuan="Anda telah di statiun tujuan terakhir"
		this.distance="0km";
	}
	console.log(this.statiun[this.tujuan].Lat);
	console.log(this.statiun[this.tujuan].Long);
	this.addMarker(this.statiun[this.tujuan].Lat,this.statiun[this.tujuan].Long);
	const stat = new google.maps.LatLng(this.statiun[this.tujuan].Lat, this.statiun[this.tujuan].Long);
	this.addMarker(stat, this.map);
	
 }
}
