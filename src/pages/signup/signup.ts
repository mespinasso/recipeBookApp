import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, LoadingController, AlertController } from 'ionic-angular';

import { AuthService } from './../../services/auth';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  constructor(
    private authService: AuthService, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  onSignup(form: NgForm) {
    const loading = this.loadingCtrl.create({
      content: 'Signing up...'
    });

    loading.present();

    this.authService.signup(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Sign-up failed!',
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }
}
