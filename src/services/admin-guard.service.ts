import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Assurez-vous d'importer votre service d'authentification

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Vérifiez si l'utilisateur est authentifié et a le rôle d'administrateur
    if (this.authService.isAuthenticated() && this.authService.getUserRole() === 'Admin') {
      return true; // Autoriser l'accès à la route
    } else {
      this.router.navigate(['/login']); // Rediriger vers la page de connexion
      return false; // Bloquer l'accès à la route
    }
  }
}