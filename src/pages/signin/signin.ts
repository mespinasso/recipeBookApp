import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, LoadingController, AlertController } from 'ionic-angular';

import { AuthService } from './../../services/auth';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  onSignin(form: NgForm) {
    const loading = this.loadingCtrl.create({
      content: 'Signing in...'
    });

    loading.present();

    this.authService.signin(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Signin failed!',
          message: error.message,
          buttons: ["Ok"]
        });
        alert.present();
      });
  }
}
