import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Food } from 'src/models/food/food.module';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiUrl = 'http://localhost:5047/api/Food';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    };
  }

  getAllFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(this.apiUrl, this.getAuthHeaders());
  }

  getFoodById(id: string): Observable<Food> {
    return this.http.get<Food>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  addFood(food: Food): Observable<any> {
    return this.http.post(this.apiUrl, food, this.getAuthHeaders());
  }

  updateFood(id: string, food: Food) {
    return this.http.put(`${this.apiUrl}`, food);
  }
  

  deleteFood(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
