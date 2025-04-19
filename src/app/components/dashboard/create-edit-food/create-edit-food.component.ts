import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategorieService } from 'src/services/categorie.service';
import { FoodService } from 'src/services/food.service';
import { Food } from 'src/models/food/food.module';

@Component({
  selector: 'app-create-edit-food',
  templateUrl: './create-edit-food.component.html',
  styleUrls: ['./create-edit-food.component.css']
})
export class CreateEditFoodComponent implements OnInit {
  foodForm: FormGroup;
  categories: any[] = [];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategorieService,
    private foodService: FoodService,
    public dialogRef: MatDialogRef<CreateEditFoodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Food | null
  ) {
    this.foodForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      imageUrl: ['', Validators.required],
      categorieId: ['', Validators.required]
    });

    if (data) {
      this.isEditMode = true;
      this.foodForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => {
        console.error('Erreur de chargement des catégories:', err);
        alert('Impossible de charger les catégories.');
      }
    });
  }

  onSubmit(): void {
    if (this.foodForm.valid) {
      const food: Food = this.foodForm.value;

      if (this.isEditMode) {
        this.foodService.updateFood(food.id!, food).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Erreur de mise à jour:', err)
        });
      } else {
        delete food.id;
        this.foodService.addFood(food).subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Erreur d\'ajout:', err)
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
