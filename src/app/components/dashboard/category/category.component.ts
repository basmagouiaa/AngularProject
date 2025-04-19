import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CategorieService } from 'src/services/categorie.service';
import { CategorieDialogDataComponent } from './categorie-dialog-data/categorie-dialog-data.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Category>();
  searchValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoryService: CategorieService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.dataSource.data = categories;
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch(): void {
    this.searchValue = '';
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(category?: Category): void {
    const dialogRef = this.dialog.open(CategorieDialogDataComponent, {
      width: '400px',
      data: category ? { ...category } : null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
        if (result.id) {
          // Update
          this.categoryService.update(result).subscribe({
            next: () => this.loadCategories(),
            error: (err) => console.error('Erreur lors de la mise à jour:', err)
          });
        } else {
          // Create
          result.id=5;
          this.categoryService.create(result).subscribe({
            next: () => this.loadCategories(),
            error: (err) => console.error('Erreur lors de la création:', err)
          });
        }
      }
    });
  }
  

  deleteCategory(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: 'Êtes-vous sûr de vouloir supprimer cette catégorie?',
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.categoryService.delete(id).subscribe({
          next: () => this.loadCategories(),
          error: (err) => console.error('Error deleting category:', err)
        });
      }
    });
  }
}