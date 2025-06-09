import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/services/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() item: any;
  constructor(private cartService: CartService, private router: Router) {}


  addToCart(): void {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    if (!user?.id) {
      alert("Please log in to add items to the cart.");
      return;
    }

    this.cartService.getOrCreateCart(user.id).subscribe({
      next: (cart) => {
        this.cartService.addItemToCart(cart.id, this.item.id, 1).subscribe({
          next: () => {alert("Item added to cart successfully!")
            this.router.navigate(['/cart']);
          },
          error: () => alert("Failed to add item to cart.")
        });
      },
      error: (err) => {
        console.error("Cart fetch/create error:", err);
        alert("Could not access or create cart.");
      }
    });
  }
}
