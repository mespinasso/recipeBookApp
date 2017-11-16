
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { IonicPage, NavParams, ActionSheetController, AlertController, ToastController, NavController } from 'ionic-angular';

import { RecipesService } from './../../services/recipes';
import { Recipe } from '../../models/recipe';

@IonicPage()
@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit {
  mode = 'New';
  selectOptions = ['Easy', 'Medium', 'Hard'];
  recipe: Recipe;
  index: number;

  // Reactive form
  recipeForm: FormGroup;

  constructor(  public navParams: NavParams, 
                private actionSheetController: ActionSheetController, 
                private alertController: AlertController,
                private toastController: ToastController,
                private recipesService: RecipesService,
                private navController: NavController) {}

  ngOnInit() {
    this.mode = this.navParams.get('mode');

    if (this.mode == 'Edit') {
      this.recipe = this.navParams.get('recipe');
      this.index = this.navParams.get('index');
    }

    this.initializeForm();
  }

  onSubmit() {
    const value = this.recipeForm.value;
    
    let ingredients = [];

    if(value.ingredients.length > 0) {
      ingredients = value.ingredients.map(name => {
        return {name: name, amount: 1};
      });
    }

    if (this.mode == 'Edit') {
      this.recipesService.updateRecipe(this.index, value.title, value.description, value.difficulty, ingredients);
    } else {
      this.recipesService.addRecipe(value.title, value.description, value.difficulty, ingredients);
    }

    this.recipeForm.reset();
    this.navController.popToRoot();
  }

  onManageIngredients() {
    const actionSheet = this.actionSheetController.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Add Ingredient',
          handler: () => {
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: 'Remove all Ingredients',
          role: 'destructive',
          handler: () => {
            const formArray: FormArray = <FormArray>this.recipeForm.get('ingredients');
            const len = formArray.length;

            if (len > 0) {
              for(let i = len -1; i>= 0; i--) {
                formArray.removeAt(i);
              }

              const toast = this.toastController.create({
                message: 'Items removed',
                duration: 3000,
                position: 'bottom'
              });
  
              toast.present();
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  private createNewIngredientAlert() {
    return this.alertController.create({
      title: 'Add Ingredient',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: data => {
            if (data.name == null || data.name.trim() == '') {
              const toast = this.toastController.create({
                message: 'Please enter a valid value',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
              return;
            }

            (<FormArray>this.recipeForm.get('ingredients'))
              .push(new FormControl(data.name, Validators.required));

            const toast = this.toastController.create({
              message: 'Item added',
              duration: 3000,
              position: 'bottom'
            });

            toast.present();
          }
        }
      ]
    });
  }

  private initializeForm() {
    let title = null;
    let description = null;
    let difficulty = 'Medium';
    let ingredients = [];

    if (this.mode == 'Edit') {
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      
      for (let ingredient of this.recipe.ingredients) {
        ingredients.push(new FormControl(ingredient.name, Validators.required));
      }
    }

    this.recipeForm = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'description': new FormControl(description, Validators.required),
      'difficulty': new FormControl(difficulty, Validators.required),
      'ingredients': new FormArray(ingredients)
    });
  }
}
