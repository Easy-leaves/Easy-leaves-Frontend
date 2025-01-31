import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deconnexion',
  templateUrl: './deconnexion.component.html',
  styleUrl: './deconnexion.component.css'
})
export class DeconnexionComponent {
  constructor(private router: Router) {
    // Vide le localStorage et sessionStorage puis redirige à la page de login
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
