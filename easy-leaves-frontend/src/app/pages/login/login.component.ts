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
    localStorage.clear();
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
        if (response.token) {
          const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
          const userId = tokenPayload.id;
          localStorage.setItem('idUser', userId);
          localStorage.setItem('token', response.token);

          // Redirect to previous URL or home
          const redirectUrl = sessionStorage.getItem('previousUrl') || '/';
          sessionStorage.removeItem('previousUrl');
          this.router.navigate([redirectUrl]);
        }
      },
      error: (err) => {
        if (err.status === 403) {
          this.isConnectionError = true;
        } else {
          console.error("An unexpected error occurred:", err);
        }
      }
    });

  }
}
