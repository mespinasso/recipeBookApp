import { Component } from '@angular/core';
import { IonicPage, NavController, PopoverController, LoadingController, AlertController } from 'ionic-angular';

import { AuthService } from './../../services/auth';
import { RecipesService } from './../../services/recipes';
import { DatabaseOptionsPage } from './../database-options/database-options';
import { EditRecipePage } from './../edit-recipe/edit-recipe';
import { Recipe } from './../../models/recipe';
import { RecipePage } from '../recipe/recipe';

@IonicPage()
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {
  recipes: Recipe[];

  constructor(
    private navCtrl: NavController, 
    private recipesService: RecipesService, 
    private popoverCtrl: PopoverController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ionViewWillEnter() {
    this.recipes = this.recipesService.getRecipes();
  }

  onNewRecipe() {
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  onLoadRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push(RecipePage, {recipe: recipe, index: index})
  }

  onShowOptions(event: MouseEvent) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    const popover = this.popoverCtrl.create(DatabaseOptionsPage);
    popover.present({ev: event});

    popover.onDidDismiss(data => {

      if (!data) {
        return;
      }

      if (data.action == 'load') {

        loading.present();

        this.authService.getActiveUser().getToken().then(
          (token: string) => {
            this.recipesService.fetchList(token).subscribe((list: Recipe[]) => {
              if (list) {
                this.recipes = list;
              } else {
                this.recipes = [];
              }
            }, error => {
              console.log(error);
              this.handleError(error.json().error);
            });
          }
        );

        loading.dismiss();

      } else if (data.action == 'store') {

        loading.present();
        
        this.authService.getActiveUser().getToken().then(
          (token: string) => {
            this.recipesService.storeList(token).subscribe(() => {
              console.log('Success!');
            }, error => {
              console.log(error);
              this.handleError(error.json().error);
            });
          }
        );

        loading.dismiss();

      }
    });
  }

  private handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: 'An error occurred!',
      message: errorMessage,
      buttons: ['Ok']
    });

    alert.present();
  }
}
