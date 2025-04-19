import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // recuperer user depuis le local storage
    const user = localStorage.getItem('user');
    if (user && JSON.parse(user).role !== 'Admin') {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas admin
      this.router.navigate(['/']); 
      
    }
  }
  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

 

}
