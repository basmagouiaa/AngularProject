import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service'; // Assurez-vous de créer ce service

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
    });
  }

  // Fonction pour soumettre le formulaire
  onSubmit(): void {
    console.log(this.registerForm.value);
    if (this.registerForm.invalid) {
      return;
    }

    const { email, password, nom, prenom } = this.registerForm.value;

    this.authService.register({ email, password, nom, prenom }).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/login']);
      },
      (error) => {
        if (error.status === 200) 
          this.router.navigate(['/login']);
        console.error('Erreur d\'inscription', error);
        this.errorMessage = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
      }
    );
  }

  // Récupérer les erreurs de chaque champ
  get formControls() {
    return this.registerForm.controls;
  }
}
