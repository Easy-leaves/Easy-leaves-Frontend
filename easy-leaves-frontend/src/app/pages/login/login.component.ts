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

  isEmailEmpty: boolean = false;
  isPasswordEmpty: boolean = false;
  isConnectionError: boolean = false;

  // Method to log in
  connect(valueEmail: string, valuePassword: string) {
    this.isPasswordEmpty = valuePassword.trim() === '';
    this.isEmailEmpty = valueEmail.trim() === '';

    if (this.isPasswordEmpty || this.isEmailEmpty) {
      return;
    }

    const loginData = {
      email: valueEmail,
      password: valuePassword
    };

    this.loginService.seConnecter(loginData).subscribe({
      next: (response) => {
        // console.log("Result connection : ", response);
        if (response.token) {
          // Décoder le payload du JWT pour extraire l'ID utilisateur
          const tokenPayload = JSON.parse(atob(response.token.split('.')[1])); // La payload est le deuxième segment du token
          const userId = tokenPayload.id; // Supposons que l'ID utilisateur est stocké sous la clé 'id'
          localStorage.setItem('idUser', userId);
          localStorage.setItem('token', response.token);
  
          // Décoder le payload du JWT pour extraire l'ID utilisateur
          const tokenPayload = JSON.parse(atob(response.token.split('.')[1])); // La payload est le deuxième segment du token
          const userId = tokenPayload.id; // Supposons que l'ID utilisateur est stocké sous la clé 'id'
          console.log("User ID:", userId);
  
          // Redirection ou autre action après connexion réussie
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        if (err.status === 403) {
          console.error("Invalid email or password");
          this.isConnectionError = true;
        } else {
          console.error("An unexpected error occurred:", err);
        }
      }
    });
  }
}
