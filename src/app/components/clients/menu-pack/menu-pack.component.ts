import { Component, OnInit } from '@angular/core';
import { CategorieService } from 'src/services/categorie.service';

@Component({
  selector: 'app-menu-pack',
  templateUrl: './menu-pack.component.html',
  styleUrls: ['./menu-pack.component.css']
})
export class MenuPackComponent  {
  categories: any[] = [];
  selectedCategory: number | null = null;
  products: any[] = [];

  constructor(private categorieService: CategorieService) {}

  ngOnInit(): void {
    this.categorieService.getAll().subscribe({
      next: data => this.categories = data,
      error: err => console.error('Erreur de chargement des catégories :', err)
    });
  }

  selectCategory(categoryId: number): void {
    this.selectedCategory = categoryId;
    this.categorieService.getProductsByCategory(categoryId).subscribe({
      next: data => this.products = data.foods,
      error: err => console.error('Erreur de chargement des produits :', err)
    });
  }
}
