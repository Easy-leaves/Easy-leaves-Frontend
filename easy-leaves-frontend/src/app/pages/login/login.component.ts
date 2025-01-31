import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LoginService } from '../../services/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private loginService: LoginService, private router: Router) { }

  isEmailEmpty: boolean = false; // Vérifie si le champ email est vide
  isPasswordEmpty: boolean = false; // Vérifie si le champ mot de passe est vide
  isConnectionError: boolean = false; // Indique si une erreur de connexion s'est produite

  /**
   * Méthode permettant de se connecter avec l'email et le mot de passe.
   * @param valueEmail L'email saisi par l'utilisateur.
   * @param valuePassword Le mot de passe saisi par l'utilisateur.
   */
  connect(valueEmail: string, valuePassword: string) {
    localStorage.clear();
    sessionStorage.clear();
    // Vérifie si les champs email et mot de passe sont vides
    this.isPasswordEmpty = valuePassword.trim() === '';
    this.isEmailEmpty = valueEmail.trim() === '';

    if (this.isPasswordEmpty || this.isEmailEmpty) {
      return; // Arrête l'exécution si un champ est vide
    }

    const loginData = {
      email: valueEmail,
      password: valuePassword
    };

    this.loginService.seConnecter(loginData).subscribe({
      next: (response) => {
        // Vérifie si un token est renvoyé par le backend
        if (response.token) {
          // Décodage du JWT pour extraire l'ID utilisateur
          const tokenPayload = JSON.parse(atob(response.token.split('.')[1])); // La payload est le deuxième segment du token
          const userId = tokenPayload.id; // Supposons que l'ID utilisateur est stocké sous la clé 'id'

          // Stocke l'ID utilisateur et le token dans le localStorage
          localStorage.setItem('idUser', userId);
          localStorage.setItem('token', response.token);

          // Redirige vers l'URL précédente ou la page d'accueil
          const redirectUrl = sessionStorage.getItem('previousUrl') || '/';
          sessionStorage.removeItem('previousUrl');
          this.router.navigate([redirectUrl]);
        }
      },
      error: (err) => {
        // Affiche une erreur si les identifiants sont incorrects
        if (err.status === 403) {
          console.error("Invalid email or password");
          this.isConnectionError = true; // Active le message d'erreur en cas d'identifiants invalides
        } else {
          console.error("Une erreur inattendue s'est produite:", err);
        }
      }
    });

  }
}
