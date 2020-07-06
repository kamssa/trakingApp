import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Abonnes} from '../../modele/abonnes';
import {AuthService} from '../../service/auth.service';
import {Plugins} from '@capacitor/core';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
const { Geolocation } = Plugins;
const { Device } = Plugins;
const { Storage } = Plugins;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  abonnes: Abonnes;
  latitude: number;
  longitude: number;
  uuid: string;
  constructor( private  fb: FormBuilder, private  authService: AuthService ,
               public toastController: ToastController, private  router: Router) {
    this.getUuid();
    this.getCurrentPosition();

  }
   getUuid(){
     Device.getInfo().then(res => {
       this.uuid = res.uuid;
       Storage.set({
         key: 'Uuid',
         value: this.uuid
       });
       console.log(this.uuid);
     });
   }

  ngOnInit() {
    this.initForm();
  }
  initForm(){
    this.signupForm = this.fb.group({
      login: [''],
      identifiantUuid: [''],
      latitude: [''],
      longitude: [''],
      password: [''],
      adresse: this.fb.group({
        ville: ['']
      }),
    });
  }
  getCurrentPosition() {
    Geolocation.getCurrentPosition().then(res => {
     this.latitude = res.coords.latitude;
     this.longitude = res.coords.longitude;

    });

  }
  login(){}
  onSubmit(){
    this.getCurrentPosition();
    const  formValue = this.signupForm.value;
    const abonnes = new Abonnes(
          null,
        null,
        formValue['login'],
        this.uuid,
        this.latitude,
        this.longitude,
        formValue['password'],
        'abonne',
        formValue['adresse']

    );
    this.authService.ajoutAbonnes(abonnes).subscribe(res => {
      this.presentToast('Opération effectuée avec succès');
      console.log('creation effectue', res.body);

    });
   this.router.navigate(['home']);
  }
  async presentToast(texte: string) {
    const toast = await this.toastController.create({
      message: texte,
      duration: 2000
    });
    toast.present();
  }
}
