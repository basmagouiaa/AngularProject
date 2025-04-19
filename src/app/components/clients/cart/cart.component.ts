import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/services/cart.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent  {
  cartItems: any[] = [];
  userId: string | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem("user") || 'null');
    if (user) {
      this.userId = user.id;
      this.loadCartItems();
    }
  }

  loadCartItems(): void {
    if (!this.userId) return;

    this.cartService.getCartByUserId(this.userId).subscribe(async cart => {
      const items = cart.cartItems || [];
      const itemDetails = await Promise.all(
        items.map(async (item: any) => {
          const food = await this.cartService.getFoodById(item.itemId).toPromise();
          return {
            ...item,
            ...food,
            cartItemId: item.id
          };
        })
      );
      this.cartItems = itemDetails;
    });
  }

  deleteItem(cartItemId: number): void {
    this.cartService.deleteCartItem(cartItemId).subscribe(() => {
      this.cartItems = this.cartItems.filter(item => item.cartItemId !== cartItemId);
    });
  }

  updateQuantity(cartItemId: number, quantity: number): void {
    if (quantity < 0) return;
    this.cartService.updateCartItemQuantity(cartItemId, quantity).subscribe(() => {
      this.cartItems = this.cartItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantite: quantity } : item
      );
    });
  }

  handleQuantityChange(cartItemId: number, value: number): void {
    this.cartItems = this.cartItems.map(item =>
      item.cartItemId === cartItemId ? { ...item, quantite: value } : item
    );
  }

  calculateTotal(): string {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.quantite, 0).toFixed(2);
  }

  placeOrder(): void {
    if (this.cartItems.length === 0) {
      alert("Votre panier est vide.");
      return;
    }
  
    const order = {
      id: 0,
      userId: this.userId,
      dateCreation: new Date().toISOString(),
      paymentMethod: 1,
      orderItems: this.cartItems.map(item => ({
        id: 0,
        orderId: 0,
        itemId: item.itemId,
        quantite: item.quantite,
        prixUnitaire: item.price,
        dateAjout: new Date().toISOString()
      }))
    };
  
    this.cartService.createOrder(order).subscribe(() => {
      // Supprimer chaque item du panier un par un
      const deleteObservables = this.cartItems.map(item =>
        this.cartService.deleteCartItem(item.cartItemId)
      );
  
      // Attendre que tous les items soient supprimés
      Promise.all(deleteObservables.map(obs => obs.toPromise()))
        .then(() => {
          alert("Commande réussie !");
          this.cartItems = [];
        })
        .catch(() => {
          alert("Commande passée, mais une erreur est survenue lors de la suppression du panier.");
        });
  
    }, () => {
      alert("Erreur lors de la commande.");
    });
  }
  
  
}
