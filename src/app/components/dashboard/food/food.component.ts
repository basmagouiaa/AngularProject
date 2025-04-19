import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FoodService } from 'src/services/food.service';
import { Food } from 'src/models/food/food.module';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditFoodComponent } from '../create-edit-food/create-edit-food.component'; // adapte le chemin selon ton projet


@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {

  displayedColumns: string[] = ['image', 'name', 'price', 'actions'];
  dataSource = new MatTableDataSource<Food>([]);
  searchTerm: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private foodService: FoodService,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadFoods();
  }
  openFoodDialog(food?: Food): void {
    const dialogRef = this.dialog.open(CreateEditFoodComponent, {
      width: '400px',
      data: food ? { ...food } : null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadFoods();
      }
    });
  }

  loadFoods() {
    this.foodService.getAllFoods().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  deleteFood(id: string) {
    this.foodService.deleteFood(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(f => f.id !== id);
    });
  }
}
