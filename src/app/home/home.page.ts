import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Abonnes} from '../modele/abonnes';
import {Plugins} from '@capacitor/core';
import {AuthService} from '../service/auth.service';

const { Geolocation } = Plugins;
const { Device } = Plugins;
const { Storage } = Plugins;
declare var google;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements  OnInit{
    // Map related
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    markers = [];

    // Misc
    isTracking = false;
    watch: string;
    user = Abonnes;
    uuid: string;
    latitude: number;
    longitude: number;
    constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private  authService: AuthService) {
      //  this.getUuid();
      //  this.getAbonneByUuid();
    }

    ionViewWillEnter() {
        // this.loadMap();
        this.getAbonneByUuid();

    }
    ngOnInit() {

    }

    /*getUuid() {
        Device.getInfo().then(res => {
            this.uuid = res.uuid;
            console.log(this.uuid);
        });
    }*/
   // recuperer un abonne à partir de son uuid;
    getAbonneByUuid(){
       // console.log('verifier', this.uuid);
        Storage.get({ key: 'Uuid' }).then(result => {
            this.uuid = result.value;
            if (this.uuid == null || this.uuid == undefined){
            console.log('UUid non disponible');
            }else {
                this.authService.getAbonnesByUUid(this.uuid).subscribe(res => {
                    this.latitude = res.body.latitude;
                    this.longitude = res.body.longitude;
                    console.log('abonne retourné', res.body);
                    let latLng = new google.maps.LatLng(this.latitude, this.longitude);
                    let mapOptions = {
                        center: latLng,
                        zoom: 5,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

                    let marker = new google.maps.Marker({
                        map: this.map,
                        animation: google.maps.Animation.DROP,
                        position: latLng
                    });
                    this.markers.push(marker);
                });

            }

        });

    }

    // Initialize a blank map
 /*   loadMap() {
        let latLng = new google.maps.LatLng(this.latitude, this.longitude);
        let mapOptions = {
            center: latLng,
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        let marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });
        this.markers.push(marker);
    }
*/

    startTracking() {
      //  this.getAbonneByUuid();
     //   console.log('verifier', this.uuid);
       /* Device.getInfo().then(res => {
            this.uuid = res.uuid;

            console.log(this.uuid);
        });
        if(this.uuid != null){
            this.authService.getAbonnesByUUid(this.uuid).subscribe(res => {
                this.latitude = res.body.latitude;
                this.longitude = res.body.longitude;
                console.log('abonne retourné', res.body);
            });
        }

        if(this.latitude != null &&  this.longitude!= null){
            this.loadMap();
        }
*/
    }

// Save a new location to Firebase and center the map

    stopTracking() {

    }

    deleteLocation(pos: any) {

    }

    // Redraw all markers on the map
    updateMap(locations) {
        // Remove all current marker
        this.markers.map(marker => marker.setMap(null));
        this.markers = [];

        for (let loc of locations) {
            let latLng = new google.maps.LatLng(loc.lat, loc.lng);

            let marker = new google.maps.Marker({
                map: this.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });
            this.markers.push(marker);
        }
    }
}
