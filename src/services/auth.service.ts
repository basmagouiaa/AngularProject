import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5047/api/Account'; 
  private registerUrl = 'http://localhost:5047/api/Account/Register';
  private tokenKey = 'authToken';
  // BehaviorSubject est idéal pour : ✅ Partager un état global (thème, utilisateur connecté, préférences...)
  // ✅ Synchroniser des données entre plusieurs composants
  // ✅ Maintenir une valeur même après un rechargement de composant
  //howa ykhalli el el valeur hedhi tdour 3al les composant w ki tetbadel kol ywalli fibelhom
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  register(user: { email: string, password: string, nom: string, prenom: string }): Observable<any> {
    return this.http.post(this.registerUrl, user);
  }
  
  login(email: string, password: string): Observable <boolean> {
    // pipe Utilisé pour traiter la réponse en appliquant des transformations(map) au lieu de await.
    return this.http.post<{ token: string, user: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
          console.log(response);
          this.authStatus.next(true);
          return true;
        }
        return false;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
// La méthode .next(valeur) permet d'émettre une nouvelle valeur dans un BehaviorSubject, ce qui : ✅ Met à jour la valeur actuelle stockée.
// ✅ Informe tous les abonnés qu'une nouvelle valeur est disponible.
    this.authStatus.next(false);
  }

  isAuthenticated(): boolean {
    // Le double !! est utilisé pour convertir la valeur récupérée en un booléen 
    return !!localStorage.getItem(this.tokenKey);
  }

// authStatus est un BehaviorSubject qui stocke l’état d’authentification (true ou false).
// Problème : Si on expose authStatus directement, n'importe quel composant pourrait appeler .next(), ce qui modifierait l’état sans contrôle.
// Solution : On utilise asObservable() pour exposer un Observable en lecture seule.

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUserRole(): string {
    // Implémentez votre logique pour récupérer le rôle de l'utilisateur
    return JSON.parse(localStorage.getItem('user') || '{}').role; // Exemple simple avec un rôle stocké
  }
}