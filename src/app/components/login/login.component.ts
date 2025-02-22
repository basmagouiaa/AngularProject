import { Component } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      success => {
        if (success) {
          this.router.navigate(['/dashboard']); // Redirige après connexion
        } else {
          this.errorMessage = "Échec de la connexion.";
        }
      },
      error => {
        this.errorMessage = "Email ou mot de passe incorrect.";
      }
    );
  }
}
