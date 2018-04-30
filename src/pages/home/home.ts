import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { LocalNotifications } from '@ionic-native/local-notifications';
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
  distances: any = "Pilih Argo dan Statiun";
  time: any = "Pilih Argo dan Statiun";
  kecepatan: any = "Pilih Argo dan Statiun";
  kereta = [];
  statiun = [];
  tujuan = 0;
  stasiunTujuan: any = "Pilih Argo dan Statiun";
  cimage:any;
  speed:any=48;
  posisilat:any=[];
  posisilong:any=[];
  timestamp:any=[];
  counter=0;
  ETA:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private geoloc: Geolocation, public http: Http ,private localNoti: LocalNotifications, private platform: Platform) {
    this.loadJson();
	

  }

  ionViewDidLoad() {
	this.onLocateUser();
    //this.DisplayMap();
    this.kereta;
    this.statiun;
    this.distance;
	this.distances;
    this.time;
    this.kecepatan;
    this.stasiunTujuan;
	this.speed;
	this.counter;
	this.getETA;
  }
  

  onLocateUser() {
    this.geoloc.watchPosition().subscribe((resp) => {
      this.timestamp.push(new Date());
	  console.log('position gotten: long:', resp.coords.longitude, ' lat:', resp.coords.latitude);
      this.resp = location;
      this.gmLocation.lat = resp.coords.latitude;
	  this.posisilat.push(this.gmLocation.lat);
      this.gmLocation.lng = resp.coords.longitude;
	  this.posisilong.push(this.gmLocation.lng);
	  
	  console.log(this.gmLocation.lat);
	  console.log(this.gmLocation.lng);
	  
	  if(this.counter>0){
		  var jarak=this.getDistanceFromLatLonInKm(this.posisilat[this.counter-1], this.posisilong[this.counter-1], this.posisilat[this.counter], this.posisilong[this.counter]);
		  var diff=(this.timestamp[this.counter]-this.timestamp[this.counter-1])/1000;
		  console.log("waktu : "+diff);
		  console.log("jarak : "+jarak );
		  this.speed=jarak*3600/(diff);
		  
	  }
	  this.counter++;
	  let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.gmLocation.lat,
          lng: this.gmLocation.lng
        },
        zoom: 9,
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
	  this.distance = this.getDistanceFromLatLonInKm(this.gmLocation.lat, this.gmLocation.lng, this.statiun[this.tujuan].Lat, this.statiun[this.tujuan].Long);
	  this.distances=this.getDistanceFromLatLonInKm(this.gmLocation.lat, this.gmLocation.lng, this.statiun[this.tujuan].Lat, this.statiun[this.tujuan].Long);
			for (var z = this.tujuan; z < this.statiun.length-2; z++) {
			this.distances=this.distances+this.getDistanceFromLatLonInKm(this.statiun[z].Lat, this.statiun[z].Long,this.statiun[z+1].Lat, this.statiun[z+1].Long);
		}
		if(this.speed<38){
			  this.ETA=this.distances/38;
		  }else{
			  this.ETA=this.distances/this.speed;
		  }
	  if(this.distance<0.1){
			if (this.tujuan < this.statiun.length-1) {
			this.tujuan++;
			
			this.stasiunTujuan = this.statiun[this.tujuan].nama;
			} else {
			this.stasiunTujuan = "Anda telah di statiun tujuan terakhir"
			this.distance = "0km";
			this.distances="0km";
		}
	  }
	  else{
		  
<<<<<<< HEAD
      } else {
        //this.distance = this.getDistanceFromLatLonInKm(this.gmLocation.lat, this.gmLocation.lng, //this.statiun[this.tujuan].Lat, this.statiun[this.tujuan].Long);
        
      }
    }
=======
		  
			}
		}
	
	   
     
    
>>>>>>> e399664c5ea795e900fcb1d3673207f43404c520
    );


  }
  
  
  

  addMarker(position) { // To Add Marker
	this.map.clear();
	this.addPolyLine();
	var marker = this.map.addMarker({
          position: position,
          map: this.map
        });
  }
  
  getETA(){
	  var nilai=this.ETA;
	  var minutes=this.ETA-(this.ETA%1);
	  minutes=minutes*60-(minutes%1);
	  return nilai+" jam "+minutes+" menit ";
	  
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
  
  loadJson() {
    this.http.get('./assets/data/kereta_api.json').map(res => res.json()).subscribe(data => {
      this.kereta = data.kereta;
    });
  }

  onChange(selectedValue) {
	this.map.clear();
    this.dariStation(selectedValue);
	this.addPolyLine();
	this.alarm();
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
    if (this.tujuan < this.statiun.length-1) {
      this.tujuan++;
      //this.distance = this.getDistanceFromLatLonInKm(this.gmLocation.lat, this.gmLocation.lng, this.statiun[this.tujuan].Lat, this.statiun[this.tujuan].Long);
      this.stasiunTujuan = this.statiun[this.tujuan].nama;
	  //this.distances=this.getDistanceFromLatLonInKm(this.gmLocation.lat, this.gmLocation.lng, this.statiun[this.tujuan].Lat, this.statiun[this.tujuan].Long);
	  //for (var z = this.tujuan; z < this.statiun.length-2; z++) {
      //this.distances=this.distances+this.getDistanceFromLatLonInKm(this.statiun[z].Lat, this.statiun[z].Long,this.statiun[z+1].Lat, this.statiun[z+1].Long);
     //}
    } else {
      this.stasiunTujuan = "Anda telah di statiun tujuan terakhir"
      this.distance = "0km";
	  this.distances="0km";
    }
    const stat = new google.maps.LatLng(this.statiun[this.tujuan].Lat, this.statiun[this.tujuan].Long);
    this.addMarker(stat);
	this.onLocateUser();
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
	 
  alarm() {
    this.platform.ready().then(() => {
      this.localNoti.schedule({
        id: 1,
        title: 'Coba',
        text: 'YESSS',
        trigger: { at: new Date(new Date().getTime() + 100) }
      });
    });
  }
  
}
