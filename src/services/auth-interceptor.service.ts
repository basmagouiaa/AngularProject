import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('authToken'); // Récupère le token d'authentification

    if (token) {
      // Si le token existe, on clone la requête et on y ajoute un en-tête Authorization
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Ajoute l'en-tête 'Authorization' avec le token
        }
      });
      return next.handle(cloned); // Envoie la requête clonée avec l'en-tête Authorization
    }

    return next.handle(req); // Si pas de token, on continue avec la requête sans modification
  }
}
