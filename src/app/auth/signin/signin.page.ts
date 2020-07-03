import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Adresse} from '../../modele/adresse';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  connexionForm: FormGroup;
  constructor( private  fb: FormBuilder, private authService: AuthService) {

  }

  ngOnInit() {
    this.initForm();

  }
  initForm(){
    this.connexionForm = this.fb.group({
      login: [''],
      identifiantUuid: [''],
      latitude: [],
      longitude: [],
      password: [''],
      adresse: ['']
    });
  }
  login(){}
  onSubmit(){

    console.log(this.connexionForm.value);
  }
}
