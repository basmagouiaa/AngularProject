import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Food } from "src/models/food/food.module";
import { Order } from "src/models/order/order.module";
import { User } from "src/models/user/user.module";

// order.service.ts
@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = 'http://localhost:5047/api';

  constructor(private http: HttpClient) {}

  getOrders(token: string) {
    return this.http.get<any[]>(`${this.baseUrl}/Order`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deliverOrder(id: number, token: string) {
    return this.http.put(`${this.baseUrl}/Order/${id}/deliver`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getUser(userId: string, token: string) {
    return this.http.get<User>(`${this.baseUrl}/Account/GetUserById/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getFood(itemId: string, token: string) {
    return this.http.get<Food>(`${this.baseUrl}/Food/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getOrdersByUserId(userId: string) {
    return this.http.get<any[]>(`${this.baseUrl}/Order/user/${userId}`);
  }
  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/Order/${orderId}`);
  }
}
