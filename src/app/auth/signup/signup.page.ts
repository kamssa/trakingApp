import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Abonnes} from '../../modele/abonnes';
import {AuthService} from '../../service/auth.service';
import {Plugins} from '@capacitor/core';
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
  constructor( private  fb: FormBuilder, private  authService: AuthService) {
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
     console.log(this.latitude);
     console.log(this.longitude);
     console.log('Current', res.coords.latitude);
     this.authService.getConfineByParam(this.latitude, this.longitude).subscribe(result => {
       console.log(result.body);
     });
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
      console.log('creation effectue', res.body);
    });
    console.log(abonnes);
   // console.log(this.signupForm.value);
  }

}
