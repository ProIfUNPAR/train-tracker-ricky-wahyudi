import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
<<<<<<< HEAD
//import { NavParams } from 'ionic-angular/navigation/nav-params';
=======
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Geolocation } from '@ionic-native/geolocation'; 
>>>>>>> dd2d5f56182a52855507e02d1ac7af6b045d9326

declare var google: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
<<<<<<< HEAD

  //@ViewChild('map') mapRef: ElementRef;
  Destination: any = '';
  MyLocation: any;

  constructor(public navCtrl: NavController) {

  }

  calculateAndDisplayRoute() {
    let that = this;
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;
    const map = new google.maps.Map(document.getElementById('mymap'), {
      zoom: 7,
      center: { lat: 41.85, lng: -87.65 }
    });
    directionsDisplay.setMap(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        map.setCenter(pos);
        this.MyLocation = new google.maps.LatLong(pos);
      }, function () {
        
      });
    } else {
      // Browser doesn't support Geolocation
    }

    directionsService.route({
      origin: this.MyLocation,
      destination: this.Destination,
      travelMode: 'DRIVING'
    }, function (response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  // ionViewDidLoad() {
  //   this.DisplayMap();
  // }

  // DisplayMap() {
  //   const location = new google.maps.LatLng('-6.917464', '107.619123');

  //   const options = {
  //     center: location,
  //     zoom: 10,
  //     streetViewControl: false
  //   };

  //   const map = new google.maps.Map(this.mapRef.nativeElement, options);

  //   this.addMarker(location, map);
  // }

  // addMarker(position, map) {
  //   return new google.maps.Marker({
  //     position,
  //     map
  //   });
  // }

=======
  resp: any;
  map: any;
  gmLocation: {lat: number, lng: number} = {lat: -6.917464, lng: 107.619123};
  @ViewChild('map') mapRef: ElementRef;
  
	
  constructor(public navCtrl: NavController, public navParams: NavParams,private geoloc: Geolocation) {
	
  }

  ionViewDidLoad() {
    this.onLocateUser();
	//this.DisplayMap();
	
	
  }

  onLocateUser() {
    this.geoloc.getCurrentPosition()
      .then(
        (resp) => {
          console.log('position gotten: long:',resp.coords.longitude,' lat:',resp.coords.latitude);
          this.resp = location;
          this.gmLocation.lat = resp.coords.latitude;
          this.gmLocation.lng = resp.coords.longitude;
		  const options = {center: this.gmLocation,zoom: 15,streetViewControl: false};
			this.map = new google.maps.Map(this.mapRef.nativeElement, options);
			const loc = new google.maps.LatLng(this.gmLocation.lat, this.gmLocation.lng);
			this.addMarker(loc,this.map);
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
>>>>>>> dd2d5f56182a52855507e02d1ac7af6b045d9326
}
