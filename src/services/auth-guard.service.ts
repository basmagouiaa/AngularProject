import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    const userRole = this.authService.getUserRole(); // Obtenez le rôle de l'utilisateur

    if (userRole === 'Admin') {
      this.router.navigate(['/dashboard']); // Redirigez l'admin vers /dashboard
      return true;
    } else if (userRole === 'Client') {
      this.router.navigate(['/']); // Redirigez le client vers /home
      return true;
    } else {
      this.router.navigate(['/login']); // Redirigez les autres utilisateurs vers /login
      return false;
    }
    return true;
  }
}
