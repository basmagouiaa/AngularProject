import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cart } from 'src/models/cart/cart.module';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5047/api/Cart'; // L'URL de base de ton API

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  // Générer les en-têtes avec le token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Récupérer le panier d'un utilisateur par ID et ses items
  getCartItems(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Ajouter un produit au panier
  addFoodToCart(cartId: number, foodId: number, quantity: number): Observable<void> {
    const url = `${this.apiUrl}/${cartId}/item`;
    return this.http.post<void>(url, { foodId, quantity }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Mettre à jour la quantité d'un élément du panier
  updateCartItemQuantity(cartItemId: number, quantity: number): Observable<void> {
    const url = `${this.apiUrl}/item/${cartItemId}/quantity`;
    return this.http.put<void>(url, quantity, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Supprimer un produit du panier
  removeItemFromCart(cartItemId: number): Observable<void> {
    const url = `${this.apiUrl}/item/${cartItemId}`;
    return this.http.delete<void>(url, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Ajouter un nouveau panier
  addCart(cart: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.apiUrl, cart, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Mettre à jour un panier existant
  updateCart(cart: Cart): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${cart.id}`, cart, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
  clearCart(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }
  

  // Supprimer un panier
  deleteCart(cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cartId}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Gestion des erreurs
  private handleError(error: any) {
    let errorMessage = 'An error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Backend returned code ${error.status}, body was: ${error.error}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  addItemToCart(cartId: number, foodId: number, quantity: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${cartId}/item`, {
      foodId,
      quantity
    }, {
      headers: this.getAuthHeaders()
    });
  }
  getOrCreateCart(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      switchMap(cart => {
        if (cart && cart.id) {
          return of(cart);
        } else {
          return this.http.post<any>(this.apiUrl, { userId }, {
            headers: this.getAuthHeaders()
          });
        }
      })
    );
  }

  getCartByUserId(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  getFoodById(foodId: number): Observable<any> {
    return this.http.get(`http://localhost:5047/api/Food/${foodId}`, { headers: this.getHeaders() });
  }

  deleteCartItem(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/item/${cartItemId}`, { headers: this.getHeaders() });
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(`http://localhost:5047/api/Order`, orderData, { headers: this.getHeaders() });
  }
}
