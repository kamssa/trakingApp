import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Abonnes} from '../modele/abonnes';
import {Plugins} from '@capacitor/core';
import {AuthService} from '../service/auth.service';
import {Confines} from '../modele/confines';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';

const {Geolocation} = Plugins;
const {Device} = Plugins;
const {Storage} = Plugins;
declare var google;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    // Map related
    @ViewChild('map') mapElement: ElementRef;
    map: any;
    markers = [];


    isTracking = false;
    watch: string;
    user = Abonnes;
    abonne: Abonnes;
    allConfines = [];
    uuid: string;
    latitude: number;
    longitude: number;
    interval : any;

    constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore,
                private  authService: AuthService,
                public toastController: ToastController, private  router: Router) {
        //  this.getUuid();
        //  this.getAbonneByUuid();

    }

    ionViewWillEnter() {
        // this.loadMap();
        //   this.startTracking();
         this.updatePosition();


    }

    ngOnInit() {

    }

    // recuperer un abonne à partir de son uuid;
    startTracking() {
        this.isTracking = true;
        // console.log('verifier', this.uuid);
        Storage.get({key: 'Uuid'}).then(result => {
            this.uuid = result.value;
            if (this.uuid === null || this.uuid === undefined) {
                console.log('UUid non disponible');
            } else {
                this.markers = [];
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
                        position: latLng,
                        title: 'Je suis ici',
                        icon: 'assets/image/icon.png'
                    });
                    this.markers.push(marker);
                    this.authService.getConfineByParam(this.latitude, this.longitude)
                        .subscribe(data => {
                            let confineProche = data.body;
                            console.log('confine proche', confineProche);
                            for (let conf of confineProche) {
                                let latLng = new google.maps.LatLng(conf.latitude, conf.longitude);

                                let marker = new google.maps.Marker({
                                    map: this.map,
                                    animation: google.maps.Animation.DROP,
                                    position: latLng,

                                });
                                this.markers.push(marker);
                            }

                        });
                });

            }

        });
    //this.updatePosition();
    }

    stopTracking() {

        this.isTracking = false;

    }

    //mettre à jour la position d'un abonné
    updatePosition() {
        Storage.get({key: 'Uuid'}).then(result => {
            this.uuid = result.value;
            if (this.uuid === null || this.uuid === undefined) {
                console.log('UUid non disponible');
            } else {
                Geolocation.getCurrentPosition().then(res => {
                    this.latitude = res.coords.latitude;
                    this.longitude = res.coords.longitude;

                    this.interval = setInterval(() => {
                        this.authService.getAbonnesByUUid(this.uuid).subscribe(data => {
                            const abonnes = new Abonnes(
                                data.body.id,
                                data.body.version,
                                data.body.login,
                                data.body.identifiantUuid,
                                this.latitude,
                                this.longitude,
                                data.body.password,
                                data.body.type,
                                data.body.adresse,
                            );
                            if (this.latitude !== data.body.latitude || this.longitude !== data.body.longitude){
                                this.presentToastWithOptions();
                                this.authService.modifierAbonnes(abonnes).subscribe(resultat => {
                                    console.log('mise à jour effectue', resultat.body );

                                });
                            }else {
                                console.log('aucune position à mettre à jour !');

                            }

                        });
                    }, 1000);
                });

            }

        });


    }
    async presentToastWithOptions() {
        const toast = await this.toastController.create({
            header: '',
            message: 'Votre position à été modifiée',
            position: 'bottom',
            buttons: [
                    {
                    text: 'Fermé',
                    role: 'cancel',
                    handler: () => {
                       this.router.navigate(['home']) ;
                    }
                }
            ]
        });
        toast.present();
    }
}
