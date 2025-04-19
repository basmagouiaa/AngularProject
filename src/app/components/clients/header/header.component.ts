import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { CartService } from 'src/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  {
  @ViewChild('menuRef') menuRef!: ElementRef;
  user: any;
  cartItems: any[] = [];

  navLinks = [
    { display: 'Home', url: '/' },
    { display: 'Menu', url: '/menu' },
    { display: 'Reservation', url: '/reservation' },
    { display: 'Mes Reservation', url: '/mes-reservation' },
    { display: 'recipes', url: '/orders' }
  ];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    if (this.user?.id) {
      this.cartService.getCartItems(this.user.id).subscribe({
        next: (res) => this.cartItems = res.cartItems || [],
        error: (err) => console.error("Erreur récupération panier", err)
      });
    }
  }
  

  calculateTotalItems(): number {
    return this.cartItems.length;
  }

  toggleMenu(): void {
    this.menuRef.nativeElement.classList.toggle('active__menu');
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  get cartItemsCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantite, 0);
  }
  
}
